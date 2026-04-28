#!/usr/bin/env python3
"""
Create frontend-ready TypeScript instrument data modules under:
  website/src/lib/data/

Outputs:
- one generated file per instrument
- one generated index file that re-exports a slug map
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any


INSTRUMENT_CONFIGS = [
    {"slug": "big-five", "measure_id": "big5", "output_id": "big5"},
    {"slug": "bis-bas", "measure_id": "bis-bas", "output_id": "bis-bas"},
    {"slug": "barchard-ei", "measure_id": "barchard", "output_id": "barchard"},
    {"slug": "via-is", "measure_id": "via", "output_id": "via"},
    {"slug": "trait-ei", "measure_id": "traitei", "output_id": "traitei"},
]


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as file:
        return list(csv.DictReader(file))


def clean_string(value: str | None) -> str:
    return (value or "").strip()


def maybe_string(value: str | None) -> str | None:
    cleaned = clean_string(value)
    return cleaned if cleaned else None


def parse_number(value: str | None) -> int | float | None:
    cleaned = clean_string(value)
    if cleaned in {"", "NA", "NaN"}:
        return None

    try:
        numeric = float(cleaned)
    except ValueError as error:
        raise ValueError(f"Could not parse numeric value: {cleaned!r}") from error

    if numeric.is_integer():
        return int(numeric)

    return numeric


def slug_to_identifier(slug: str) -> str:
    parts = slug.replace("-", "_").split("_")
    return "".join(part.capitalize() for part in parts)


def slug_to_filename(slug: str) -> str:
    return f"generated_{slug.replace('-', '_')}.ts"


def build_items(measures_dir: Path, measure_id: str) -> list[dict[str, Any]]:
    rows = read_csv_rows(measures_dir / f"{measure_id}.csv")
    items: list[dict[str, Any]] = []

    for row in rows:
        scale = clean_string(row.get("scale")) or clean_string(row.get("subscale"))
        scale_id = clean_string(row.get("scale_id")) or clean_string(
            row.get("subscale_id")
        )
        subscale = maybe_string(row.get("subscale"))
        subscale_id = maybe_string(row.get("subscale_id"))

        if not scale or not scale_id:
            raise ValueError(
                f"Missing scale or scale_id for item {row.get('id')!r} in {measure_id}.csv"
            )

        item = {
            "id": clean_string(row.get("id")),
            "prompt": clean_string(row.get("name")),
            "scale": scale,
            "scaleId": scale_id,
            "key": clean_string(row.get("key")),
        }

        if subscale:
            item["subscale"] = subscale
        if subscale_id:
            item["subscaleId"] = subscale_id

        items.append(item)

    return items


def read_descriptives(path: Path) -> dict[tuple[str, str], dict[str, Any]]:
    descriptives: dict[tuple[str, str], dict[str, Any]] = {}

    for row in read_csv_rows(path):
        key = (clean_string(row.get("score_level")), clean_string(row.get("score_id")))
        descriptives[key] = {
            "n": parse_number(row.get("n")),
            "items": parse_number(row.get("items")),
            "mean": parse_number(row.get("mean")),
            "sd": parse_number(row.get("sd")),
            "median": parse_number(row.get("median")),
            "min": parse_number(row.get("min")),
            "max": parse_number(row.get("max")),
            "theoreticalMin": parse_number(row.get("theoretical_min")),
            "theoreticalMax": parse_number(row.get("theoretical_max")),
        }

    return descriptives


def read_reliabilities(path: Path) -> dict[tuple[str, str], dict[str, Any]]:
    reliabilities: dict[tuple[str, str], dict[str, Any]] = {}

    for row in read_csv_rows(path):
        key = (clean_string(row.get("score_level")), clean_string(row.get("score_id")))
        reliabilities[key] = {
            "n": parse_number(row.get("n")),
            "items": parse_number(row.get("items")),
            "alpha": parse_number(row.get("alpha")),
            "omegaTotal": parse_number(row.get("omega_total")),
            "meanInteritemR": parse_number(row.get("mean_interitem_r")),
        }

    return reliabilities


def read_reference_rows(path: Path) -> dict[tuple[str, str], dict[str, Any]]:
    grouped: dict[tuple[str, str], dict[str, Any]] = {}

    for row in read_csv_rows(path):
        score_level = clean_string(row.get("score_level"))
        score_name = clean_string(row.get("score"))
        score_id = clean_string(row.get("score_id"))
        key = (score_level, score_id)

        if key not in grouped:
            grouped[key] = {
                "scoreLevel": score_level,
                "scoreName": score_name,
                "scoreId": score_id,
                "referenceRows": [],
            }

        grouped[key]["referenceRows"].append(
            {
                "rawScore": parse_number(row.get("raw_score")),
                "standardScore": parse_number(row.get("standard_score")),
                "percentileRank": parse_number(row.get("percentile_rank")),
                "ci90": clean_string(row.get("ci_90")),
                "qualitativeDescriptor": clean_string(
                    row.get("qualitative_descriptor")
                ),
            }
        )

    for group in grouped.values():
        group["referenceRows"].sort(key=lambda row: row["rawScore"])

    return grouped


def build_norms(output_dir: Path, output_id: str) -> dict[str, dict[str, Any]]:
    instrument_dir = output_dir / output_id
    descriptives = read_descriptives(
        instrument_dir / f"{output_id}_score_descriptives.csv"
    )
    reliabilities = read_reliabilities(
        instrument_dir / f"{output_id}_score_reliabilities.csv"
    )
    reference_groups = read_reference_rows(
        instrument_dir / f"{output_id}_score_reference_tables.csv"
    )

    norms_by_score_id: dict[str, dict[str, Any]] = {}
    for key, norm in reference_groups.items():
        descriptive = descriptives.get(key)
        reliability = reliabilities.get(key)

        if descriptive is not None:
            norm["descriptives"] = descriptive
        if reliability is not None:
            norm["reliability"] = reliability

        norms_by_score_id[norm["scoreId"]] = norm

    return norms_by_score_id


def build_generated_data(repo_root: Path) -> dict[str, dict[str, Any]]:
    measures_dir = repo_root / "measures"
    output_dir = repo_root / "output"
    generated: dict[str, dict[str, Any]] = {}

    for config in INSTRUMENT_CONFIGS:
        slug = config["slug"]
        generated[slug] = {
            "instrumentSlug": slug,
            "items": build_items(measures_dir, config["measure_id"]),
            "normsByScoreId": build_norms(output_dir, config["output_id"]),
        }

    return generated


def render_instrument_module(slug: str, data: dict[str, Any]) -> str:
    identifier = slug_to_identifier(slug)
    payload = json.dumps(data, indent=2, ensure_ascii=False)
    return f"""// This file is autogenerated by scripts/python/create_website_instrument_data.py.
// Do not edit it by hand.

import type {{ GeneratedInstrumentData }} from "@/types/generatedInstrumentData";

export const generated{identifier}: GeneratedInstrumentData = {payload};
"""


def render_index_module(slugs: list[str]) -> str:
    imports: list[str] = []
    exports: list[str] = []

    for slug in slugs:
        identifier = slug_to_identifier(slug)
        imports.append(
            f'import {{ generated{identifier} }} from "@/lib/data/{Path(slug_to_filename(slug)).stem}";'
        )
        exports.append(f'  "{slug}": generated{identifier},')

    imports_block = "\n".join(imports)
    exports_block = "\n".join(exports)

    return f"""// This file is autogenerated by scripts/python/create_website_instrument_data.py.
// Do not edit it by hand.

import type {{ GeneratedInstrumentData }} from "@/types/generatedInstrumentData";
{imports_block}

export const generatedInstrumentDataBySlug: Record<string, GeneratedInstrumentData> = {{
{exports_block}
}};
"""


def write_output_files(output_dir: Path, generated: dict[str, dict[str, Any]]) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    for config in INSTRUMENT_CONFIGS:
        slug = config["slug"]
        file_path = output_dir / slug_to_filename(slug)
        file_path.write_text(
            render_instrument_module(slug, generated[slug]), encoding="utf-8"
        )

    index_path = output_dir / "generatedIndex.ts"
    index_path.write_text(
        render_index_module([config["slug"] for config in INSTRUMENT_CONFIGS]),
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create frontend-ready website instrument data."
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        help="Output directory. Defaults to website/src/lib/data",
    )
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[2]
    output_dir = args.output_dir or (repo_root / "website" / "src" / "lib" / "data")

    generated = build_generated_data(repo_root)
    write_output_files(output_dir, generated)

    print(f"Wrote generated instrument data to {output_dir}")


if __name__ == "__main__":
    main()
