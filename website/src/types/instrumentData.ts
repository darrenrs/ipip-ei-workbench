export type GeneratedReferenceRow = {
  rawScore: number;
  standardScore: number | null;
  percentileRank: number | null;
  ci90: string;
  qualitativeDescriptor: string;
};

export type GeneratedNormDescriptives = {
  n: number | null;
  items: number | null;
  mean: number | null;
  sd: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  theoreticalMin: number | null;
  theoreticalMax: number | null;
};

export type GeneratedNormReliability = {
  n: number | null;
  items: number | null;
  alpha: number | null;
  omegaTotal: number | null;
  meanInteritemR: number | null;
};

export type GeneratedNorm = {
  scoreLevel: string;
  scoreName: string;
  scoreId: string;
  referenceRows: GeneratedReferenceRow[];
  descriptives?: GeneratedNormDescriptives;
  reliability?: GeneratedNormReliability;
};

export type GeneratedInstrumentItem = {
  id: string;
  prompt: string;
  scale: string;
  scaleId: string;
  subscale?: string;
  subscaleId?: string;
  key: "+" | "-";
};

export type GeneratedInstrumentData = {
  instrumentSlug: string;
  items: GeneratedInstrumentItem[];
  normsByScoreId: Record<string, GeneratedNorm>;
};
