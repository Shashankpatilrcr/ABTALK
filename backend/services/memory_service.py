from uuid import uuid4


_sessions: dict[str, dict] = {}


def create_session(
    candidate_name: str | None,
    role: str,
    difficulty: str,
    first_question: str,
    context: str | None = None,
) -> dict:
    session_id = str(uuid4())
    session = {
        "session_id": session_id,
        "candidate_name": candidate_name,
        "role": role,
        "difficulty": difficulty,
        "context": context,
        "current_question": first_question,
        "current_question_index": 0,
        "history": [],
        "status": "in_progress",
    }
    _sessions[session_id] = session
    return session


def get_session(session_id: str) -> dict | None:
    return _sessions.get(session_id)


def get_history(session: dict) -> list[dict]:
    return session["history"]


def save_answer(session: dict, answer: str, score: int, feedback_note: str) -> None:
    session["history"].append(
        {
            "question": session["current_question"],
            "answer": answer,
            "score": score,
            "feedback_note": feedback_note,
        }
    )


def set_current_question(session: dict, question: str) -> None:
    session["current_question"] = question
    session["current_question_index"] += 1
