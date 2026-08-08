from __future__ import annotations

import asyncio
import json
import logging
import os
from dataclasses import dataclass
from time import perf_counter

import requests
from dotenv import load_dotenv

from app.utils.parser import extract_json_detailed


logger = logging.getLogger(__name__)
load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
OLLAMA_TIMEOUT_SECONDS = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "30"))
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "ollama").strip().lower()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_TIMEOUT_SECONDS = float(os.getenv("GEMINI_TIMEOUT_SECONDS", "30"))
LLM_MAX_CONCURRENT_REQUESTS = max(
    1,
    int(os.getenv("LLM_MAX_CONCURRENT_REQUESTS", os.getenv("OLLAMA_MAX_CONCURRENT_REQUESTS", "2"))),
)
MAX_EVALUATION_ATTEMPTS = 1
OLLAMA_GENERATE_URL = f"{OLLAMA_BASE_URL.rstrip('/')}/api/generate"

QUESTION_PROMPT = '''You are a technical interviewer conducting a live interview on {curriculum_topic} (Day {curriculum_day}).
Curriculum Objective: {curriculum_description}

Candidate Context:
{rag_context}

Previous question asked: "{previous_question}"
Candidate's answer: "{previous_answer}"

Generate the SINGLE next concise technical interview question covering {curriculum_topic} based on their answer. Output ONLY the single question text.'''

EVALUATION_PROMPT = '''You are a technical interviewer evaluating a candidate's answer.
Question: {question}
Answer: {answer}

Analyze the answer for technical depth, accuracy, and clarity based on this rubric:
- Score 1-2: Answer is off-topic, nonsense, single letters/words, or completely irrelevant.
- Score 3-5: Answer is very brief, lacks technical explanation, or has major inaccuracies.
- Score 6-8: Answer shows correct technical understanding with minor omissions.
- Score 9-10: Answer demonstrates deep technical expertise, including architecture or edge cases.

Return ONLY valid JSON with these keys:
- "score": integer score between 1 and 10 based on depth and correctness
- "strength": a concise one-sentence description of what the answer got right
- "weakness": a concise one-sentence description of any missing details or gaps
- "suggestion": a concise one-sentence suggestion for improvement'''


class OllamaUnavailableError(RuntimeError):
    """Ollama could not be contacted or returned an unsuccessful response."""


class OllamaTimeoutError(RuntimeError):
    """Ollama did not respond before the configured deadline."""


class LLMConfigurationError(RuntimeError):
    """The selected LLM provider is not configured correctly."""


class GeminiUnavailableError(RuntimeError):
    """Gemini could not complete a request."""


class GeminiTimeoutError(GeminiUnavailableError):
    """Gemini did not respond before the configured deadline."""


@dataclass(frozen=True)
class EvaluationOutcome:
    result: dict | None
    error: str | None = None

    @property
    def succeeded(self) -> bool:
        return self.result is not None


_llm_semaphore = asyncio.Semaphore(LLM_MAX_CONCURRENT_REQUESTS)


async def call_ollama(
    prompt: str,
    temperature: float = 0.5,
    *,
    max_tokens: int = 50,
    json_output: bool = False,
    evaluation_question: str | None = None,
) -> str:
    """Call local Ollama generate endpoint with tight token caps for ultra-fast response."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }
    if json_output:
        payload["format"] = "json"

    async with _llm_semaphore:
        started_at = perf_counter()
        try:
            response = await asyncio.to_thread(
                requests.post,
                OLLAMA_GENERATE_URL,
                json=payload,
                timeout=OLLAMA_TIMEOUT_SECONDS,
            )
        except requests.Timeout as error:
            elapsed = perf_counter() - started_at
            logger.warning("Ollama timeout elapsed=%.2fs", elapsed)
            raise OllamaTimeoutError("Ollama request timed out") from error
        except requests.RequestException as error:
            logger.error("Ollama unavailable error=%s", error)
            raise OllamaUnavailableError("Ollama is unavailable") from error

        if not response.ok:
            raise OllamaUnavailableError(f"Ollama returned HTTP {response.status_code}")
        try:
            body = response.json()
        except ValueError as error:
            raise OllamaUnavailableError("Ollama returned invalid HTTP JSON") from error
        raw_response = body.get("response")
        if not isinstance(raw_response, str) or not raw_response.strip():
            raise OllamaUnavailableError("Ollama returned an empty response")

        logger.info("Ollama success latency=%.2fs response=%r", perf_counter() - started_at, raw_response[:100])
    return raw_response.strip()


async def call_gemini(
    prompt: str,
    temperature: float = 0.5,
    *,
    max_tokens: int = 50,
    json_output: bool = False,
    evaluation_question: str | None = None,
) -> str:
    """Call Gemini using Google's current ``google-genai`` SDK."""
    if not GEMINI_API_KEY:
        raise LLMConfigurationError("GEMINI_API_KEY is required when LLM_PROVIDER=gemini")

    try:
        from google import genai
        from google.genai import types
    except ImportError as error:
        raise LLMConfigurationError("google-genai must be installed when LLM_PROVIDER=gemini") from error

    config = types.GenerateContentConfig(
        temperature=temperature,
        max_output_tokens=max_tokens,
        response_mime_type="application/json" if json_output else None,
    )
    started_at = perf_counter()
    try:
        async with _llm_semaphore:
            client = genai.Client(
                api_key=GEMINI_API_KEY,
                http_options=types.HttpOptions(timeout=int(GEMINI_TIMEOUT_SECONDS * 1000)),
            )
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=GEMINI_MODEL,
                contents=prompt,
                config=config,
            )
    except TimeoutError as error:
        logger.warning("Gemini timeout elapsed=%.2fs", perf_counter() - started_at)
        raise GeminiTimeoutError("Gemini request timed out") from error
    except Exception as error:
        logger.error("Gemini unavailable error=%s", error)
        raise GeminiUnavailableError("Gemini is unavailable") from error

    raw_response = getattr(response, "text", None)
    if not isinstance(raw_response, str) or not raw_response.strip():
        raise GeminiUnavailableError("Gemini returned an empty response")
    logger.info("Gemini success latency=%.2fs response=%r", perf_counter() - started_at, raw_response[:100])
    return raw_response.strip()


async def call_llm(
    prompt: str,
    temperature: float = 0.5,
    *,
    max_tokens: int = 50,
    json_output: bool = False,
    evaluation_question: str | None = None,
) -> str:
    """Route requests to the environment-selected LLM provider."""
    if LLM_PROVIDER == "ollama":
        return await call_ollama(prompt, temperature, max_tokens=max_tokens, json_output=json_output, evaluation_question=evaluation_question)
    if LLM_PROVIDER == "gemini":
        return await call_gemini(prompt, temperature, max_tokens=max_tokens, json_output=json_output, evaluation_question=evaluation_question)
    raise LLMConfigurationError("LLM_PROVIDER must be either 'ollama' or 'gemini'")


async def generate_question(
    previous_q: str,
    previous_a: str,
    *,
    curriculum_topic: dict | None = None,
    history: list[dict] | None = None,
    previous_evaluation: dict | None = None,
    rag_context: str | None = None,
) -> str:
    """Generate an adaptive question using lean high-performance prompts."""
    curriculum_topic = curriculum_topic or {
        "day": 1,
        "name": "General Technical Interview",
        "description": "Continue the technical interview.",
    }
    prompt = QUESTION_PROMPT.format(
        previous_question=previous_q[:120],
        previous_answer=previous_a[:200],
        curriculum_day=curriculum_topic.get("day", 1),
        curriculum_topic=curriculum_topic.get("name", "Technical Architecture"),
        curriculum_description=curriculum_topic.get("description", "Master course objectives"),
        rag_context=rag_context or "No context available.",
    )
    try:
        question = await call_llm(prompt, temperature=0.5, max_tokens=50)
    except (OllamaUnavailableError, OllamaTimeoutError, GeminiUnavailableError, GeminiTimeoutError, LLMConfigurationError):
        logger.warning("Using topic fallback question after LLM timeout/error")
        return _get_topic_fallback(curriculum_topic, history)

    # Clean up whitespace and quotes
    question = " ".join(question.replace("\n", " ").split()).strip(' "\'')

    # Strip common LLM preambles
    for preamble in [
        "Here is the next question:",
        "Here's a question:",
        "Next question:",
        "Here's your next question:",
        "Question:",
        "Sure, here is a follow-up question:",
        "Here is a follow-up question:",
    ]:
        if question.lower().startswith(preamble.lower()):
            question = question[len(preamble):].strip(' "\'')

    # Ensure ending punctuation
    if not question.endswith("?") and not question.endswith("."):
        question = question + "?"
    elif question.endswith("."):
        question = question[:-1] + "?"

    # Cap length reasonably at 60 words
    words = question.split()
    if len(words) > 60:
        question = " ".join(words[:60]).rstrip(".,;") + "?"

    if not question or len(words) < 3:
        return _get_topic_fallback(curriculum_topic, history)

    return question


def _get_topic_fallback(curriculum_topic: dict, history: list[dict] | None = None) -> str:
    """Return a topic-specific fallback question if Ollama is unavailable."""
    day = curriculum_topic.get("day", 1)
    name = curriculum_topic.get("name", "Technical Fundamentals")

    fallbacks_by_day = {
        1: "Can you describe your experience setting up Python development environments and managing virtual environments?",
        2: "How do you design RESTful API endpoints and handle HTTP status codes effectively in FastAPI?",
        3: "What strategies do you use for data modeling, SQL query optimization, and indexing in relational databases?",
        4: "How do you implement authentication, authorization, and secure secrets management in backend services?",
        5: "What approaches and tools do you use for logging, monitoring, and diagnosing production performance bottlenecks?",
    }

    base_fallback = fallbacks_by_day.get(day, f"Can you elaborate on your practical experience with {name}?")
    history = history or []
    asked_questions = {h.get("question") for h in history}
    if base_fallback in asked_questions:
        return f"Could you walk me through a specific project where you applied {name}?"

    return base_fallback


async def evaluate_answer(question: str, answer: str) -> EvaluationOutcome:
    """Evaluate candidate answer with fast single-attempt evaluation and heuristic backup."""
    clean_ans = answer.strip()
    words = len(clean_ans.split())

    # Pre-check for single-letter/word or empty/very short responses (< 4 words or < 15 chars)
    if words < 4 or len(clean_ans) < 15:
        return EvaluationOutcome(result={
            "score": 1,
            "strength": "The candidate provided a response.",
            "weakness": "The response is too brief (e.g. single character or few words) to demonstrate any technical knowledge.",
            "suggestion": "Provide a complete technical explanation with details and architectural considerations."
        })

    prompt = EVALUATION_PROMPT.format(question=question[:120], answer=answer[:300])
    logger.info("Evaluation Prompt: %s", prompt)
    try:
        raw_response = await call_llm(
            prompt,
            temperature=0.2,
            max_tokens=130,
            json_output=True,
            evaluation_question=question,
        )
        evaluation, parse_error = extract_json_detailed(raw_response)
        if evaluation is not None and isinstance(evaluation.get("score"), (int, float)):
            score = int(evaluation["score"])
            # Enforce reasonable score caps based on length
            if words < 8 or len(clean_ans) < 40:
                score = min(score, 3)
            elif words < 15 or len(clean_ans) < 80:
                score = min(score, 5)
            evaluation["score"] = score
            return EvaluationOutcome(result=evaluation)
    except Exception as error:
        logger.warning("LLM evaluation call failed question=%r error=%s", question, error)

    # Heuristic evaluation fallback based on answer length & detail if Ollama is busy
    if words < 4 or len(clean_ans) < 15:
        heuristic_score = 1
    else:
        heuristic_score = min(9, max(3, round(words / 6)))
    return EvaluationOutcome(result={
        "score": heuristic_score,
        "strength": "Provided relevant technical response covering core concepts.",
        "weakness": "Could expand further on specific edge cases and metrics.",
        "suggestion": "Include architectural trade-offs in future responses."
    })

