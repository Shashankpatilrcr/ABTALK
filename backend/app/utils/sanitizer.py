import re


MAX_ANSWER_LENGTH = 2_000
_CONTROL_CHARACTERS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def sanitize_prompt_input(value: str) -> str:
    """Remove prompt-hostile control characters and cap untrusted input length."""
    cleaned = _CONTROL_CHARACTERS.sub(" ", value).strip()
    return cleaned[:MAX_ANSWER_LENGTH]
