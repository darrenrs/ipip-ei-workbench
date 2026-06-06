import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { loadInstrumentGeneratedData } from "@/lib/data/instrumentGeneratedData";
import { getInstrument } from "@/lib/instruments";
import {
  buildResultsTableRows,
  isQuizComplete,
  scoreScales,
  scoreSubscales,
} from "@/lib/results";
import {
  buildScoreDescriptionSections,
  type DescribedScore,
} from "@/lib/scoreDescriptions";
import { loadCompletedQuizState } from "@/lib/quizStorage";
import PageTitle from "@/components/PageTitle";
import PageLayout from "@/pages/PageLayout";
import type { GeneratedInstrumentData, QuizState } from "@/types";

type ResultsLocationState = {
  quizState?: QuizState;
};

const MOBILE_RADAR_LABELS_BY_INSTRUMENT: Record<
  string,
  Record<string, string>
> = {
  "big-five": {
    openness: "Openness",
    agreeableness: "Agreeable.",
    conscientiousness: "Conscientious.",
  },
  "bis-bas": {
    reward_response: "BAS (Rwrd.)",
    fun_seeking: "BAS (Fun)",
  },
  "barchard-ei": {
    empathic_concern: "Empathic Crn.",
    negative_expressivity: "Neg. Express.",
    responsive_distress: "Resp. Dist.",
    attending_to_emotions: "Attend. Em.",
    emotion_based_decision_making: "Emot.-Based Decis.",
  },
  "trait-ei": {
    self_control: "Self-Contrl.",
  },
};

const MOBILE_CHART_MEDIA_QUERY = "(max-width: 640px)";

function useIsMobileChart() {
  const [isMobileChart, setIsMobileChart] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia(MOBILE_CHART_MEDIA_QUERY).matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MOBILE_CHART_MEDIA_QUERY);

    function updateIsMobileChart(event: MediaQueryListEvent) {
      setIsMobileChart(event.matches);
    }

    mediaQueryList.addEventListener("change", updateIsMobileChart);

    return () => {
      mediaQueryList.removeEventListener("change", updateIsMobileChart);
    };
  }, []);

  return isMobileChart;
}

function getRadarChartLabel(
  instrumentSlug: string,
  scoreId: string,
  scoreName: string,
  useMobileLabel: boolean,
) {
  if (!useMobileLabel) {
    return scoreName;
  }

  return (
    MOBILE_RADAR_LABELS_BY_INSTRUMENT[instrumentSlug]?.[scoreId] ?? scoreName
  );
}

function formatAttemptTimestamp(attempt: QuizState): string {
  const timestamp = new Date(
    attempt.dateFinished ?? attempt.dateStarted,
  ).getTime();

  if (Number.isNaN(timestamp)) {
    return "an unknown date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
}

export default function ResultsPage() {
  const { slug, attemptId } = useParams();
  const location = useLocation();
  const { quizState: locationQuizState } =
    (location.state as ResultsLocationState) ?? {};
  const storedQuizState = attemptId ? loadCompletedQuizState(attemptId) : null;
  const quizState = locationQuizState ?? storedQuizState ?? undefined;

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  if (!quizState || quizState.instrumentSlug !== slug) {
    return <Navigate to={`/instrument/${slug}/quiz`} replace />;
  }

  const instrument = getInstrument(slug);

  if (!instrument) {
    return <Navigate to="/" replace />;
  }

  return <ResultsPageContent key={slug} slug={slug} quizState={quizState} />;
}

type ResultsPageContentProps = {
  slug: string;
  quizState: QuizState;
};

type RadarTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: {
      fullName: string;
      rawScore: number;
      theoreticalMax: number | null;
    };
  }>;
};

function RadarResultsTooltip({ active, payload }: RadarTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const tooltipData = payload[0]?.payload;

  if (!tooltipData) {
    return null;
  }

  return (
    <div className="results-radar-tooltip">
      <p className="results-radar-tooltip-title">{tooltipData.fullName}</p>
      <p className="results-radar-tooltip-body">
        Raw Score: {tooltipData.rawScore}
        {tooltipData.theoreticalMax !== null
          ? ` / ${tooltipData.theoreticalMax} (avg ${(Math.round((tooltipData.rawScore / tooltipData.theoreticalMax) * 50) / 10).toFixed(1)})`
          : ""}{" "}
      </p>
    </div>
  );
}

function ResultsPageContent({ slug, quizState }: ResultsPageContentProps) {
  const instrument = getInstrument(slug)!;
  const isMobileChart = useIsMobileChart();
  const [loadState, setLoadState] = useState<{
    instrumentData: GeneratedInstrumentData | null;
    loadError: boolean;
  }>({
    instrumentData: null,
    loadError: false,
  });

  useEffect(() => {
    let isActive = true;

    loadInstrumentGeneratedData(slug)
      .then((data) => {
        if (!isActive) {
          return;
        }

        setLoadState({
          instrumentData: data,
          loadError: false,
        });
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setLoadState({
          instrumentData: null,
          loadError: true,
        });
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  const { instrumentData, loadError } = loadState;
  const isLoading = instrumentData === null && !loadError;
  const labelText = loadError
    ? `Failed to load data for ${slug}. Please refresh the page to try again.`
    : isLoading
      ? `Loading ${slug} ...`
      : "Results";

  if (!instrumentData) {
    return (
      <PageLayout>
        <PageTitle title={`${instrument.name} Results | IPIP Workbench`} />
        <div className="page-stack">
          <section className="hero stack">
            <span className="label">{labelText}</span>
            <h1>{instrument.name}</h1>
            <p>Your results from the quiz have been calculated.</p>
          </section>
          <section className="page-section">
            <div className="button-row">
              <Link to={`/`} className="button-link">
                Go Back Home
              </Link>
            </div>
          </section>
        </div>
      </PageLayout>
    );
  }

  if (!isQuizComplete(quizState, instrumentData)) {
    return <Navigate to={`/instrument/${slug}/quiz`} replace />;
  }

  const scaleResults = scoreScales(quizState, instrumentData);
  const subscaleResults = scoreSubscales(quizState, instrumentData);
  const tableRows = buildResultsTableRows(scaleResults, subscaleResults);
  const describedScoresByKey = new Map(
    buildScoreDescriptionSections(instrumentData)
      .flatMap((section) => [
        ...(section.scale ? [section.scale] : []),
        ...section.subscales,
      ])
      .map((score) => [`${score.scoreLevel}:${score.scoreId}`, score]),
  );
  const groupedSubscaleSections = [
    ...scaleResults
      .map((scaleResult) => ({
        heading: scaleResult.scoreName,
        subscales: subscaleResults.filter(
          (subscaleResult) =>
            subscaleResult.parentScaleId === scaleResult.scoreId,
        ),
      }))
      .filter((section) => section.subscales.length > 0),
    {
      heading: "(other)",
      subscales: subscaleResults.filter(
        (subscaleResult) => subscaleResult.parentScaleId === null,
      ),
    },
  ].filter((section) => section.subscales.length > 0);
  const radarChartData = scaleResults.map((scaleResult) => ({
    label: getRadarChartLabel(
      slug,
      scaleResult.scoreId,
      scaleResult.scoreName,
      isMobileChart,
    ),
    fullName: scaleResult.scoreName,
    rawScore: scaleResult.rawScore,
    theoreticalMax: scaleResult.theoreticalMax,
    value: Math.max(0, Math.min(1, scaleResult.normalizedScore ?? 0)),
  }));

  return (
    <PageLayout>
      <PageTitle title={`${instrument.name} Results | IPIP Workbench`} />
      <div className="page-stack">
        <section className="hero stack">
          <span className="label">{labelText}</span>
          <h1>{instrument.name} </h1>
          <p>
            Thank you for taking the quiz! Here are your results from this
            attempt on <strong>{formatAttemptTimestamp(quizState)}</strong>.
          </p>
        </section>

        <section className="page-section">
          <h2>Scales</h2>
          <h3>Summary Chart</h3>
          <p>
            Each of the scale scores are displayed in this radar chart. Hover
            over a scale to see your raw score and average response value.
          </p>
          <div className="results-chart-card">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={radarChartData}
                outerRadius={isMobileChart ? "58%" : "72%"}
                margin={{ top: 24, right: 24, bottom: 24, left: 24 }}
              >
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="label"
                  tick={{
                    fill: "var(--text)",
                    fontFamily: "var(--font-header)",
                    fontSize: 13,
                  }}
                />
                <PolarRadiusAxis
                  domain={[0, 1]}
                  tick={false}
                  axisLine={false}
                />
                <Tooltip content={<RadarResultsTooltip />} />
                <Radar
                  dataKey="value"
                  stroke="var(--accent)"
                  fill="var(--accent)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <h3>Scores</h3>
          <p>
            Each of the scale scores are displayed as T-scores along with their
            90% confidence interval and qualitative descriptor. A T-score is a
            standard score with a mean of 50 and a standard deviation of 10. It
            is a common score representation in professionally administered
            batteries but is not to be mistaken with the similar concept
            involving significance tests (t-statistic).
          </p>
          <p>
            These scores are relative to the Eugene-Springfield Community Sample
            and are appropriate for English-speaking persons in the United
            States at least 18 years of age. Please take significant caution in
            interpretation as these are NOT population norms.
          </p>
          <div className="results-card-grid">
            {scaleResults.map((scaleResult) => (
              <article
                key={scaleResult.scoreId}
                className="card results-card results-card-scale"
              >
                <h3 className="results-card-title">{scaleResult.scoreName}</h3>
                <p className="results-card-label">T-SCORE</p>
                <div className="results-card-primary">
                  {scaleResult.standardScoreDisplay}
                </div>
                <p className="results-card-secondary">
                  (90% CI {scaleResult.ci90Display})
                </p>
                <p className="results-card-tertiary">
                  {scaleResult.qualitativeDescriptor}
                </p>
                <ScoreInfoDisclosure
                  score={describedScoresByKey.get(
                    `scale:${scaleResult.scoreId}`,
                  )}
                />
              </article>
            ))}
          </div>
        </section>

        {groupedSubscaleSections.length > 0 ? (
          <section className="page-section">
            <h2>Subscales</h2>
            <p>
              Each of the subscale scores, grouped by their scale, are displayed
              as absolute percentile ranks based on the Eugene-Springfield
              Community Sample along with qualitative descriptors. These scores
              are only valid for English-speaking persons in the United States
              at least 18 years of age. Please take significant caution in
              interpretation as these are NOT population norms.
            </p>

            {groupedSubscaleSections.map((section) => (
              <div key={section.heading} className="page-section">
                <h3>{section.heading}</h3>
                <div className="results-card-grid">
                  {section.subscales.map((subscaleResult) => (
                    <article
                      key={subscaleResult.scoreId}
                      className="card results-card results-card-subscale"
                    >
                      <h3 className="results-card-title">
                        {subscaleResult.scoreName}
                      </h3>
                      <p className="results-card-label">Percentile Rank</p>
                      <div className="results-card-primary">
                        {subscaleResult.percentileRankDisplay}
                        <span className="results-card-percent-symbol">%</span>
                      </div>
                      <p className="results-card-tertiary">
                        {subscaleResult.qualitativeDescriptor}
                      </p>
                      <ScoreInfoDisclosure
                        score={describedScoresByKey.get(
                          `subscale:${subscaleResult.scoreId}`,
                        )}
                      />
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        <section className="page-section">
          <h2>Score Table</h2>
          <p>
            This is a tabulated summary of each scale as well as their
            associated subscales, with raw scores, T-scores/90% confidence
            intervals, percentile ranks, and qualitative descriptors.
          </p>
          <div className="results-table-card">
            <div className="results-table-scroll">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Scale/Subscale</th>
                    <th className="results-table-numeric">Raw Score</th>
                    <th className="results-table-numeric">
                      T-Score
                      <span className="results-table-header-note">
                        (90% CI)
                      </span>
                    </th>
                    <th className="results-table-numeric">Percentile Rank</th>
                    <th className="results-table-descriptor">
                      Qualitative Descriptor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr key={`${row.scoreLevel}-${row.scoreName}-${index}`}>
                      <td
                        className={
                          row.scoreLevel === "subscale"
                            ? "results-table-score-name results-table-subscale-name"
                            : "results-table-score-name"
                        }
                      >
                        {row.scoreName}
                      </td>
                      <td className="results-table-numeric">
                        {row.rawScoreDisplay}
                      </td>
                      <td className="results-table-numeric">
                        {row.standardScoreDisplay}
                        {row.ci90Display &&
                        row.ci90Display !== "n/a" &&
                        row.ci90Display !== "NA" ? (
                          <span className="results-table-ci90">
                            ({row.ci90Display})
                          </span>
                        ) : null}
                      </td>
                      <td className="results-table-numeric">
                        {row.percentileRankDisplay}
                      </td>
                      <td className="results-table-descriptor">
                        {row.qualitativeDescriptor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="button-row">
            <Link to={`/`} className="button-link">
              Go Back Home
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

type ScoreInfoDisclosureProps = {
  score: DescribedScore | undefined;
};

function ScoreInfoDisclosure({ score }: ScoreInfoDisclosureProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (!score) {
    return null;
  }

  function openDrawer() {
    setIsRendered(true);
    window.requestAnimationFrame(() => {
      setIsOpen(true);
    });
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return (
    <div
      className={`results-score-info${isRendered ? " is-rendered" : ""}${
        isOpen ? " is-open" : ""
      }`}
    >
      <button
        type="button"
        className="results-score-info-button results-score-info-trigger"
        aria-expanded={isOpen}
        aria-label={`About ${score.scoreName}`}
        onClick={openDrawer}
      >
        <span className="results-score-info-icon" aria-hidden="true">
          i
        </span>
      </button>
      <div
        className="results-score-info-drawer"
        aria-hidden={!isOpen}
        onTransitionEnd={(event) => {
          if (event.propertyName === "grid-template-rows" && !isOpen) {
            setIsRendered(false);
          }
        }}
      >
        <div className="results-score-info-drawer-inner">
          <div className="results-score-info-body">
            <button
              type="button"
              className="results-score-info-button results-score-info-close"
              aria-label={`Close ${score.scoreName} description`}
              onClick={closeDrawer}
            >
              x
            </button>
            <p>{score.description.summary}</p>
            {score.description.highPole ? (
              <p>
                <strong>Higher: </strong>
                {score.description.highPole}
              </p>
            ) : null}
            {score.description.lowPole ? (
              <p>
                <strong>Lower: </strong>
                {score.description.lowPole}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
