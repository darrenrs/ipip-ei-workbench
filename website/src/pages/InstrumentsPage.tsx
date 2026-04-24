import { Link } from "react-router-dom";
import { instruments } from "@/lib/instruments";
import PageLayout from "@/pages/PageLayout";

export default function InstrumentsPage() {
  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <h1>Instrument index</h1>
          <p>
            Each instrument page carries its own support summary, caution
            language, and the right level of public access.
          </p>
        </section>

        <section className="page-section">
          <div className="grid">
            {instruments.map((instrument) => (
              <article key={instrument.slug} className="card">
                <span className="label">{instrument.categoryLabel}</span>
                <span
                  className={`support-badge support-${instrument.supportLevel}`}
                >
                  {instrument.supportLevel.replace("-", " ")}
                </span>
                <h2>{instrument.name}</h2>
                <p>{instrument.overview}</p>
                <div className="button-row">
                  <Link
                    to={`/instruments/${instrument.slug}`}
                    className="button-link"
                  >
                    View instrument
                  </Link>
                  {instrument.quizEnabled ? (
                    <Link to={`/quiz/${instrument.slug}`} className="button-link">
                      Launch quiz
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
