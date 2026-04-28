import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import {
  getInstrument,
  getInstrumentData,
  hasInstrument,
} from "@/lib/instruments";
import { scoreScales } from "@/lib/results";
import PageLayout from "@/pages/PageLayout";
import type { QuizState } from "@/types";

type ResultsLocationState = {
  quizState?: QuizState;
};

export default function ResultsPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { quizState } = (location.state as ResultsLocationState) ?? {};

  if (!slug || !hasInstrument(slug)) {
    return <Navigate to="/" replace />;
  }

  if (!quizState || quizState.instrumentSlug !== slug) {
    return <Navigate to={`/instrument/${slug}/quiz`} replace />;
  }

  const instrument = getInstrument(slug)!;
  const instrumentData = getInstrumentData(slug)!;
  const scaleResults = scoreScales(quizState, instrumentData);

  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <span className="label">Results</span>
          <h1>{instrument.name} </h1>
          <p>Your results from the quiz have been calculated.</p>

          <ul>
            <p>Attempt ID: {quizState.attemptId}</p>
            <p>Started: {quizState.dateStarted}</p>
            <p>Finished: {quizState.dateFinished}</p>
          </ul>
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
