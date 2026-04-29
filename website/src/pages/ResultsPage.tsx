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
  testDurationFormatted,
} from "@/lib/results";
import PageLayout from "@/pages/PageLayout";
import type { GeneratedInstrumentData, QuizState } from "@/types";

type ResultsLocationState = {
  quizState?: QuizState;
};

export default function ResultsPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { quizState } = (location.state as ResultsLocationState) ?? {};

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
    label: scaleResult.scoreName,
    fullName: scaleResult.scoreName,
    rawScore: scaleResult.rawScore,
    theoreticalMax: scaleResult.theoreticalMax,
    value: Math.max(0, Math.min(1, scaleResult.normalizedScore ?? 0)),
  }));

  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <span className="label">{labelText}</span>
          <h1>{instrument.name} </h1>
          <p>
            Your results from the quiz have been calculated. You spent{" "}
            {testDurationFormatted(
              quizState.dateStarted,
              quizState.dateFinished || quizState.dateStarted,
            )}{" "}
            taking the quiz.
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
                outerRadius="72%"
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
            and are only valid for English-speaking persons in the United States
            at least 18 years of age. Please take significant caution in
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
                    <th>Scale</th>
                    <th>Subscale</th>
                    <th className="results-table-numeric">Raw Score</th>
                    <th className="results-table-numeric">T-Score</th>
                    <th className="results-table-numeric">Percentile Rank</th>
                    <th className="results-table-numeric">
                      Qualitative Descriptor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr
                      key={`${row.scaleName ?? "scale"}-${row.subscaleName ?? "subscale"}-${index}`}
                    >
                      <td>{row.scaleName ?? ""}</td>
                      <td>{row.subscaleName ?? ""}</td>
                      <td className="results-table-numeric">
                        {row.rawScoreDisplay}
                      </td>
                      <td className="results-table-numeric">
                        {row.standardScoreDisplay}
                        {row.ci90Display &&
                        row.ci90Display !== "n/a" &&
                        row.ci90Display !== "NA" ? (
                          <span className="results-table-ci90">
                            ±{row.ci90Display}
                          </span>
                        ) : null}
                      </td>
                      <td className="results-table-numeric">
                        {row.percentileRankDisplay}
                      </td>
                      <td className="results-table-numeric">
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
