#!/usr/bin/env python3
"""
Compute Big Five domain means from the OpenPsychometrics `data-final.csv` file.

Assumptions based on the provided codebook:
- The file is tab-delimited (ASCII 0x09).
- Only records with IPC == 1 are retained.
- Item responses are on a 1-5 scale.
- Rows with any missing/invalid Big Five item response are excluded.

Outputs:
- Number of retained records
- Mean summed score for each domain (10 items; range 10-50)
- Mean item score for each domain (range 1-5)
"""

from __future__ import annotations

import argparse
import csv
from collections import defaultdict
import math
from pathlib import Path


DOMAINS = {
    "Extraversion": {
        "items": [f"EXT{i}" for i in range(1, 11)],
        "reverse": {"EXT2", "EXT4", "EXT6", "EXT8", "EXT10"},
    },
    "Agreeableness": {
        "items": [f"AGR{i}" for i in range(1, 11)],
        "reverse": {"AGR1", "AGR3", "AGR5", "AGR7"},
    },
    "Conscientiousness": {
        "items": [f"CSN{i}" for i in range(1, 11)],
        "reverse": {"CSN2", "CSN4", "CSN6", "CSN8"},
    },
    "Neuroticism": {
        "items": [f"EST{i}" for i in range(1, 11)],
        "reverse": {"EST2", "EST4"},
    },
    "Openness": {
        "items": [f"OPN{i}" for i in range(1, 11)],
        "reverse": {"OPN2", "OPN4", "OPN6"},
    },
}


def reverse_score(value: int) -> int:
    return 6 - value


def parse_response(raw: str) -> int | None:
    raw = raw.strip()
    if raw == "":
        return None

    try:
        value = int(raw)
    except ValueError:
        return None

    if 1 <= value <= 5:
        return value

    return None


def compute_means(path: Path) -> None:
    retained_rows = 0
    skipped_ipc = 0
    skipped_missing = 0

    sum_totals = defaultdict(float)
    sum_squares = defaultdict(float)

    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")

        for row in reader:
            if row.get("IPC", "").strip() != "1":
                skipped_ipc += 1
                continue

            domain_scores = {}
            valid_row = True

            for domain_name, domain_info in DOMAINS.items():
                score = 0

                for item in domain_info["items"]:
                    value = parse_response(row.get(item, ""))
                    if value is None:
                        valid_row = False
                        break

                    if item in domain_info["reverse"]:
                        value = reverse_score(value)

                    score += value

                if not valid_row:
                    break

                domain_scores[domain_name] = score

            if not valid_row:
                skipped_missing += 1
                continue

            retained_rows += 1
            for domain_name, score in domain_scores.items():
                sum_totals[domain_name] += score
                sum_squares[domain_name] += score * score

    if retained_rows == 0:
        raise SystemExit("No valid records were retained after filtering.")

    print(f"File: {path}")
    print(f"Retained rows (IPC == 1 and all 50 items present): {retained_rows}")
    print(f"Skipped rows (IPC != 1): {skipped_ipc}")
    print(f"Skipped rows (missing/invalid Big Five items): {skipped_missing}")
    print()
    print("Domain means and standard deviations")
    print("-" * 84)
    print(
        f"{'Domain':<20} {'Mean Sum':>10} {'SD Sum':>10} {'Mean Item':>12} {'SD Item':>10}"
    )
    print("-" * 84)

    for domain_name in DOMAINS:
        mean_sum = sum_totals[domain_name] / retained_rows
        if retained_rows > 1:
            variance_sum = (
                sum_squares[domain_name] - retained_rows * mean_sum * mean_sum
            ) / (retained_rows - 1)
            variance_sum = max(variance_sum, 0.0)
            sd_sum = math.sqrt(variance_sum)
        else:
            sd_sum = float("nan")
        mean_item = mean_sum / 10
        sd_item = sd_sum / 10
        print(
            f"{domain_name:<20} {mean_sum:>10.5f} {sd_sum:>10.5f} {mean_item:>12.6f} {sd_item:>10.6f}"
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Compute Big Five domain means from OpenPsychometrics data-final.csv"
    )
    parser.add_argument(
        "input_file",
        help="Path to the tab-delimited OpenPsychometrics data-final.csv file",
    )
    args = parser.parse_args()

    compute_means(Path(args.input_file))


if __name__ == "__main__":
    main()
