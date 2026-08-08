from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


MASTERY_LABELS = {"strong", "adequate", "weak", "unknown", "in_progress"}


@dataclass
class TopicMastery:
    topic: str
    label: str
    score: float | None = None
    attempts: int = 0
    status: str | None = None
    mission_id: str | None = None


@dataclass
class CandidateKnowledgeMap:
    candidate_id: str | None = None
    topics: list[TopicMastery] = field(default_factory=list)
    topic_labels: dict[str, str] = field(default_factory=dict)
    buckets: dict[str, list[str]] = field(
        default_factory=lambda: {label: [] for label in sorted(MASTERY_LABELS)}
    )

    @classmethod
    def from_candidate_profile(
        cls, candidate_profile: dict[str, Any]
    ) -> "CandidateKnowledgeMap":
        return build_candidate_knowledge_map(candidate_profile)

    @classmethod
    def from_profile(cls, candidate_profile: dict[str, Any]) -> "CandidateKnowledgeMap":
        return build_candidate_knowledge_map(candidate_profile)

    @classmethod
    def from_dict(cls, candidate_profile: dict[str, Any]) -> "CandidateKnowledgeMap":
        return build_candidate_knowledge_map(candidate_profile)

    @classmethod
    def from_mission_history(
        cls, mission_history: list[dict[str, Any]]
    ) -> "CandidateKnowledgeMap":
        return build_candidate_knowledge_map({"mission_history": mission_history})

    @classmethod
    def build(cls, candidate_profile: dict[str, Any]) -> "CandidateKnowledgeMap":
        return build_candidate_knowledge_map(candidate_profile)

    def to_dict(self) -> dict[str, Any]:
        return {
            "candidate_id": self.candidate_id,
            "topics": [
                {
                    "topic": topic.topic,
                    "label": topic.label,
                    "score": topic.score,
                    "attempts": topic.attempts,
                    "status": topic.status,
                    "mission_id": topic.mission_id,
                }
                for topic in self.topics
            ],
            "topic_labels": dict(self.topic_labels),
            "buckets": {label: list(topics) for label, topics in self.buckets.items()},
        }


def build_candidate_knowledge_map(
    candidate_profile: dict[str, Any] | str | Path,
) -> CandidateKnowledgeMap:
    profile = load_candidate_profile(candidate_profile)
    mission_history = extract_mission_history(profile)

    knowledge_map = CandidateKnowledgeMap(candidate_id=get_candidate_id(profile))

    for mission in mission_history:
        topic = extract_topic(mission)
        if not topic:
            continue

        score = normalize_score(mission.get("score"))
        attempts = normalize_attempts(mission.get("attempts"))
        status = normalize_status(mission.get("status"))
        label = label_topic(score=score, attempts=attempts, status=status)

        topic_mastery = TopicMastery(
            topic=topic,
            label=label,
            score=score,
            attempts=attempts,
            status=status,
            mission_id=normalize_optional_string(mission.get("mission_id")),
        )

        knowledge_map.topics.append(topic_mastery)
        knowledge_map.topic_labels[topic] = label
        knowledge_map.buckets.setdefault(label, []).append(topic)

    return knowledge_map


def build_knowledge_map(candidate_profile: dict[str, Any] | str | Path):
    return build_candidate_knowledge_map(candidate_profile)


def build_candidate_map(candidate_profile: dict[str, Any] | str | Path):
    return build_candidate_knowledge_map(candidate_profile)


def process_candidate(candidate_profile: dict[str, Any] | str | Path):
    return build_candidate_knowledge_map(candidate_profile)


def process_candidate_profile(candidate_profile: dict[str, Any] | str | Path):
    return build_candidate_knowledge_map(candidate_profile)


def load_candidate_profile(candidate_profile: dict[str, Any] | str | Path) -> dict[str, Any]:
    if isinstance(candidate_profile, dict):
        return candidate_profile

    path = Path(candidate_profile)
    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, dict):
        raise ValueError("Candidate JSON must contain a JSON object at the top level.")

    return data


def extract_mission_history(profile: dict[str, Any]) -> list[dict[str, Any]]:
    for key in ["mission_history", "missions", "history", "completed_missions"]:
        value = profile.get(key)
        if isinstance(value, list):
            return [mission for mission in value if isinstance(mission, dict)]

    candidates = profile.get("candidates")
    if isinstance(candidates, list):
        missions: list[dict[str, Any]] = []
        for candidate in candidates:
            if isinstance(candidate, dict):
                missions.extend(extract_mission_history(candidate))
        return missions

    return []


def get_candidate_id(profile: dict[str, Any]) -> str | None:
    for key in ["candidate_id", "id", "candidateId"]:
        value = profile.get(key)
        if value is not None:
            return str(value)
    return None


def extract_topic(mission: dict[str, Any]) -> str | None:
    for key in ["topic", "name", "title"]:
        value = mission.get(key)
        if value is not None:
            return str(value)
    return None


def label_topic(score: float | None, attempts: int, status: str | None) -> str:
    if status == "skipped":
        return "unknown"
    if status == "in_progress":
        return "in_progress"
    if score is None:
        return "unknown"
    if score >= 0.9 and attempts <= 1:
        return "strong"
    if score >= 0.7:
        return "adequate"
    return "weak"


def normalize_score(value: Any) -> float | None:
    if value is None:
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def normalize_attempts(value: Any) -> int:
    if value is None:
        return 0

    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def normalize_status(value: Any) -> str | None:
    if value is None:
        return None
    return str(value).strip().lower()


def normalize_optional_string(value: Any) -> str | None:
    if value is None:
        return None
    return str(value)


if __name__ == "__main__":
    sample_candidate = {
        "candidate_id": "candidate-test-001",
        "mission_history": [
            {
                "mission_id": "mission-001",
                "topic": "recursion",
                "score": 0.95,
                "attempts": 1,
                "status": "completed",
            },
            {
                "mission_id": "mission-002",
                "topic": "sorting algorithms",
                "score": 0.75,
                "attempts": 3,
                "status": "completed",
            },
            {
                "mission_id": "mission-003",
                "topic": "dynamic programming",
                "score": 0.42,
                "attempts": 2,
                "status": "completed",
            },
            {
                "mission_id": "mission-004",
                "topic": "graphs",
                "score": None,
                "attempts": 0,
                "status": "skipped",
            },
            {
                "mission_id": "mission-005",
                "topic": "REST API design",
                "score": None,
                "attempts": 1,
                "status": "in_progress",
            },
        ],
    }

    print(json.dumps(build_candidate_knowledge_map(sample_candidate).to_dict(), indent=2))
