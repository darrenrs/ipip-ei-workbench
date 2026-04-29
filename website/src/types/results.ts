export type ScoreLevel = "scale" | "subscale";

export type ScoreResult = {
  scoreLevel: ScoreLevel;
  scoreId: string;
  scoreName: string;
  scoreShortLabel: string;
  parentScaleId: string | null;
  parentScaleName: string | null;
  rawScore: number;
  theoreticalMin: number | null;
  theoreticalMax: number | null;
  normalizedScore: number | null;
  standardScoreDisplay: string;
  ci90Display: string;
  percentileRankDisplay: string;
  qualitativeDescriptor: string;
};

export type ResultsTableRow = {
  scaleName: string | null;
  subscaleName: string | null;
  rawScoreDisplay: string;
  standardScoreDisplay: string;
  ci90Display: string;
  percentileRankDisplay: string;
  qualitativeDescriptor: string;
};
