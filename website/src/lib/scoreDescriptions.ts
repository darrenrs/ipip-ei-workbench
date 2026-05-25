import {
  getScoreDescription,
  type ScoreDescription,
} from "@/lib/data/scoreDescriptionsMetadata";
import { getScaleIds, getSubscaleIds } from "@/lib/instruments";
import type { GeneratedInstrumentData, ScoreLevel } from "@/types";

export type DescribedScore = {
  scoreLevel: ScoreLevel;
  scoreId: string;
  scoreName: string;
  parentScaleId: string | null;
  parentScaleName: string | null;
  description: ScoreDescription;
};

export type ScoreDescriptionSection = {
  scale: DescribedScore | null;
  subscales: DescribedScore[];
};

function getScoreName(
  instrumentData: GeneratedInstrumentData,
  scoreLevel: ScoreLevel,
  scoreId: string,
): string {
  const normName = instrumentData.normsByScoreId[scoreId]?.scoreName;

  if (normName) {
    return normName;
  }

  const matchingItem = instrumentData.items.find((item) =>
    scoreLevel === "scale"
      ? item.scaleId === scoreId
      : item.subscaleId === scoreId,
  );

  return (
    (scoreLevel === "scale" ? matchingItem?.scale : matchingItem?.subscale) ??
    scoreId
  );
}

function describeScore(
  instrumentData: GeneratedInstrumentData,
  scoreLevel: ScoreLevel,
  scoreId: string,
): DescribedScore {
  const scoreName = getScoreName(instrumentData, scoreLevel, scoreId);
  const matchingItem =
    scoreLevel === "subscale"
      ? instrumentData.items.find((item) => item.subscaleId === scoreId)
      : undefined;

  return {
    scoreLevel,
    scoreId,
    scoreName,
    parentScaleId:
      scoreLevel === "subscale" ? (matchingItem?.scaleId ?? null) : null,
    parentScaleName:
      scoreLevel === "subscale" ? (matchingItem?.scale ?? null) : null,
    description: getScoreDescription(
      instrumentData.instrumentSlug,
      scoreLevel,
      scoreId,
      scoreName,
    ),
  };
}

export function buildScoreDescriptionSections(
  instrumentData: GeneratedInstrumentData,
): ScoreDescriptionSection[] {
  const scaleScores = getScaleIds(instrumentData).map((scoreId) =>
    describeScore(instrumentData, "scale", scoreId),
  );
  const subscaleScores = getSubscaleIds(instrumentData).map((scoreId) =>
    describeScore(instrumentData, "subscale", scoreId),
  );
  const renderedSubscaleIds = new Set<string>();

  const sections: ScoreDescriptionSection[] = scaleScores.map((scale) => {
    const subscales = subscaleScores.filter(
      (subscale) => subscale.parentScaleId === scale.scoreId,
    );

    for (const subscale of subscales) {
      renderedSubscaleIds.add(subscale.scoreId);
    }

    return {
      scale,
      subscales,
    };
  });

  const orphanSubscales = subscaleScores.filter(
    (subscale) => !renderedSubscaleIds.has(subscale.scoreId),
  );

  if (orphanSubscales.length > 0) {
    sections.push({
      scale: null,
      subscales: orphanSubscales,
    });
  }

  return sections;
}
