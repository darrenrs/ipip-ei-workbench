import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { loadInstrumentGeneratedData } from "@/lib/data/instrumentGeneratedData";
import { getInstrument } from "@/lib/instruments";
import { testDurationFormatted, scoreScales } from "@/lib/results";
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

  const scaleResults = scoreScales(quizState, instrumentData);

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
            taking the test.
          </p>
        </section>

        <section className="page-section">
          <h2>Scale summaries</h2>
          <div className="grid">
            {scaleResults.map((scaleResult) => (
              <article key={scaleResult.scoreId} className="card score-card">
                <header>
                  <h3>{scaleResult.scoreName}</h3>
                  <span className="score-value">{scaleResult.rawScore}</span>
                </header>
                <ul>
                  <p>
                    T-Score: {scaleResult.standardScore} ({scaleResult.ci90})
                  </p>
                  <p>Percentile Rank: {scaleResult.percentileRank}</p>
                  <p>
                    Qualitative Descriptor: {scaleResult.qualitativeDescriptor}
                  </p>
                </ul>
              </article>
            ))}
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
