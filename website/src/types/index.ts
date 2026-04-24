export type SupportLevel =
  | "strong"
  | "strong-with-caveats"
  | "mixed"
  | "weak"
  | "experimental";

export type PublicStatus = "quiz" | "report-only" | "hidden";

export type InstrumentCategory =
  | "personality"
  | "motivation"
  | "trait-ei"
  | "character";

export type Instrument = {
  slug: string;
  name: string;
  shortName: string;
  category: InstrumentCategory;
  categoryLabel: string;
  supportLevel: SupportLevel;
  publicStatus: PublicStatus;
  quizEnabled: boolean;
  cautionRequired: boolean;
  overview: string;
  supportSummary: string;
  cautionText: string;
  userFacingScales: string[];
  reportLinks: {
    html?: string;
    pdf?: string;
  };
};

export type QuizItem = {
  id: string;
  instrument: string;
  prompt: string;
  scale: string;
  reverse?: boolean;
  responseOptions: number[];
};

export type ScaleScore = {
  scale: string;
  rawScore: number;
  meanItemScore?: number;
};

export type ScoreResult = {
  instrument: string;
  scales: ScaleScore[];
  interpretationVersion: string;
};
