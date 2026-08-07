from fastapi import APIRouter, HTTPException
from app.models.schemas import InterviewRequest, InterviewResponse

router = APIRouter()


@router.post("/interview", response_model=InterviewResponse)
async def interview(request: InterviewRequest):
    """
    Single endpoint for the entire interview lifecycle.
    - First call (no message): starts the interview session
    - Subsequent calls (with message): continues the conversation
    - Returns done=True with feedback when complete
    """
    # TODO: Wire up to orchestrator service
    raise HTTPException(status_code=501, detail="Not implemented yet")
