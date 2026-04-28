export type SupportLevel = 4 | 3 | 2 | 1 | 0;

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
  reportLinks: {
    measure: string;
    analysis: string;
  };
};

export type ItemKeyDirection = "+" | "-";

export type InstrumentItem = {
  id: string;
  prompt: string;
  scale: string;
  scaleId: string;
  subscale?: string;
  subscaleId?: string;
  key: ItemKeyDirection;
};

export type ScoreStatistics = {
  id: string;
  mean: number;
  standardDeviation: number;
  reliability: number;
  min: number;
  max: number;
};

export type InstrumentKey = {
  instrumentSlug: string;
  items: InstrumentItem[];
  scaleStatistics?: Record<string, ScoreStatistics>;
  subscaleStatistics?: Record<string, ScoreStatistics>;
};

export type QuizResponseValue = 1 | 2 | 3 | 4 | 5;
export type QuizStatus = "in-progress" | "complete";

export type QuizState = {
  attemptId: string;
  instrumentSlug: string;
  status: QuizStatus;
  dateStarted: string;
  dateFinished: string | null;
  responses: Partial<Record<string, QuizResponseValue>>;
};

export type {
  GeneratedInstrumentData,
  GeneratedInstrumentItem,
  GeneratedNorm,
  GeneratedNormDescriptives,
  GeneratedNormReliability,
  GeneratedReferenceRow,
} from "@/types/instrumentData";
