import { Link, Navigate, useParams } from "react-router-dom";
import { instrumentBySlug } from "@/lib/instruments";
import PageLayout from "@/pages/PageLayout";

export default function QuizPage() {
  const { slug } = useParams();

  if (!slug || !instrumentBySlug[slug]) {
    return <Navigate to="/instruments" replace />;
  }

  const instrument = instrumentBySlug[slug];

  if (!instrument.quizEnabled) {
    return <Navigate to={`/instruments/${instrument.slug}`} replace />;
  }

  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <span className="label">Quiz scaffold</span>
          <h1>{instrument.name}</h1>
          <p>
            This route is wired for the real item flow later. Right now it holds
            the place for quiz intro, caution text, progress UI, and local
            scoring hooks.
          </p>
        </section>

        <section className="page-section">
          <div className="grid two-up">
            <article className="card">
              <h2>Interpretation</h2>
              <p>{instrument.cautionText}</p>
            </article>
            <article className="card">
              <h2>Scoring policy</h2>
              <p>
                User-facing results will stay aligned with the instrument&apos;s
                defined scales rather than alternate exploratory factors.
              </p>
            </article>
          </div>
        </section>

        <section className="page-section">
          <div className="button-row">
            <Link to={`/results/${instrument.slug}`} className="button-link">
              View results scaffold
            </Link>
            <Link to={`/instruments/${instrument.slug}`} className="button-link">
              Back to instrument page
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
