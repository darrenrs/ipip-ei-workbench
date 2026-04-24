import type { QuizItem, ScoreResult } from "@/types";

export function scoreBisBas(
  items: QuizItem[],
  responses: Record<string, number>,
): ScoreResult {
  void items;
  void responses;

  return {
    instrument: "bis-bas",
    scales: [],
    interpretationVersion: "placeholder-v1",
  };
}
