import { Link, Navigate, useParams } from "react-router-dom";
import { instrumentBySlug } from "@/lib/instruments";
import PageLayout from "@/pages/PageLayout";

export default function ResultsPage() {
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
          <span className="label">Results scaffold</span>
          <h1>{instrument.name} results</h1>
          <p>
            This placeholder page sets the shape for readable, theory-defined
            reporting without inventing unsupported summary claims.
          </p>
        </section>

        <section className="page-section">
          <h2 className="section-title">Scale summaries</h2>
          <div className="grid">
            {instrument.userFacingScales.map((scale) => (
              <article key={scale} className="card score-card">
                <header>
                  <h3>{scale}</h3>
                  <span className="score-value">--</span>
                </header>
                <p>
                  Reserved for future scoring output and interpretation copy.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section">
          <h2 className="section-title">Interpret carefully</h2>
          <div className="grid two-up">
            <article className="card results-note">
              <h3>What this page will do</h3>
              <p>
                Show theory-defined scale results, concise interpretation text,
                and links back to methods and the larger Quarto report.
              </p>
            </article>
            <article className="card results-note">
              <h3>What it will not do</h3>
              <p>
                Invent a single global score, overstate precision, or treat
                exploratory factor results as the main user-facing output.
              </p>
            </article>
          </div>
        </section>

        <section className="page-section">
          <div className="button-row">
            <Link to={`/quiz/${instrument.slug}`} className="button-link">
              Back to quiz scaffold
            </Link>
            <Link to="/methods" className="button-link">
              Methods page
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
