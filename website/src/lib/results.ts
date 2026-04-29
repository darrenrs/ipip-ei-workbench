import { getScaleIds, getSubscaleIds } from "@/lib/instruments";
import type {
  GeneratedInstrumentData,
  GeneratedNorm,
  GeneratedReferenceRow,
  QuizResponseValue,
  QuizState,
  ResultsTableRow,
  ScoreLevel,
  ScoreResult,
} from "@/types";

function scoreResponse(value: QuizResponseValue, key: "+" | "-"): number {
  return key === "-" ? 6 - value : value;
}

function formatDisplayNumber(value: number | null): string {
  if (value === null) {
    return "n/a";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatCi90Display(ci90: string | null | undefined): string {
  if (!ci90) {
    return "n/a";
  }

  return ci90.replace("-", "\u2013");
}

function getScaleFallback(
  rawScore: number,
  norm: GeneratedNorm | undefined,
): Pick<
  ScoreResult,
  | "standardScoreDisplay"
  | "percentileRankDisplay"
  | "ci90Display"
  | "qualitativeDescriptor"
> {
  const mean = norm?.descriptives?.mean;

  if (mean !== null && mean !== undefined && rawScore > mean) {
    return {
      standardScoreDisplay: ">80",
      percentileRankDisplay: ">99.9",
      ci90Display: "n/a",
      qualitativeDescriptor: "Extremely High",
    };
  }

  return {
    standardScoreDisplay: "<20",
    percentileRankDisplay: "<0.1",
    ci90Display: "n/a",
    qualitativeDescriptor: "Extremely Low",
  };
}

function getReferenceRowAtRawScore(
  norm: GeneratedNorm | undefined,
  rawScore: number,
): GeneratedReferenceRow | undefined {
  return norm?.referenceRows.find((row) => row.rawScore === rawScore);
}

function getNormalizedScore(
  rawScore: number,
  theoreticalMin: number | null,
  theoreticalMax: number | null,
): number | null {
  if (
    theoreticalMin === null ||
    theoreticalMax === null ||
    theoreticalMax <= theoreticalMin
  ) {
    return null;
  }

  return rawScore / theoreticalMax;
}

export function testDurationFormatted(start: string, end: string) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();

  if (Number.isNaN(startDate) || Number.isNaN(endDate)) {
    throw new Error("Invalid date");
  }

  const totalSeconds = Math.floor((endDate - startDate) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export function isQuizComplete(
  quizState: QuizState,
  instrumentData: GeneratedInstrumentData,
): boolean {
  return instrumentData.items.every(
    (item) => quizState.responses[item.id] !== undefined,
  );
}

function scoreGroupedResults(
  quizState: QuizState,
  instrumentData: GeneratedInstrumentData,
  scoreLevel: ScoreLevel,
): ScoreResult[] {
  const scoreIds =
    scoreLevel === "scale"
      ? getScaleIds(instrumentData)
      : getSubscaleIds(instrumentData);

  return scoreIds.map((scoreId) => {
    const currentItems = instrumentData.items.filter((item) =>
      scoreLevel === "scale"
        ? item.scaleId === scoreId
        : item.subscaleId === scoreId,
    );

    const rawScore = currentItems.reduce((total, item) => {
      const response = quizState.responses[item.id];

      if (response === undefined) {
        return total;
      }

      return total + scoreResponse(response, item.key);
    }, 0);

    const norm = instrumentData.normsByScoreId[scoreId];
    const referenceRowAtRawScore = getReferenceRowAtRawScore(norm, rawScore);
    const theoreticalMin = norm?.descriptives?.theoreticalMin ?? null;
    const theoreticalMax = norm?.descriptives?.theoreticalMax ?? null;
    const fallback =
      scoreLevel === "scale" && referenceRowAtRawScore === undefined
        ? getScaleFallback(rawScore, norm)
        : null;

    return {
      scoreLevel,
      scoreId,
      scoreName:
        norm?.scoreName ??
        (scoreLevel === "scale"
          ? currentItems[0]?.scale
          : currentItems[0]?.subscale) ??
        scoreId,
      scoreShortLabel: scoreId,
      parentScaleId:
        scoreLevel === "subscale" ? (currentItems[0]?.scaleId ?? null) : null,
      parentScaleName:
        scoreLevel === "subscale" ? (currentItems[0]?.scale ?? null) : null,
      rawScore,
      theoreticalMin,
      theoreticalMax,
      normalizedScore: getNormalizedScore(
        rawScore,
        theoreticalMin,
        theoreticalMax,
      ),
      standardScoreDisplay:
        fallback?.standardScoreDisplay ??
        (scoreLevel === "subscale"
          ? "-"
          : formatDisplayNumber(referenceRowAtRawScore?.standardScore ?? null)),
      ci90Display:
        fallback?.ci90Display ??
        formatCi90Display(referenceRowAtRawScore?.ci90),
      percentileRankDisplay:
        fallback?.percentileRankDisplay ??
        formatDisplayNumber(referenceRowAtRawScore?.percentileRank ?? null),
      qualitativeDescriptor:
        fallback?.qualitativeDescriptor ??
        referenceRowAtRawScore?.qualitativeDescriptor ??
        "n/a",
    };
  });
}

export function scoreScales(
  quizState: QuizState,
  instrumentData: GeneratedInstrumentData,
): ScoreResult[] {
  return scoreGroupedResults(quizState, instrumentData, "scale");
}

export function scoreSubscales(
  quizState: QuizState,
  instrumentData: GeneratedInstrumentData,
): ScoreResult[] {
  return scoreGroupedResults(quizState, instrumentData, "subscale");
}

export function buildResultsTableRows(
  scaleResults: ScoreResult[],
  subscaleResults: ScoreResult[],
): ResultsTableRow[] {
  const rows: ResultsTableRow[] = [];
  const renderedSubscaleIds = new Set<string>();

  for (const scaleResult of scaleResults) {
    rows.push({
      scaleName: scaleResult.scoreName,
      subscaleName: null,
      rawScoreDisplay: String(scaleResult.rawScore),
      standardScoreDisplay: scaleResult.standardScoreDisplay,
      ci90Display: scaleResult.ci90Display,
      percentileRankDisplay: scaleResult.percentileRankDisplay,
      qualitativeDescriptor: scaleResult.qualitativeDescriptor,
    });

    const matchingSubscales = subscaleResults.filter(
      (subscaleResult) => subscaleResult.parentScaleId === scaleResult.scoreId,
    );

    for (const subscaleResult of matchingSubscales) {
      renderedSubscaleIds.add(subscaleResult.scoreId);
      rows.push({
        scaleName: null,
        subscaleName: subscaleResult.scoreName,
        rawScoreDisplay: String(subscaleResult.rawScore),
        standardScoreDisplay: subscaleResult.standardScoreDisplay,
        ci90Display: subscaleResult.ci90Display,
        percentileRankDisplay: subscaleResult.percentileRankDisplay,
        qualitativeDescriptor: subscaleResult.qualitativeDescriptor,
      });
    }
  }

  const orphanSubscales = subscaleResults.filter(
    (subscaleResult) => !renderedSubscaleIds.has(subscaleResult.scoreId),
  );

  if (orphanSubscales.length > 0) {
    rows.push({
      scaleName: "(other)",
      subscaleName: null,
      rawScoreDisplay: "",
      standardScoreDisplay: "",
      ci90Display: "",
      percentileRankDisplay: "",
      qualitativeDescriptor: "",
    });

    for (const subscaleResult of orphanSubscales) {
      rows.push({
        scaleName: null,
        subscaleName: subscaleResult.scoreName,
        rawScoreDisplay: String(subscaleResult.rawScore),
        standardScoreDisplay: subscaleResult.standardScoreDisplay,
        ci90Display: subscaleResult.ci90Display,
        percentileRankDisplay: subscaleResult.percentileRankDisplay,
        qualitativeDescriptor: subscaleResult.qualitativeDescriptor,
      });
    }
  }

  return rows;
}
