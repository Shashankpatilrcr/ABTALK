import asyncio
import json
import logging
from pathlib import Path

import requests
from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    AnswerRequest,
    AnswerResponse,
    FeedbackResponse,
    InterviewContractRequest,
    InterviewContractResponse,
    StartInterviewRequest,
    StartInterviewResponse,
)
from app.services.curriculum_service import CURRICULUM_TOPICS, covered_topic_names, next_topic
from app.services.llm_service import EvaluationOutcome, evaluate_answer, generate_question
from app.services.rag_service import DATA_API_URL, build_candidate_rag_context, first_focus_topic
from app.services.session_service import (
    MIN_DAYS,
    MIN_QUESTIONS,
    MAX_QUESTIONS,
    create_session,
    get_session,
    save_session,
)


logger = logging.getLogger(__name__)
router = APIRouter(tags=["interview"])

MIN_CURRICULUM_TOPICS = MIN_DAYS   # PRD §1.1: ≥4 curriculum days covered
FIRST_TOPIC = CURRICULUM_TOPICS[0]
FIRST_QUESTION = "Tell me about your Python programming experience and relevant technical work."
CANDIDATES_PATHS = [
    Path(__file__).resolve().parents[2] / "data" / "candidates.json",
    Path(__file__).resolve().parents[3] / "Data" / "RAG" / "data" / "candidates.json",
]
CURRICULUM_PATH = Path(__file__).resolve().parents[2] / "data" / "curriculum.json"


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _build_progress(session: dict) -> dict:
    """PRD §3.3 — progress object included in every API response."""
    return {
        "questions_asked": session["answers_answered"],
        "min_questions": session["min_questions"],
        "days_covered": session["days_covered"],
        "min_days": session["min_days"],
    }


# ─── Data proxy endpoints ─────────────────────────────────────────────────────

@router.get("/candidates")
async def get_candidates() -> dict:
    """Proxy candidate list from Data Layer API or fallback to local candidates.json."""
    try:
        res = requests.get(f"{DATA_API_URL}/candidates", timeout=2)
        if res.ok:
            return res.json()
    except Exception:
        pass

    for candidate_path in CANDIDATES_PATHS:
        if candidate_path.exists():
            try:
                with candidate_path.open("r", encoding="utf-8") as f:
                    data = json.load(f)
                    return {"candidates": data.get("candidates", [])}
            except Exception:
                continue

    raise HTTPException(status_code=500, detail="Could not load candidates dataset")


@router.get("/curriculum")
async def get_curriculum() -> dict:
    """Proxy curriculum data from Data Layer API or fallback to local curriculum.json."""
    try:
        res = requests.get(f"{DATA_API_URL}/curriculum", timeout=2)
        if res.ok:
            return res.json()
    except Exception:
        pass

    try:
        with CURRICULUM_PATH.open("r", encoding="utf-8") as f:
            data = json.load(f)
            return {"curriculum": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load curriculum: {e}") from e


# ─── Interview session endpoints ──────────────────────────────────────────────

@router.post("/start-interview", response_model=StartInterviewResponse)
async def start_interview(request: StartInterviewRequest | None = None) -> StartInterviewResponse:
    """PRD §3.1 — Initialize a new interview session and return the first question."""
    request = request or StartInterviewRequest()
    rag_context = build_candidate_rag_context(request.candidate)
    first_topic = first_focus_topic(request.candidate) or FIRST_TOPIC
    candidate_name = None
    if request.candidate:
        candidate_name = request.candidate.get("member", {}).get("name")
    role = request.role or (request.candidate or {}).get("member", {}).get("jobRole")
    is_personalized_start = bool(candidate_name and rag_context)
    first_question = (
        f"Hi {candidate_name}, let's start with {first_topic['name']}: "
        f"{first_topic['description']}"
    ) if is_personalized_start else FIRST_QUESTION
    if is_personalized_start and not first_question.endswith("?"):
        first_question = f"{first_question} Can you walk me through your experience with it?"
    session = create_session(
        first_question,
        first_topic,
        candidate=request.candidate,
        rag_context=rag_context,
        role=role,
        difficulty=request.difficulty,
    )
    logger.info(
        "Interview started session=%s candidate=%s topic=%s day=%s",
        session["session_id"], candidate_name, first_topic["name"], first_topic["day"],
    )
    return StartInterviewResponse(
        session_id=session["session_id"],
        question=first_question,
        curriculum_day=first_topic["day"],
        curriculum_topic=first_topic["name"],
        rag_context=rag_context,
    )


# PRD §3.1 — versioned alias
@router.post("/api/v1/start-interview", response_model=StartInterviewResponse)
async def start_interview_v1(request: StartInterviewRequest | None = None) -> StartInterviewResponse:
    return await start_interview(request)


@router.post("/answer", response_model=AnswerResponse)
async def answer_interview_question(request: AnswerRequest) -> AnswerResponse:
    """PRD §3.3 — Submit an answer; returns next question or completion signal."""
    session = get_session(request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Interview session not found")
    if session["status"] != "active":
        raise HTTPException(status_code=409, detail="This interview has already been completed")

    # PRD §9 — empty/whitespace-only answers get 400 (Pydantic min_length=1 catches truly empty)
    if not request.answer.strip():
        raise HTTPException(status_code=400, detail="answer_text cannot be empty.")

    unanswered = next((item for item in reversed(session["history"]) if item["answer"] is None), None)
    if unanswered is None:
        raise HTTPException(status_code=409, detail="No unanswered interview question exists")

    unanswered["answer"] = request.answer
    session["question_count"] += 1
    session["answers_answered"] += 1

    # PRD §6.2 — track unique curriculum days covered
    answered_day = unanswered.get("curriculum_day")
    if answered_day is not None:
        day_int = int(answered_day)
        if day_int not in session["days_covered"]:
            session["days_covered"].append(day_int)

    unique_days_covered = len(session["days_covered"])

    # PRD §9 — hard question cap: force completion regardless of follow-up budget
    hit_hard_cap = session["questions_asked"] >= MAX_QUESTIONS

    # PRD §5.3 — complete when ≥ min_questions answered AND ≥ min_days curriculum days covered
    can_complete = (
        session["answers_answered"] >= session["min_questions"]
        and unique_days_covered >= session["min_days"]
    ) or hit_hard_cap

    progress = _build_progress(session)

    if can_complete:
        session["status"] = "completed"
        save_session(session)
        logger.info(
            "Interview completed session=%s answers=%s days=%s hard_cap=%s",
            session["session_id"], session["answers_answered"], unique_days_covered, hit_hard_cap,
        )
        return AnswerResponse(
            session_id=session["session_id"],
            question_number=session["questions_asked"],
            status="completed",
            curriculum_day=unanswered["curriculum_day"],
            curriculum_topic=unanswered["curriculum_topic"],
            progress=progress,
            interview_complete=True,
            feedback_ready=True,
        )

    target_topic = next_topic(session["history"], session.get("candidate"))
    previous_evaluation = unanswered.get("evaluation")
    next_question = await generate_question(
        unanswered["question"],
        request.answer,
        curriculum_topic=target_topic,
        history=session["history"],
        previous_evaluation=previous_evaluation,
        rag_context=session.get("rag_context"),
    )
    new_day = int(target_topic["day"])
    session["history"].append(
        {
            "question": next_question,
            "answer": None,
            "curriculum_day": new_day,
            "curriculum_topic": target_topic["name"],
            "evaluation": None,
        }
    )
    # Track the newly introduced day immediately so progress updates
    if new_day not in session["days_covered"]:
        session["days_covered"].append(new_day)

    session["questions_asked"] += 1
    save_session(session)

    # Refresh progress after state mutation
    progress = _build_progress(session)

    logger.info(
        "Next question generated session=%s q=%s topic=%s day=%s",
        session["session_id"], session["questions_asked"], target_topic["name"], new_day,
    )
    return AnswerResponse(
        session_id=session["session_id"],
        next_question=next_question,
        question_number=session["questions_asked"],
        status="active",
        curriculum_day=target_topic["day"],
        curriculum_topic=target_topic["name"],
        progress=progress,
        interview_complete=False,
        feedback_ready=False,
    )


# PRD §3.3 — versioned alias
@router.post("/api/v1/submit-answer", response_model=AnswerResponse)
async def submit_answer_v1(request: AnswerRequest) -> AnswerResponse:
    return await answer_interview_question(request)


# PRD §3.2 — explicit next-question fetch (for resume / testing flows)
@router.post("/api/v1/next-question")
async def next_question_v1(body: dict) -> dict:
    session_id = body.get("session_id")
    session = get_session(session_id) if session_id else None
    if not session:
        raise HTTPException(status_code=409, detail="session_not_active: session does not exist.")
    if session["status"] != "active":
        raise HTTPException(status_code=409, detail="session_not_active: interview already completed.")
    pending = next((item for item in reversed(session["history"]) if item["answer"] is None), None)
    if not pending:
        raise HTTPException(status_code=409, detail="No pending question found.")
    return {
        "session_id": session_id,
        "next_question": {
            "text": pending["question"],
            "day": pending["curriculum_day"],
            "topic": pending["curriculum_topic"],
        },
        "progress": _build_progress(session),
    }


# ─── Unified legacy contract endpoint ────────────────────────────────────────

@router.post("/api/interview", response_model=InterviewContractResponse)
async def api_interview_contract(request: InterviewContractRequest) -> InterviewContractResponse:
    """Unified endpoint implementing docs/API_CONTRACT.md (kept for backward compatibility)."""
    # First turn: Candidate profile provided → start new session
    if request.candidate or not request.message:
        start_req = StartInterviewRequest(
            candidate=request.candidate,
            role=request.role,
            difficulty=request.difficulty,
        )
        start_res = await start_interview(start_req)
        return InterviewContractResponse(
            sessionId=start_res.session_id,
            reply=start_res.question,
            done=False,
        )

    # Subsequent turn: submit answer
    session_id = request.sessionId or request.session_id
    if not session_id:
        raise HTTPException(status_code=400, detail="sessionId is required for conversation turn")

    ans_req = AnswerRequest(session_id=session_id, answer=request.message)
    ans_res = await answer_interview_question(ans_req)

    if ans_res.status == "completed":
        fb_res = await get_feedback(session_id)
        return InterviewContractResponse(
            sessionId=session_id,
            reply="Thank you, that concludes our interview.",
            done=True,
            feedback={
                "summary": f"Candidate completed technical interview with average score {fb_res.average_score}/10.",
                "strengths": fb_res.overall_strengths,
                "gaps": fb_res.overall_weaknesses,
                "next": fb_res.overall_suggestions,
            },
        )

    return InterviewContractResponse(
        sessionId=session_id,
        reply=ans_res.next_question or "",
        done=False,
    )


# ─── Feedback endpoint ────────────────────────────────────────────────────────

@router.get("/feedback/{session_id}", response_model=FeedbackResponse)
async def get_feedback(session_id: str) -> FeedbackResponse:
    """PRD §3.4 — Return structured feedback. Only available once interview_complete=true."""
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Interview session not found")

    # PRD §3.4 — guard: feedback only available when complete
    if session["status"] != "completed":
        raise HTTPException(
            status_code=404,
            detail="feedback_not_available: Interview is not yet complete or session does not exist.",
        )

    completed_pairs = [item for item in session["history"] if item["answer"] is not None]

    async def get_evaluation(index: int, item: dict) -> EvaluationOutcome:
        cache_key = str(index)
        cached = session["evaluations"].get(cache_key)
        if cached is not None:
            return EvaluationOutcome(result=cached)
        outcome = await evaluate_answer(item["question"], item["answer"])
        # Do not persist a transient failure — a later feedback request retries it.
        if outcome.succeeded:
            session["evaluations"][cache_key] = outcome.result
            item["evaluation"] = outcome.result
        return outcome

    evaluations = await asyncio.gather(
        *(get_evaluation(index, item) for index, item in enumerate(completed_pairs))
    )
    results = []
    for item, outcome in zip(completed_pairs, evaluations, strict=True):
        if outcome.succeeded:
            results.append(
                {
                    "question": item["question"],
                    "answer": item["answer"],
                    "curriculum_day": item["curriculum_day"],
                    "curriculum_topic": item["curriculum_topic"],
                    **outcome.result,
                    "evaluation_status": "succeeded",
                    "evaluation_error": None,
                }
            )
        else:
            results.append(
                {
                    "question": item["question"],
                    "answer": item["answer"],
                    "curriculum_day": item["curriculum_day"],
                    "curriculum_topic": item["curriculum_topic"],
                    "score": None,
                    "strength": None,
                    "weakness": None,
                    "suggestion": None,
                    "evaluation_status": "failed",
                    "evaluation_error": outcome.error,
                }
            )
    save_session(session)
    successful_results = [result for result in results if result["evaluation_status"] == "succeeded"]
    total_score = sum(result["score"] for result in successful_results)
    count = len(successful_results)
    return FeedbackResponse(
        session_id=session["session_id"],
        status=session["status"],
        results=results,
        total_score=total_score,
        average_score=round(total_score / count, 1) if count else 0.0,
        overall_strengths=_deduplicate(result["strength"] for result in successful_results),
        overall_weaknesses=_deduplicate(result["weakness"] for result in successful_results),
        overall_suggestions=_deduplicate(result["suggestion"] for result in successful_results),
        evaluated_count=count,
        covered_curriculum_days=sorted(set(session["days_covered"])),
        covered_curriculum_topics=sorted(covered_topic_names(completed_pairs)),
    )


# PRD §3.4 — versioned alias
@router.get("/api/v1/feedback/{session_id}", response_model=FeedbackResponse)
async def get_feedback_v1(session_id: str) -> FeedbackResponse:
    return await get_feedback(session_id)


# ─── Internal helpers ─────────────────────────────────────────────────────────

def _deduplicate(values: object) -> list[str]:
    return list(dict.fromkeys(value for value in values if value))
