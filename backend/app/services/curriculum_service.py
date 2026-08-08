"""Deterministic curriculum progression for the interview flow."""

from __future__ import annotations

from typing import TypedDict


class CurriculumTopic(TypedDict):
    day: int
    name: str
    description: str


# Derived from backend/data/static_questions.json, which is the only existing
# curriculum source in this repository. Keeping this catalog separate makes a
# future data-backed curriculum replacement local to this module.
CURRICULUM_TOPICS: tuple[CurriculumTopic, ...] = (
    {"day": 1, "name": "Python Fundamentals", "description": "Python programming fundamentals and core data structures."},
    {"day": 2, "name": "Backend REST APIs", "description": "REST API design, HTTP semantics, and backend services."},
    {"day": 3, "name": "Databases", "description": "Data modelling, SQL, indexing, and query performance."},
    {"day": 4, "name": "Security", "description": "Authentication, authorization, and secure backend practices."},
    {"day": 5, "name": "Production Observability", "description": "Diagnosing, monitoring, and improving production services."},
)


def covered_topic_names(history: list[dict]) -> set[str]:
    """Return topics whose assigned question has been answered."""
    return {item["curriculum_topic"] for item in history if item.get("answer") is not None}


def next_topic(history: list[dict]) -> CurriculumTopic:
    """Prioritize uncovered curriculum topics, then allow focused follow-ups."""
    covered = covered_topic_names(history)
    for topic in CURRICULUM_TOPICS:
        if topic["name"] not in covered:
            return topic

    # Once required coverage is met, retaining the latest topic lets Ollama ask
    # an adaptive follow-up instead of mechanically rotating through domains.
    current_topic = history[-1].get("curriculum_topic")
    return next(topic for topic in CURRICULUM_TOPICS if topic["name"] == current_topic)
