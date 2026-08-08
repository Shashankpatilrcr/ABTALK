from __future__ import annotations

import json
from dataclasses import asdict, is_dataclass
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException

from .candidate_processor import CandidateKnowledgeMap, process_candidate
from .question_bank_generator import generate_question_bank

try:
    from .curriculum_ingestion import ingest_curriculum
except ImportError:
    ingest_curriculum = None

try:
    from .vector_store_chromadb import build_vector_db
except ImportError:
    from .curriculum_vector_db import build_vector_db

try:
    from .rag_pipeline import retrieve_for_candidate
except ImportError:
    retrieve_for_candidate = None

from .rag_pipeline import (
    build_personalized_retrievals,
    convert_candidate_profile,
    get_topics_by_label,
    load_curriculum_chunks,
)


APP_ROOT = Path(__file__).resolve().parent
BACKEND_ROOT = APP_ROOT.parent
DATA_DIR = BACKEND_ROOT / "data"
STORAGE_DIR = BACKEND_ROOT / "storage"
CURRICULUM_PATH = DATA_DIR / "curriculum.json"
CANDIDATES_PATH = DATA_DIR / "candidates.json"
PERSIST_PATH = STORAGE_DIR / "api_chroma_db"


app = FastAPI(
    title="Interview Prep RAG API",
    version="1.0.0",
    description=(
        "Run from backend with: uvicorn app.api:app --reload. "
        "Then open http://127.0.0.1:8000/docs or test with curl."
    ),
)


class AppState:
    curriculum_chunks: list[Any]
    collection: Any
    candidates: dict[str, dict[str, Any]]
    knowledge_maps: dict[str, CandidateKnowledgeMap]
    question_bank: list[Any]

    def __init__(self) -> None:
        self.curriculum_chunks = []
        self.collection = None
        self.candidates = {}
        self.knowledge_maps = {}
        self.question_bank = []


state = AppState()


@app.on_event("startup")
def startup() -> None:
    state.curriculum_chunks = normalize_curriculum_chunks(load_curriculum())
    state.collection = build_vector_db(state.curriculum_chunks, PERSIST_PATH)
    state.candidates = load_candidates(CANDIDATES_PATH)
    state.knowledge_maps = {
        candidate_id: process_candidate(candidate_profile)
        for candidate_id, candidate_profile in state.candidates.items()
    }
    state.question_bank = generate_question_bank(state.curriculum_chunks)


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "curriculum_chunks": len(state.curriculum_chunks),
        "candidates": len(state.candidates),
        "questions": len(state.question_bank),
        "vector_collection": "curriculum" if state.collection is not None else None,
    }


@app.get("/candidate/{candidate_id}/summary")
def candidate_summary(candidate_id: str) -> dict[str, Any]:
    knowledge_map = get_candidate_knowledge_map(candidate_id)
    return to_jsonable(knowledge_map)


@app.get("/candidate/{candidate_id}/curriculum")
def candidate_curriculum(candidate_id: str, top_k: int = 3) -> dict[str, Any]:
    knowledge_map = get_candidate_knowledge_map(candidate_id)

    if callable(retrieve_for_candidate):
        retrievals = retrieve_for_candidate(knowledge_map, state.collection, top_k)
    else:
        retrievals = build_personalized_retrievals(knowledge_map, state.collection, top_k)

    return {
        "candidate_id": candidate_id,
        "focus_topics": weak_and_unknown_topics(knowledge_map),
        "retrievals": [to_jsonable(retrieval) for retrieval in retrievals],
    }


@app.get("/candidate/{candidate_id}/questions")
def candidate_questions(candidate_id: str) -> dict[str, Any]:
    knowledge_map = get_candidate_knowledge_map(candidate_id)
    focus_topics = set(weak_and_unknown_topics(knowledge_map))

    matching_questions = [
        question
        for question in state.question_bank
        if get_question_topic(question) in focus_topics
    ]

    return {
        "candidate_id": candidate_id,
        "focus_topics": sorted(focus_topics),
        "questions": [to_jsonable(question) for question in matching_questions],
    }


def load_curriculum() -> list[Any]:
    if ingest_curriculum is not None:
        return list(ingest_curriculum(CURRICULUM_PATH))
    return load_curriculum_chunks(CURRICULUM_PATH)


def normalize_curriculum_chunks(chunks: list[Any]) -> list[dict[str, Any]]:
    normalized = []

    for index, chunk in enumerate(chunks, start=1):
        data = to_jsonable(chunk)
        if not isinstance(data, dict):
            continue

        day = data.get("day")
        topics = ensure_list(data.get("topics"))
        if not topics and data.get("topic"):
            topics = [data["topic"]]

        normalized.append(
            {
                "chunk_id": data.get("chunk_id") or f"day-{day or index}",
                "module_id": data.get("module_id") or data.get("module_number"),
                "module_title": data.get("module_title"),
                "day": day,
                "topics": topics,
                "learning_objectives": ensure_list(
                    data.get("learning_objectives") or data.get("objectives")
                ),
                "tools": ensure_list(data.get("tools")),
            }
        )

    return normalized


def load_candidates(path: str | Path) -> dict[str, dict[str, Any]]:
    with Path(path).open("r", encoding="utf-8") as file:
        data = json.load(file)

    raw_candidates = data.get("candidates", [])
    candidates: dict[str, dict[str, Any]] = {}

    for raw_candidate in raw_candidates:
        profile = convert_candidate_profile(raw_candidate)
        candidate_id = profile.get("candidate_id")
        if candidate_id:
            candidates[str(candidate_id)] = profile

    return candidates


def get_candidate_knowledge_map(candidate_id: str) -> CandidateKnowledgeMap:
    try:
        return state.knowledge_maps[candidate_id]
    except KeyError:
        raise HTTPException(
            status_code=404,
            detail=f"Candidate '{candidate_id}' was not found.",
        ) from None


def weak_and_unknown_topics(knowledge_map: CandidateKnowledgeMap) -> list[str]:
    return get_topics_by_label(knowledge_map, "weak") + get_topics_by_label(
        knowledge_map, "unknown"
    )


def get_question_topic(question: Any) -> str | None:
    if is_dataclass(question):
        return getattr(question, "topic", None)
    if isinstance(question, dict):
        return question.get("topic")
    return getattr(question, "topic", None)


def ensure_list(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item) for item in value]
    return [str(value)]


def to_jsonable(value: Any) -> Any:
    if is_dataclass(value):
        return asdict(value)
    if hasattr(value, "to_dict") and callable(value.to_dict):
        return value.to_dict()
    if isinstance(value, dict):
        return {key: to_jsonable(item) for key, item in value.items()}
    if isinstance(value, list):
        return [to_jsonable(item) for item in value]
    return value


# Run:
#   uvicorn api:app --reload
#
# Try:
#   curl http://127.0.0.1:8000/health
#   curl http://127.0.0.1:8000/candidate/CAND-020/summary
#   curl http://127.0.0.1:8000/candidate/CAND-020/curriculum
#   curl http://127.0.0.1:8000/candidate/CAND-020/questions
#
# Or open:
#   http://127.0.0.1:8000/docs
