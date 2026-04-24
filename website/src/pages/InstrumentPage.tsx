import { Link, Navigate, useParams } from "react-router-dom";
import { instrumentBySlug } from "@/lib/instruments";
import PageLayout from "@/pages/PageLayout";

export default function InstrumentPage() {
  const { slug } = useParams();

  if (!slug || !instrumentBySlug[slug]) {
    return <Navigate to="/instruments" replace />;
  }

  const instrument = instrumentBySlug[slug];

  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero hero-split">
          <div className="stack">
            <span className="label">{instrument.categoryLabel}</span>
            <h1>{instrument.name}</h1>
            <p>{instrument.overview}</p>
          </div>

          <aside className="surface-card support-box">
            <span className={`support-badge support-${instrument.supportLevel}`}>
              {instrument.supportLevel.replace("-", " ")}
            </span>
            <p>{instrument.supportSummary}</p>
          </aside>
        </section>

        <section className="page-section">
          <h2 className="section-title">Psychometric framing</h2>
          <div className="grid two-up">
            <article className="card instrument-summary">
              <h3>Support summary</h3>
              <p>{instrument.supportSummary}</p>
            </article>
            <article className="card instrument-summary">
              <h3>Caution</h3>
              <p>{instrument.cautionText}</p>
            </article>
          </div>
        </section>

        <section className="page-section">
          <h2 className="section-title">User-facing scales</h2>
          <div className="tag-row">
            {instrument.userFacingScales.map((scale) => (
              <span key={scale} className="tag">
                {scale}
              </span>
            ))}
          </div>
        </section>

        <section className="page-section">
          <h2 className="section-title">Next step</h2>
          <div className="button-row">
            {instrument.quizEnabled ? (
              <Link to={`/quiz/${instrument.slug}`} className="button-link">
                Launch quiz
              </Link>
            ) : (
              <a
                className="button-link"
                href={instrument.reportLinks.html ?? instrument.reportLinks.pdf ?? "#"}
              >
                View report section
              </a>
            )}
            <Link to="/disclaimer" className="button-link">
              Read disclaimer
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
