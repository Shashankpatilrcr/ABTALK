from typing import Literal

from pydantic import BaseModel, Field


class StartInterviewRequest(BaseModel):
    candidate_name: str | None = None
    role: str = Field(..., min_length=1, examples=["Backend Developer"])
    difficulty: str = Field(default="medium", min_length=1, examples=["medium"])
    context: str | None = Field(
        default=None,
        max_length=20_000,
        description="Optional resume or job context supplied by a future RAG module.",
    )


class StartInterviewResponse(BaseModel):
    session_id: str
    question: str
    status: Literal["in_progress"]


class AnswerRequest(BaseModel):
    session_id: str
    answer: str = Field(..., min_length=1)


class AnswerResponse(BaseModel):
    session_id: str
    next_question: str | None
    status: Literal["in_progress", "completed"]
    message: str | None = None


class QuestionBreakdown(BaseModel):
    question: str
    answer: str
    score: int
    feedback_note: str


class FeedbackResponse(BaseModel):
    session_id: str
    score: float
    strengths: list[str]
    weaknesses: list[str]
    suggestions: list[str]
    question_breakdown: list[QuestionBreakdown]
