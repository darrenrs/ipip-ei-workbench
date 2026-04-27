export type SupportLevel = 5 | 4 | 3 | 2 | 1;

export const supportOverallLabelMap = {
  5: "Strong support",
  4: "Acceptable support",
  3: "Borderline support",
  2: "Limited support",
  1: "Very limited support",
};

export const supportReliabilityLabelMap = {
  5: "Good reliability",
  4: "Acceptable reliability",
  3: "Borderline reliability",
  2: "Weak reliability",
  1: "Very weak reliability",
};

export const supportFactorStructureLabelMap = {
  5: "Good factor structure",
  4: "Acceptable factor structure",
  3: "Borderline factor structure",
  2: "Weak factor structure",
  1: "Very weak factor structure",
};

export type Instrument = {
  slug: string;
  name: string;
  shortName: string;
  modelAuthor: string;
  summary: string;
  description: string;
  categoryLabel: string;
  supportLevels: {
    reliability: SupportLevel;
    factorStructure: SupportLevel;
    overall: SupportLevel;
  };
  previewScales: string[];
  reportLinks: {
    measure: string;
    analysis: string;
  };
};

// 2026-04-26 not yet implemented
// export type QuizItem = {
//   id: string;
//   instrument: string;
//   prompt: string;
//   scale: string;
//   reverse?: boolean;
//   responseOptions: number[];
// };

// export type ScaleScore = {
//   scale: string;
//   rawScore: number;
//   meanItemScore?: number;
// };

// export type ScoreResult = {
//   instrument: string;
//   scales: ScaleScore[];
//   interpretationVersion: string;
// };
