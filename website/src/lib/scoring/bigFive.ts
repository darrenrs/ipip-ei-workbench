import type { QuizItem, ScoreResult } from "@/types";

export function scoreBigFive(
  items: QuizItem[],
  responses: Record<string, number>,
): ScoreResult {
  void items;
  void responses;

  return {
    instrument: "big-five",
    scales: [],
    interpretationVersion: "placeholder-v1",
  };
}
