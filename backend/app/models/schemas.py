from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator

from app.utils.sanitizer import MAX_ANSWER_LENGTH, sanitize_prompt_input


class AnswerRequest(BaseModel):
    session_id: str
    answer: str = Field(..., min_length=1, max_length=MAX_ANSWER_LENGTH)

    @field_validator("answer")
    @classmethod
    def sanitize_answer(cls, value: str) -> str:
        value = sanitize_prompt_input(value)
        if not value:
            raise ValueError("answer must contain visible characters")
        return value


class StartInterviewRequest(BaseModel):
    candidate: dict[str, Any] | None = None
    role: str | None = Field(default=None, max_length=120)
    difficulty: str = Field(default="medium", max_length=40)


class StartInterviewResponse(BaseModel):
    session_id: str
    question: str
    curriculum_day: int
    curriculum_topic: str
    rag_context: str | None = None


class AnswerResponse(BaseModel):
    session_id: str
    next_question: str | None = None
    question_number: int
    status: Literal["active", "completed"]
    curriculum_day: int | None = None
    curriculum_topic: str | None = None
    progress: dict | None = None            # PRD §3.3 — progress object
    interview_complete: bool = False        # PRD §3.3 — completion signal
    feedback_ready: bool = False            # PRD §3.3 — feedback available flag


class EvaluationResult(BaseModel):
    question: str
    answer: str
    curriculum_day: int
    curriculum_topic: str
    score: int | None = Field(default=None, ge=0, le=10)
    strength: str | None = None
    weakness: str | None = None
    suggestion: str | None = None
    evaluation_status: Literal["succeeded", "failed"]
    evaluation_error: str | None = None


class FeedbackResponse(BaseModel):
    session_id: str
    status: Literal["active", "completed"]
    results: list[EvaluationResult]
    total_score: int
    average_score: float
    overall_strengths: list[str]
    overall_weaknesses: list[str]
    overall_suggestions: list[str]
    evaluated_count: int
    covered_curriculum_days: list[int]
    covered_curriculum_topics: list[str]


class InterviewContractRequest(BaseModel):
    sessionId: str | None = None
    session_id: str | None = None
    candidate: dict[str, Any] | None = None
    message: str | None = None
    role: str | None = None
    difficulty: str = "medium"


class InterviewContractResponse(BaseModel):
    reply: str
    done: bool
    sessionId: str
    feedback: dict[str, Any] | None = None
