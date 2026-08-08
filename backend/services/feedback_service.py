from services.llm_service import generate_feedback


def generate_feedback_report(session: dict) -> dict:
    """Build a completed interview report from the in-memory conversation history."""
    history = session["history"]
    score = round(sum(turn["score"] for turn in history) / len(history), 1)
    llm_feedback = generate_feedback(history)

    if llm_feedback:
        strengths = llm_feedback["strengths"]
        weaknesses = llm_feedback["weaknesses"]
        suggestions = llm_feedback["suggestions"]
    else:
        strengths, weaknesses, suggestions = _fallback_feedback(score)

    return {
        "session_id": session["session_id"],
        "score": score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions,
        "question_breakdown": history,
    }


def _fallback_feedback(score: float) -> tuple[list[str], list[str], list[str]]:
    strengths = ["Completed the full interview and addressed each question."]
    if score >= 7:
        strengths.append("Provided answers with useful technical detail.")
        weaknesses = ["Some answers could include more concrete examples."]
    else:
        weaknesses = ["Several answers need more depth and technical detail."]

    suggestions = [
        "Use a concrete example to support each technical explanation.",
        "Explain trade-offs and edge cases in your answers.",
    ]
    return strengths, weaknesses, suggestions
