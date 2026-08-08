from __future__ import annotations

import json
from pathlib import Path
from typing import Any


import os
import requests

CURRICULUM_PATH = Path(__file__).resolve().parents[2] / "data" / "curriculum.json"
DATA_API_URL = os.getenv("DATA_API_URL", "http://localhost:8001").rstrip("/")


def build_candidate_rag_context(candidate: dict[str, Any] | None, max_items: int = 6) -> str | None:
    """Build compact retrieval context from candidate profile and Data Layer / local curriculum."""
    if not candidate:
        return None

    member = candidate.get("member", {}) if isinstance(candidate, dict) else {}
    candidate_id = member.get("id")

    # Try fetching personalized retrievals from Data Layer API if candidate_id exists
    if candidate_id:
        try:
            res = requests.get(f"{DATA_API_URL}/candidate/{candidate_id}/curriculum", timeout=2)
            if res.ok:
                data = res.json()
                retrievals = data.get("retrievals", [])
                focus_topics = data.get("focus_topics", [])
                if retrievals or focus_topics:
                    lines = [
                        f"Candidate: {member.get('name') or 'Unknown'}",
                        f"Target role: {member.get('jobRole') or 'Technical role'}",
                        f"Experience: {member.get('yearsExperience') or 'Unknown'} years",
                        f"Data Layer Focus Topics: {', '.join(focus_topics) if focus_topics else 'None'}",
                        "Vector DB Retrieved Curriculum Chunks:",
                    ]
                    for item in retrievals[:max_items]:
                        title = item.get("module_title") or f"Day {item.get('day')}"
                        objs = item.get("learning_objectives") or []
                        obj_str = objs[0] if objs else ""
                        lines.append(f"- {title} (Day {item.get('day')}): {obj_str}")
                    return "\n".join(lines)
        except Exception:
            # Fall back to local json retrieval logic if Data API is offline
            pass

    missions = candidate.get("missions", []) if isinstance(candidate, dict) else []
    if not isinstance(missions, list):
        missions = []

    day_lookup = _load_curriculum_day_lookup()
    focus_missions = sorted(missions, key=_mission_priority)[:max_items]

    lines = [
        f"Candidate: {member.get('name') or 'Unknown'}",
        f"Target role: {member.get('jobRole') or 'Technical role'}",
        f"Experience: {member.get('yearsExperience') or 'Unknown'} years",
        "Retrieved learning signals:",
    ]

    for mission in focus_missions:
        if not isinstance(mission, dict):
            continue
        day = mission.get("day")
        title = mission.get("title") or day_lookup.get(day, {}).get("title") or f"Day {day}"
        status = _mission_status(mission)
        attempts = mission.get("attempts")
        curriculum = day_lookup.get(day, {})
        objective = _first_text(curriculum.get("learning_objectives"))
        objective_text = f" Objective: {objective}" if objective else ""
        attempts_text = f", attempts={attempts}" if attempts is not None else ""
        lines.append(f"- {title}: {status}{attempts_text}.{objective_text}")

    return "\n".join(lines)



def first_focus_topic(candidate: dict[str, Any] | None) -> dict[str, Any] | None:
    """Return the most useful curriculum topic to start with for this candidate."""
    context = build_candidate_rag_context(candidate, max_items=1)
    if not context or not candidate:
        return None

    missions = candidate.get("missions", []) if isinstance(candidate, dict) else []
    if not isinstance(missions, list) or not missions:
        return None
    mission = sorted(missions, key=_mission_priority)[0]
    day = mission.get("day")
    curriculum = _load_curriculum_day_lookup().get(day)
    if not curriculum:
        return None
    return {
        "day": int(day),
        "name": curriculum.get("title") or mission.get("title") or f"Day {day}",
        "description": _first_text(curriculum.get("learning_objectives"))
        or f"Discuss {mission.get('title') or f'Day {day}'} in depth.",
    }


def _load_curriculum_day_lookup() -> dict[Any, dict[str, Any]]:
    try:
        with CURRICULUM_PATH.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except (OSError, json.JSONDecodeError):
        return {}

    return {
        day.get("day"): {
            "title": day.get("title"),
            "learning_objectives": day.get("objectives") or day.get("learning_objectives") or day.get("topics") or [],
        }
        for day in data.get("days", [])
        if isinstance(day, dict) and day.get("day") is not None
    }


def _mission_priority(mission: Any) -> tuple[int, int]:
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


def _mission_status(mission: dict[str, Any]) -> str:
    if mission.get("skipped"):
        return "skipped or unknown"
    if mission.get("passed") is False:
        return "not passed"
    if mission.get("passed") is True:
        attempts = int(mission.get("attempts") or 0)
        return "passed with friction" if attempts >= 3 else "passed"
    return str(mission.get("status") or "unknown")


def _first_text(value: Any) -> str | None:
    if isinstance(value, list):
        return next((str(item) for item in value if item), None)
    if value:
        return str(value)
    return None
