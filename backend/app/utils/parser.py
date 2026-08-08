import json
import re
from typing import Any


EVALUATION_KEYS = ("score", "strength", "weakness", "suggestion")
_FENCE_PATTERN = re.compile(r"```(?:json)?\s*(.*?)\s*```", re.IGNORECASE | re.DOTALL)


def extract_json(raw_text: str, required_keys: tuple[str, ...] = EVALUATION_KEYS) -> dict[str, Any] | None:
    """Extract and validate a JSON object from an LLM response without raising."""
    parsed, _ = extract_json_detailed(raw_text, required_keys)
    return parsed


def extract_json_detailed(
    raw_text: str, required_keys: tuple[str, ...] = EVALUATION_KEYS
) -> tuple[dict[str, Any] | None, str | None]:
    """Return parsed JSON and a diagnostic message suitable for application logs."""
    if not isinstance(raw_text, str) or not raw_text.strip():
        return None, "response text is empty"

    fenced = _FENCE_PATTERN.search(raw_text)
    candidate = fenced.group(1) if fenced else raw_text
    if fenced:
        extracted = _first_json_object(candidate)
        if extracted is not None:
            candidate = extracted
    else:
        candidate = _first_json_object(candidate)
        if candidate is None:
            return None, "no JSON object found in response text"

    try:
        parsed = json.loads(candidate.strip())
    except (json.JSONDecodeError, TypeError):
        # A trailing comma is a common, safe-to-repair local-model mistake.
        repaired = re.sub(r",\s*([}\]])", r"\1", candidate.strip())
        try:
            parsed = json.loads(repaired)
        except (json.JSONDecodeError, TypeError) as error:
            return None, f"JSON parsing failed: {error}"
    if not isinstance(parsed, dict) or any(key not in parsed for key in required_keys):
        return None, f"JSON object is missing required keys: {required_keys}"

    if "score" in required_keys:
        if isinstance(parsed["score"], bool) or not isinstance(parsed["score"], int):
            return None, "score must be an integer"
        score = parsed["score"]
        if not 0 <= score <= 10:
            return None, "score must be between 0 and 10"
        if not all(isinstance(parsed[key], str) and parsed[key].strip() for key in EVALUATION_KEYS[1:]):
            return None, "strength, weakness, and suggestion must be non-empty strings"
        parsed.update({key: parsed[key].strip() for key in EVALUATION_KEYS[1:]})
    return parsed, None


def _first_json_object(text: str) -> str | None:
    """Extract the first balanced JSON object, respecting quoted braces."""
    start = text.find("{")
    if start < 0:
        return None
    depth = 0
    in_string = False
    escaped = False
    for index, character in enumerate(text[start:], start):
        if in_string:
            if escaped:
                escaped = False
            elif character == "\\":
                escaped = True
            elif character == '"':
                in_string = False
            continue
        if character == '"':
            in_string = True
        elif character == "{":
            depth += 1
        elif character == "}":
            depth -= 1
            if depth == 0:
                return text[start : index + 1]
    return None
