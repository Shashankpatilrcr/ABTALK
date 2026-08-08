from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from fastapi import HTTPException

from app.main import app
from app.models.schemas import AnswerRequest
from app.routes.interview import answer_interview_question, get_feedback, start_interview
from app.services.llm_service import EvaluationOutcome, OllamaUnavailableError, evaluate_answer
from app.services.session_service import get_session


def _evaluation(score: int = 7) -> EvaluationOutcome:
    return EvaluationOutcome(
        {
            "score": score,
            "strength": "Clear technical explanation.",
            "weakness": "Could provide more implementation detail.",
            "suggestion": "Add a concrete example and outcome.",
        }
    )


@pytest.mark.asyncio
async def test_interview_starts_with_curriculum_topic() -> None:
    response = await start_interview()
    session = get_session(response.session_id)
    assert response.curriculum_day == 1
    assert response.curriculum_topic == "Python Fundamentals"
    assert session["questions_asked"] == 1
    assert session["answers_answered"] == 0


@pytest.mark.asyncio
async def test_interview_cannot_complete_before_eight_answers() -> None:
    started = await start_interview()
    with patch("app.routes.interview.generate_question", new=AsyncMock(return_value="Follow-up question?")):
        for number in range(1, 8):
            response = await answer_interview_question(
                AnswerRequest(session_id=started.session_id, answer=f"Answer {number} with technical detail.")
            )
            assert response.status == "active"
        completed = await answer_interview_question(
            AnswerRequest(session_id=started.session_id, answer="Answer 8 with technical detail.")
        )
    assert completed.status == "completed"
    assert completed.question_number == 8


@pytest.mark.asyncio
async def test_first_four_answers_cover_four_curriculum_days() -> None:
    started = await start_interview()
    with patch("app.routes.interview.generate_question", new=AsyncMock(return_value="Topic question?")):
        for number in range(4):
            await answer_interview_question(
                AnswerRequest(session_id=started.session_id, answer=f"Answer {number}.")
            )
    session = get_session(started.session_id)
    answered = [item for item in session["history"] if item["answer"] is not None]
    assert {item["curriculum_day"] for item in answered} == {1, 2, 3, 4}


@pytest.mark.asyncio
async def test_followup_gets_previous_answer_and_bounded_context() -> None:
    started = await start_interview()
    generator = AsyncMock(return_value="How did you measure that result?")
    with patch("app.routes.interview.generate_question", new=generator):
        await answer_interview_question(
            AnswerRequest(session_id=started.session_id, answer="I reduced query latency using an index.")
        )
    kwargs = generator.await_args.kwargs
    assert kwargs["history"][0]["answer"] == "I reduced query latency using an index."
    assert kwargs["curriculum_topic"]["day"] == 2


@pytest.mark.asyncio
async def test_session_keeps_question_answer_and_topic_history() -> None:
    started = await start_interview()
    with patch("app.routes.interview.generate_question", new=AsyncMock(return_value="Next question?")):
        await answer_interview_question(AnswerRequest(session_id=started.session_id, answer="A technical answer."))
    session = get_session(started.session_id)
    first_turn = session["history"][0]
    assert first_turn["answer"] == "A technical answer."
    assert first_turn["curriculum_topic"] == "Python Fundamentals"
    assert session["history"][1]["curriculum_day"] == 2


@pytest.mark.asyncio
async def test_feedback_evaluates_all_completed_answers() -> None:
    started = await start_interview()
    session = get_session(started.session_id)
    session["history"] = [
        {
            "question": f"Question {index}?",
            "answer": f"Answer {index}.",
            "curriculum_day": ((index - 1) % 4) + 1,
            "curriculum_topic": f"Topic {((index - 1) % 4) + 1}",
            "evaluation": None,
        }
        for index in range(1, 9)
    ]
    session["status"] = "completed"
    with patch("app.routes.interview.evaluate_answer", new=AsyncMock(return_value=_evaluation(7))):
        feedback = await get_feedback(started.session_id)
    assert feedback.evaluated_count == 8
    assert feedback.total_score == 56
    assert feedback.average_score == 7.0
    assert {result.curriculum_day for result in feedback.results} == {1, 2, 3, 4}


@pytest.mark.asyncio
async def test_failed_evaluation_is_not_counted_as_a_real_score() -> None:
    started = await start_interview()
    session = get_session(started.session_id)
    session["history"] = [
        {
            "question": "Question?",
            "answer": "Answer.",
            "curriculum_day": 1,
            "curriculum_topic": "Python Fundamentals",
            "evaluation": None,
        }
    ]
    session["status"] = "completed"
    with patch(
        "app.routes.interview.evaluate_answer",
        new=AsyncMock(return_value=EvaluationOutcome(result=None, error="invalid JSON")),
    ):
        feedback = await get_feedback(started.session_id)
    assert feedback.evaluated_count == 0
    assert feedback.total_score == 0
    assert feedback.results[0].score is None
    assert feedback.results[0].evaluation_status == "failed"


@pytest.mark.asyncio
async def test_invalid_session_id_returns_404() -> None:
    with pytest.raises(HTTPException) as error:
        await answer_interview_question(AnswerRequest(session_id="not-a-uuid", answer="answer"))
    assert error.value.status_code == 404


@pytest.mark.asyncio
async def test_ollama_failure_returns_explicit_failed_outcome() -> None:
    with patch(
        "app.services.llm_service.call_ollama",
        new=AsyncMock(side_effect=OllamaUnavailableError("offline")),
    ):
        outcome = await evaluate_answer("Question?", "Answer.")
    assert not outcome.succeeded
    assert outcome.error == "offline"


def test_required_endpoints_match_technical_specification() -> None:
    paths = app.openapi()["paths"]
    assert set(paths) >= {"/start-interview", "/answer", "/feedback/{session_id}"}
    assert "post" in paths["/start-interview"]
    assert "post" in paths["/answer"]
    assert "get" in paths["/feedback/{session_id}"]
