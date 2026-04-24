import { Link } from "react-router-dom";
import { publicQuizInstruments, reportOnlyInstruments } from "@/lib/instruments";
import PageLayout from "@/pages/PageLayout";

export default function MainPage() {
  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero hero-split">
          <div className="stack">
            <h1>Open psychometrics and data-science workbench.</h1>
            <p>
              This project presents personality and psychometric instruments with
              a portfolio mindset: clear methods, careful claims, and visible
              separation between stronger instruments and exploratory ones.
            </p>
            <div className="actions">
              <Link to="/instruments">Browse instruments</Link>
              <Link to="/methods">Methods</Link>
              <Link to="/disclaimer">Disclaimer</Link>
            </div>
          </div>

          <aside className="surface-card project-summary">
            <span className="label">Current public quiz set</span>
            <ul>
              {publicQuizInstruments.map((instrument) => (
                <li key={instrument.slug}>{instrument.name}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="page-section">
          <h2 className="section-title">Supported quizzes</h2>
          <div className="grid">
            {publicQuizInstruments.map((instrument) => (
              <article key={instrument.slug} className="card">
                <span
                  className={`support-badge support-${instrument.supportLevel}`}
                >
                  {instrument.supportLevel.replace("-", " ")}
                </span>
                <h3>{instrument.name}</h3>
                <p>{instrument.overview}</p>
                <div className="button-row">
                  <Link
                    to={`/instruments/${instrument.slug}`}
                    className="button-link"
                  >
                    View instrument
                  </Link>
                  <Link to={`/quiz/${instrument.slug}`} className="button-link">
                    Launch quiz
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section">
          <h2 className="section-title">Report-first instruments</h2>
          <div className="grid">
            {reportOnlyInstruments.map((instrument) => (
              <article key={instrument.slug} className="card">
                <span
                  className={`support-badge support-${instrument.supportLevel}`}
                >
                  {instrument.supportLevel.replace("-", " ")}
                </span>
                <h3>{instrument.name}</h3>
                <p>{instrument.overview}</p>
                <div className="button-row">
                  <Link
                    to={`/instruments/${instrument.slug}`}
                    className="button-link"
                  >
                    View instrument
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
