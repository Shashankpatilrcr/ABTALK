from pydantic import BaseModel
from typing import Optional, List, Any, Dict


class CandidateMember(BaseModel):
    id: str
    name: str
    jobRole: str
    yearsExperience: int
    education: str
    status: str


class Mission(BaseModel):
    day: int
    title: str
    passed: Optional[bool] = None
    attempts: Optional[int] = None
    skipped: Optional[bool] = None


class Signals(BaseModel):
    commitDays: int
    missionsCompleted: int
    missionsFirstTry: int


class Candidate(BaseModel):
    member: CandidateMember
    missions: List[Mission]
    signals: Signals


class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[Candidate] = None  # only on first call
    message: Optional[str] = None           # only on subsequent calls


class Feedback(BaseModel):
    summary: str
    strengths: List[str]
    gaps: List[str]
    next: List[str]


class InterviewResponse(BaseModel):
    reply: str
    done: bool
    feedback: Optional[Feedback] = None
