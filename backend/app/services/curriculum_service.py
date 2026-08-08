"""Deterministic curriculum progression for the interview flow."""

from __future__ import annotations

from typing import TypedDict


class CurriculumTopic(TypedDict):
    day: int
    name: str
    description: str


import json
from pathlib import Path

CURRICULUM_PATH = Path(__file__).resolve().parents[2] / "data" / "curriculum.json"


def _load_curriculum_topics() -> list[CurriculumTopic]:
    try:
        with CURRICULUM_PATH.open("r", encoding="utf-8") as file:
            data = json.load(file)
        topics = []
        for day in data.get("days", []):
            if isinstance(day, dict) and day.get("day") is not None:
                day_num = int(day["day"])
                name = day.get("title") or f"Day {day_num}"
                objs = day.get("objectives") or day.get("learning_objectives") or day.get("topics") or []
                desc = objs[0] if objs else f"Master topics from {name}."
                topics.append({"day": day_num, "name": name, "description": desc})
        if topics:
            return topics
    except (OSError, json.JSONDecodeError, ValueError):
        pass

    return [
        {"day": 1, "name": "Python Fundamentals", "description": "Python programming fundamentals and core data structures."},
        {"day": 2, "name": "Backend REST APIs", "description": "REST API design, HTTP semantics, and backend services."},
        {"day": 3, "name": "Databases", "description": "Data modelling, SQL, indexing, and query performance."},
        {"day": 4, "name": "Security", "description": "Authentication, authorization, and secure backend practices."},
        {"day": 5, "name": "Production Observability", "description": "Diagnosing, monitoring, and improving production services."},
    ]


CURRICULUM_TOPICS: list[CurriculumTopic] = _load_curriculum_topics()



def covered_topic_names(history: list[dict]) -> set[str]:
    """Return topics whose assigned question has been answered."""
    return {item["curriculum_topic"] for item in history if item.get("answer") is not None}


def _mission_priority(mission: dict) -> tuple[int, int]:
    if not isinstance(mission, dict):
        return (9, 0)
    if mission.get("skipped"):
        bucket = 0
    elif mission.get("passed") is False:
        bucket = 1
    elif int(mission.get("attempts") or 0) >= 3:
        bucket = 2
    else:
        bucket = 3
    return (bucket, int(mission.get("day") or 0))


def next_topic(history: list[dict], candidate: dict | None = None) -> CurriculumTopic:
    """Prioritize candidate's focus/gap topics dynamically based on their missions, falling back to curriculum order."""
    covered = covered_topic_names(history)

    # 1. If candidate is provided, prioritize their signal gaps (skipped, failed, high attempts)
    if candidate and isinstance(candidate, dict):
        missions = candidate.get("missions", [])
        if isinstance(missions, list) and missions:
            # Sort candidate missions by priority gap
            sorted_missions = sorted(missions, key=_mission_priority)
            
            # Map curriculum days to topics for easy lookup
            day_to_topic = {t["day"]: t for t in CURRICULUM_TOPICS}
            
            for mission in sorted_missions:
                if not isinstance(mission, dict):
                    continue
                day = mission.get("day")
                if day in day_to_topic:
                    topic = day_to_topic[day]
                    if topic["name"] not in covered:
                        return topic

    # 2. Fallback: Loop through curriculum topics sequentially
    for topic in CURRICULUM_TOPICS:
        if topic["name"] not in covered:
            return topic

    # 3. Once required coverage is met, keep generating follow-ups on current topic
    if history:
        current_topic = history[-1].get("curriculum_topic")
        for topic in CURRICULUM_TOPICS:
            if topic["name"] == current_topic:
                return topic

    return CURRICULUM_TOPICS[0]
