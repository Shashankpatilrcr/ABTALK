from __future__ import annotations

from dataclasses import asdict, is_dataclass
from typing import Any


SAMPLE_CANDIDATE = {
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


EXPECTED_TOPIC_LABELS = {
    "recursion": "strong",
    "sorting algorithms": "adequate",
    "dynamic programming": "weak",
    "graphs": "unknown",
    "REST API design": "in_progress",
}


def build_candidate_knowledge_map(candidate_profile: dict[str, Any]) -> Any:
    from backend.app import candidate_processor

    function_names = [
        "build_candidate_knowledge_map",
        "build_knowledge_map",
        "build_candidate_map",
        "process_candidate",
        "process_candidate_profile",
    ]

    for function_name in function_names:
        function = getattr(candidate_processor, function_name, None)
        if callable(function):
            return function(candidate_profile)

    knowledge_map_class = getattr(candidate_processor, "CandidateKnowledgeMap", None)
    if knowledge_map_class is not None:
        constructor_names = [
            "from_candidate_profile",
            "from_profile",
            "from_mission_history",
            "from_dict",
            "build",
        ]

        for constructor_name in constructor_names:
            constructor = getattr(knowledge_map_class, constructor_name, None)
            if callable(constructor):
                if constructor_name == "from_mission_history":
                    return constructor(candidate_profile["mission_history"])
                return constructor(candidate_profile)

        try:
            return knowledge_map_class(candidate_profile)
        except TypeError:
            return knowledge_map_class(candidate_profile["mission_history"])

    raise AttributeError(
        "Could not find a supported candidate_processor API. Expected one of "
        "build_candidate_knowledge_map(...), build_knowledge_map(...), "
        "process_candidate(...), or CandidateKnowledgeMap.from_profile(...)."
    )


def get_topic_label(knowledge_map: Any, topic: str) -> str | None:
    data = normalize_data(knowledge_map)

    direct_label = find_direct_topic_label(data, topic)
    if direct_label:
        return direct_label

    bucket_label = find_bucket_label(data, topic)
    if bucket_label:
        return bucket_label

    return None


def normalize_data(value: Any) -> Any:
    if is_dataclass(value):
        return asdict(value)
    if hasattr(value, "model_dump"):
        return value.model_dump()
    if hasattr(value, "dict") and callable(value.dict):
        return value.dict()
    if hasattr(value, "__dict__"):
        return vars(value)
    return value


def find_direct_topic_label(data: Any, topic: str) -> str | None:
    data = normalize_data(data)

    if isinstance(data, dict):
        if topic in data and isinstance(data[topic], str):
            return data[topic]

        for key in [
            "topic_labels",
            "topics",
            "knowledge_map",
            "candidate_knowledge_map",
            "labels",
        ]:
            if key in data:
                label = find_direct_topic_label(data[key], topic)
                if label:
                    return label

        for value in data.values():
            label = find_direct_topic_label(value, topic)
            if label:
                return label

    if isinstance(data, list):
        for item in data:
            item = normalize_data(item)
            if not isinstance(item, dict):
                continue

            item_topic = item.get("topic") or item.get("name") or item.get("title")
            if item_topic != topic:
                continue

            for label_key in ["label", "bucket", "status", "strength", "level"]:
                label = item.get(label_key)
                if isinstance(label, str):
                    return label

    return None


def find_bucket_label(data: Any, topic: str) -> str | None:
    data = normalize_data(data)
    labels = {"strong", "adequate", "weak", "unknown", "in_progress"}

    if isinstance(data, dict):
        for label in labels:
            bucket = data.get(label)
            if topic_is_in_bucket(topic, bucket):
                return label

        for key in ["buckets", "by_bucket", "by_status", "knowledge_buckets"]:
            if key in data:
                label = find_bucket_label(data[key], topic)
                if label:
                    return label

        for value in data.values():
            label = find_bucket_label(value, topic)
            if label:
                return label

    return None


def topic_is_in_bucket(topic: str, bucket: Any) -> bool:
    bucket = normalize_data(bucket)

    if isinstance(bucket, list):
        for item in bucket:
            item = normalize_data(item)
            if item == topic:
                return True
            if isinstance(item, dict):
                item_topic = item.get("topic") or item.get("name") or item.get("title")
                if item_topic == topic:
                    return True

    if isinstance(bucket, dict):
        return topic in bucket

    return False


def run_tests() -> bool:
    try:
        knowledge_map = build_candidate_knowledge_map(SAMPLE_CANDIDATE)
    except Exception as error:
        print("FAIL setup")
        print(f"Expected: candidate_processor builds a CandidateKnowledgeMap")
        print(f"Actual: {type(error).__name__}: {error}")
        return False

    all_passed = True

    for topic, expected_label in EXPECTED_TOPIC_LABELS.items():
        actual_label = get_topic_label(knowledge_map, topic)

        if actual_label == expected_label:
            print(f"PASS {topic}: {actual_label}")
        else:
            all_passed = False
            print(f"FAIL {topic}")
            print(f"Expected: {expected_label}")
            print(f"Actual: {actual_label}")

    return all_passed


if __name__ == "__main__":
    raise SystemExit(0 if run_tests() else 1)
