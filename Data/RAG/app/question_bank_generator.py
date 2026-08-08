from __future__ import annotations

import json
from dataclasses import asdict, dataclass, is_dataclass
from pathlib import Path
from typing import Any


BACKEND_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_ROOT / "data"
DEFAULT_CURRICULUM_PATH = DATA_DIR / "curriculum.json"
DEFAULT_QUESTION_BANK_PATH = DATA_DIR / "question_bank.json"


@dataclass
class Question:
    question_id: str
    question: str
    topic: str
    difficulty: str
    learning_objective: str | None
    module_id: int | str | None
    day: int | None


QUESTION_TEMPLATES = {
    "easy": "Can you explain {topic} in simple terms?",
    "medium": "Walk me through applying {topic} to solve a realistic interview problem.",
    "hard": "What tradeoffs, failure modes, or edge cases exist with {topic}?",
}


def generate_question_bank(chunks: list[Any]) -> list[Question]:
    questions: list[Question] = []

    for chunk in chunks:
        topics = get_list_field(chunk, "topics")
        objectives = get_list_field(chunk, "learning_objectives")
        module_id = get_field(chunk, "module_id")
        day = get_field(chunk, "day")

        for topic_index, topic in enumerate(topics):
            for difficulty_index, difficulty in enumerate(["easy", "medium", "hard"]):
                objective = pick_learning_objective(
                    objectives,
                    topic_index + difficulty_index,
                )
                question_id = build_question_id(
                    day=day,
                    topic=topic,
                    difficulty=difficulty,
                    existing_count=len(questions) + 1,
                )

                questions.append(
                    Question(
                        question_id=question_id,
                        question=QUESTION_TEMPLATES[difficulty].format(topic=topic),
                        topic=topic,
                        difficulty=difficulty,
                        learning_objective=objective,
                        module_id=module_id,
                        day=day,
                    )
                )

                # Later LLM swap-in:
                # Replace QUESTION_TEMPLATES[difficulty].format(...) above with a
                # call like generate_question_with_llm(topic, objective, difficulty).
                # Keep the same Question(...) object construction so downstream
                # storage, filtering, and retrieval code does not need to change.

    return questions


def save_question_bank(questions: list[Question], output_path: str | Path) -> None:
    serializable = [question_to_dict(question) for question in questions]
    with Path(output_path).open("w", encoding="utf-8") as file:
        json.dump(serializable, file, indent=2, ensure_ascii=False)


def question_to_dict(question: Question) -> dict[str, Any]:
    return asdict(question)


def pick_learning_objective(
    learning_objectives: list[str],
    index: int,
) -> str | None:
    if not learning_objectives:
        return None
    return learning_objectives[index % len(learning_objectives)]


def get_field(chunk: Any, field_name: str) -> Any:
    if is_dataclass(chunk):
        chunk = asdict(chunk)

    if isinstance(chunk, dict):
        return chunk.get(field_name)

    return getattr(chunk, field_name, None)


def get_list_field(chunk: Any, field_name: str) -> list[str]:
    value = get_field(chunk, field_name)

    if value is None:
        return []
    if isinstance(value, list):
        return [str(item) for item in value]

    return [str(value)]


def build_question_id(
    day: Any,
    topic: str,
    difficulty: str,
    existing_count: int,
) -> str:
    day_part = f"day-{day}" if day is not None else "day-unknown"
    topic_part = slugify(topic)
    return f"{day_part}-{topic_part}-{difficulty}-{existing_count}"


def slugify(value: str) -> str:
    cleaned = []
    for character in value.lower():
        if character.isalnum():
            cleaned.append(character)
        elif cleaned and cleaned[-1] != "-":
            cleaned.append("-")

    return "".join(cleaned).strip("-") or "topic"


def load_curriculum_chunks() -> list[dict[str, Any]]:
    try:
        from .curriculum_ingestion import ingest_curriculum

        return list(ingest_curriculum(DEFAULT_CURRICULUM_PATH))
    except (ImportError, AttributeError):
        return load_chunks_from_existing_extractor(DEFAULT_CURRICULUM_PATH)


def load_chunks_from_existing_extractor(json_path: str | Path) -> list[dict[str, Any]]:
    from .curriculum_extractor import extract_daily_topics

    extracted_days = extract_daily_topics(json_path)
    chunks = []

    for day in extracted_days:
        topic = day.get("topic")
        topics = [topic] if topic else []

        chunks.append(
            {
                "module_id": day.get("module_number"),
                "module_title": day.get("module_title"),
                "day": day.get("day"),
                "topics": topics,
                "learning_objectives": day.get("learning_objectives", []),
            }
        )

    return chunks


if __name__ == "__main__":
    curriculum_chunks = load_curriculum_chunks()
    question_bank = generate_question_bank(curriculum_chunks)
    covered_days = {
        question.day for question in question_bank if question.day is not None
    }

    if len(covered_days) < 4:
        raise ValueError(
            f"Expected question bank to cover at least 4 distinct days; "
            f"covered {len(covered_days)}."
        )

    save_question_bank(question_bank, DEFAULT_QUESTION_BANK_PATH)

    print(f"Generated {len(question_bank)} questions.")
    print(f"Covered {len(covered_days)} distinct days.")
    print(f"Saved {DEFAULT_QUESTION_BANK_PATH}")
