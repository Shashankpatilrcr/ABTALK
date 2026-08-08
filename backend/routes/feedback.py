from fastapi import APIRouter, HTTPException

from models.schemas import FeedbackResponse
from services.feedback_service import generate_feedback_report
from services.memory_service import get_session


router = APIRouter(tags=["feedback"])


@router.get("/feedback/{session_id}", response_model=FeedbackResponse)
def get_feedback(session_id: str) -> FeedbackResponse:
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Interview session not found")
    if session["status"] != "completed":
        raise HTTPException(status_code=400, detail="Feedback is available after the interview is completed")
    return FeedbackResponse(**generate_feedback_report(session))
