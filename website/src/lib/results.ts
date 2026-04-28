import { getScaleIds } from "@/lib/instruments";
import type {
  GeneratedInstrumentData,
  QuizResponseValue,
  QuizState,
} from "@/types";

export type ScaleScore = {
  scoreId: string;
  scoreName: string;
  rawScore: number;
  standardScore: number | null;
  percentileRank: number | null;
  ci90: string;
  qualitativeDescriptor: string;
};

function scoreResponse(value: QuizResponseValue, key: "+" | "-"): number {
  return key === "-" ? 6 - value : value;
}

export function scoreScales(
  quizState: QuizState,
  instrumentData: GeneratedInstrumentData,
): ScaleScore[] {
  const scaleIds = getScaleIds(instrumentData);

  return scaleIds.map((scaleId) => {
    const currentScaleItems = instrumentData.items.filter(
      (item) => item.scaleId === scaleId,
    );

    const rawScore = currentScaleItems.reduce((total, item) => {
      const response = quizState.responses[item.id];

      if (response === undefined) {
        return total;
      }

      return total + scoreResponse(response, item.key);
    }, 0);

    const referenceRowAtRawScore = instrumentData.normsByScoreId[
      scaleId
    ].referenceRows.filter((subitem) => subitem.rawScore === rawScore)[0];

    const standardScore = referenceRowAtRawScore.standardScore;
    const percentileRank = referenceRowAtRawScore.percentileRank;
    const ci90 = referenceRowAtRawScore.ci90;
    const qualitativeDescriptor = referenceRowAtRawScore.qualitativeDescriptor;

    return {
      scoreId: scaleId,
      scoreName:
        instrumentData.normsByScoreId[scaleId]?.scoreName ??
        currentScaleItems[0]?.scale ??
        scaleId,
      rawScore,
      standardScore,
      percentileRank,
      ci90,
      qualitativeDescriptor,
    };
  });
}
