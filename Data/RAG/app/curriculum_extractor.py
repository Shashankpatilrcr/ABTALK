import json
from pathlib import Path
from typing import Any


BACKEND_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CURRICULUM_PATH = BACKEND_ROOT / "data" / "curriculum.json"


def extract_daily_topics(json_path: str | Path) -> list[dict[str, Any]]:
    """
    Return one searchable dictionary per curriculum day.

    The function only uses data that exists in the JSON file. It maps each day
    to its module by checking whether the day number falls inside a module's
    inclusive day range.
    """
    with Path(json_path).open("r", encoding="utf-8") as file:
        curriculum = json.load(file)

    modules = curriculum.get("modules", [])
    days = curriculum.get("days", [])
    searchable_days: list[dict[str, Any]] = []

    for day in days:
        day_number = day.get("day")
        module = _find_module_for_day(day_number, modules)

        item: dict[str, Any] = {}

        if "day" in day:
            item["day"] = day["day"]
        if "title" in day:
            item["topic"] = day["title"]
        if "objectives" in day:
            item["learning_objectives"] = day["objectives"]
        if "tools" in day:
            item["tools"] = day["tools"]
        if "type" in day:
            item["type"] = day["type"]

        if module:
            if "n" in module:
                item["module_number"] = module["n"]
            if "title" in module:
                item["module_title"] = module["title"]

        searchable_days.append(item)

    return searchable_days


def _find_module_for_day(
    day_number: Any, modules: list[dict[str, Any]]
) -> dict[str, Any] | None:
    if not isinstance(day_number, int):
        return None

    for module in modules:
        day_range = module.get("days")

        if (
            isinstance(day_range, list)
            and len(day_range) == 2
            and isinstance(day_range[0], int)
            and isinstance(day_range[1], int)
            and day_range[0] <= day_number <= day_range[1]
        ):
            return module

    return None


if __name__ == "__main__":
    extracted = extract_daily_topics(DEFAULT_CURRICULUM_PATH)
    print(json.dumps(extracted, indent=2, ensure_ascii=False))
