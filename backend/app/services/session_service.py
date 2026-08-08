from __future__ import annotations

import os
from datetime import datetime, timezone
from threading import RLock
from uuid import UUID, uuid4

# PRD §5.3 — minimum coverage requirements (overridable via env)
MIN_QUESTIONS: int = max(8, int(os.getenv("MIN_QUESTIONS", "8")))
MIN_DAYS: int = max(4, int(os.getenv("MIN_DAYS", "4")))
MAX_QUESTIONS: int = max(MIN_QUESTIONS, int(os.getenv("MAX_QUESTIONS", "15")))  # PRD §9 hard cap

# Process-local storage: do not run multiple workers until this repository is
# replaced with shared storage such as Redis or PostgreSQL.
_sessions: dict[str, dict] = {}
_lock = RLock()


def create_session(
    first_question: str,
    curriculum_topic: dict,
    *,
    candidate: dict | None = None,
    rag_context: str | None = None,
    role: str | None = None,
    difficulty: str = "medium",
) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    session_id = str(uuid4())
    session = {
        "session_id": session_id,
        "history": [
            {
                "question": first_question,
                "answer": None,
                "curriculum_day": curriculum_topic["day"],
                "curriculum_topic": curriculum_topic["name"],
                "evaluation": None,
            }
        ],
        "question_count": 0,       # completed answer count (compatibility alias)
        "questions_asked": 1,      # total questions posed (including unanswered current)
        "answers_answered": 0,     # PRD: questions_asked counter — increments on each answer
        "days_covered": [],        # PRD §6.1 — curriculum days touched so far
        "min_questions": MIN_QUESTIONS,
        "min_days": MIN_DAYS,
        "status": "active",
        "evaluations": {},
        "candidate": candidate,
        "rag_context": rag_context,
        "role": role,
        "difficulty": difficulty,
        "created_at": now,
        "updated_at": now,
    }
    # Seed first day into days_covered
    first_day = curriculum_topic.get("day")
    if first_day is not None:
        session["days_covered"].append(int(first_day))
    with _lock:
        _sessions[session_id] = session
    return session


def get_session(session_id: str) -> dict | None:
    try:
        UUID(session_id, version=4)
    except (ValueError, TypeError, AttributeError):
        return None
    with _lock:
        return _sessions.get(session_id)


def get_all_sessions() -> list[dict]:
    with _lock:
        return list(_sessions.values())


def save_session(session: dict) -> None:
    session["updated_at"] = datetime.now(timezone.utc).isoformat()
    with _lock:
        _sessions[session["session_id"]] = session
