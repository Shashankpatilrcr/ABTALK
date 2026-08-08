from fastapi import APIRouter, HTTPException

from models.schemas import AnswerRequest, AnswerResponse, StartInterviewRequest, StartInterviewResponse
from services.llm_service import evaluate_answer, generate_question
from services.memory_service import (
    create_session,
    get_history,
    get_session,
    save_answer,
    set_current_question,
)


router = APIRouter(tags=["interview"])
MAX_QUESTIONS = 5


@router.post("/start-interview", response_model=StartInterviewResponse)
def start_interview(request: StartInterviewRequest) -> StartInterviewResponse:
    first_question = generate_question(
        request.role,
        request.difficulty,
        context=request.context,
    )
    session = create_session(
        candidate_name=request.candidate_name,
        role=request.role,
        difficulty=request.difficulty,
        first_question=first_question,
        context=request.context,
    )
    return StartInterviewResponse(
        session_id=session["session_id"],
        question=session["current_question"],
        status=session["status"],
    )


@router.post("/answer", response_model=AnswerResponse)
def answer_interview_question(request: AnswerRequest) -> AnswerResponse:
    session = get_session(request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Interview session not found")
    if session["status"] == "completed":
        raise HTTPException(status_code=400, detail="This interview has already been completed")

    evaluation = evaluate_answer(session["current_question"], request.answer)
    save_answer(
        session,
        request.answer,
        score=evaluation["score"],
        feedback_note=evaluation["note"],
    )
    history = get_history(session)
    if len(history) >= MAX_QUESTIONS:
        session["status"] = "completed"
        return AnswerResponse(
            session_id=session["session_id"],
            next_question=None,
            status=session["status"],
            message="Interview finished.",
        )

    next_question = generate_question(
        role=session["role"],
        difficulty=session["difficulty"],
        history=history,
        context=session["context"],
    )
    set_current_question(session, next_question)
    return AnswerResponse(
        session_id=session["session_id"],
        next_question=next_question,
        status=session["status"],
        message=None,
    )
