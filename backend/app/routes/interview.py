import asyncio
import logging
import os

from fastapi import APIRouter, HTTPException

from app.models.schemas import AnswerRequest, AnswerResponse, FeedbackResponse, StartInterviewResponse
from app.services.curriculum_service import CURRICULUM_TOPICS, covered_topic_names, next_topic
from app.services.llm_service import EvaluationOutcome, evaluate_answer, generate_question
from app.services.session_service import create_session, get_session, save_session


logger = logging.getLogger(__name__)
router = APIRouter(tags=["interview"])
MIN_QUESTIONS = max(8, int(os.getenv("MIN_QUESTIONS", "8")))
MAX_QUESTIONS = max(MIN_QUESTIONS, int(os.getenv("MAX_QUESTIONS", str(MIN_QUESTIONS))))
MIN_CURRICULUM_TOPICS = 4
FIRST_TOPIC = CURRICULUM_TOPICS[0]
FIRST_QUESTION = "Tell me about your Python programming experience and relevant technical work."


@router.post("/start-interview", response_model=StartInterviewResponse)
async def start_interview() -> StartInterviewResponse:
    session = create_session(FIRST_QUESTION, FIRST_TOPIC)
    return StartInterviewResponse(
        session_id=session["session_id"],
        question=FIRST_QUESTION,
        curriculum_day=FIRST_TOPIC["day"],
        curriculum_topic=FIRST_TOPIC["name"],
    )


@router.post("/answer", response_model=AnswerResponse)
async def answer_interview_question(request: AnswerRequest) -> AnswerResponse:
    session = get_session(request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Interview session not found")
    if session["status"] != "active":
        raise HTTPException(status_code=409, detail="This interview has already been completed")

    unanswered = next((item for item in reversed(session["history"]) if item["answer"] is None), None)
    if unanswered is None:
        raise HTTPException(status_code=409, detail="No unanswered interview question exists")
    unanswered["answer"] = request.answer
    session["question_count"] += 1
    session["answers_answered"] += 1

    covered_topics = covered_topic_names(session["history"])
    can_complete = (
        session["answers_answered"] >= MIN_QUESTIONS
        and len(covered_topics) >= MIN_CURRICULUM_TOPICS
        and session["questions_asked"] >= MAX_QUESTIONS
    )
    if can_complete:
        session["status"] = "completed"
        save_session(session)
        return AnswerResponse(
            session_id=session["session_id"],
            question_number=session["questions_asked"],
            status="completed",
            curriculum_day=unanswered["curriculum_day"],
            curriculum_topic=unanswered["curriculum_topic"],
        )

    target_topic = next_topic(session["history"])
    previous_evaluation = unanswered.get("evaluation")
    next_question = await generate_question(
        unanswered["question"],
        request.answer,
        curriculum_topic=target_topic,
        history=session["history"],
        previous_evaluation=previous_evaluation,
    )
    session["history"].append(
        {
            "question": next_question,
            "answer": None,
            "curriculum_day": target_topic["day"],
            "curriculum_topic": target_topic["name"],
            "evaluation": None,
        }
    )
    session["questions_asked"] += 1
    save_session(session)
    return AnswerResponse(
        session_id=session["session_id"],
        next_question=next_question,
        question_number=session["questions_asked"],
        status="active",
        curriculum_day=target_topic["day"],
        curriculum_topic=target_topic["name"],
    )


@router.get("/feedback/{session_id}", response_model=FeedbackResponse)
async def get_feedback(session_id: str) -> FeedbackResponse:
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Interview session not found")
    completed_pairs = [item for item in session["history"] if item["answer"] is not None]

    async def get_evaluation(index: int, item: dict) -> EvaluationOutcome:
        cache_key = str(index)
        cached = session["evaluations"].get(cache_key)
        if cached is not None:
            return EvaluationOutcome(result=cached)
        outcome = await evaluate_answer(item["question"], item["answer"])
        # Do not persist a transient failure. A later feedback request retries it.
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
        covered_curriculum_days=sorted({item["curriculum_day"] for item in completed_pairs}),
        covered_curriculum_topics=sorted(covered_topic_names(completed_pairs)),
    )


def _deduplicate(values: object) -> list[str]:
    return list(dict.fromkeys(value for value in values if value))
