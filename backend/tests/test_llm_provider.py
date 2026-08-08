from unittest.mock import AsyncMock, patch

import pytest

from app.services import llm_service


@pytest.mark.asyncio
async def test_ollama_provider_is_selected(monkeypatch) -> None:
    monkeypatch.setattr(llm_service, "LLM_PROVIDER", "ollama")
    with patch.object(llm_service, "call_ollama", new=AsyncMock(return_value="Question?")) as ollama:
        assert await llm_service.call_llm("Prompt") == "Question?"
    ollama.assert_awaited_once()


@pytest.mark.asyncio
async def test_gemini_provider_is_selected(monkeypatch) -> None:
    monkeypatch.setattr(llm_service, "LLM_PROVIDER", "gemini")
    with patch.object(llm_service, "call_gemini", new=AsyncMock(return_value="Question?")) as gemini:
        assert await llm_service.call_llm("Prompt") == "Question?"
    gemini.assert_awaited_once()


@pytest.mark.asyncio
async def test_missing_gemini_key_is_a_clear_configuration_error(monkeypatch) -> None:
    monkeypatch.setattr(llm_service, "GEMINI_API_KEY", "")
    with pytest.raises(llm_service.LLMConfigurationError, match="GEMINI_API_KEY"):
        await llm_service.call_gemini("Prompt")


@pytest.mark.asyncio
async def test_question_falls_back_when_selected_provider_fails(monkeypatch) -> None:
    monkeypatch.setattr(llm_service, "LLM_PROVIDER", "gemini")
    with patch.object(llm_service, "call_gemini", new=AsyncMock(side_effect=llm_service.GeminiUnavailableError("offline"))):
        question = await llm_service.generate_question("Previous?", "A sufficiently detailed previous answer.")
    assert question.endswith("?")


@pytest.mark.asyncio
async def test_evaluation_uses_heuristic_fallback_when_provider_fails(monkeypatch) -> None:
    monkeypatch.setattr(llm_service, "LLM_PROVIDER", "gemini")
    with patch.object(llm_service, "call_gemini", new=AsyncMock(side_effect=llm_service.GeminiUnavailableError("offline"))):
        outcome = await llm_service.evaluate_answer("Question?", "This answer contains enough technical detail to avoid the short answer check.")
    assert outcome.succeeded
    assert outcome.result["score"] >= 3
