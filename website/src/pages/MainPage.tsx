import { Link } from "react-router-dom";
import { instruments } from "@/lib/instruments";
import { renderInstrumentVisual } from "@/components/InstrumentVisuals";
import PageLayout from "@/pages/PageLayout";

const supportLabelMap = {
  5: "Strong support",
  4: "Acceptable support",
  3: "Borderline support",
  2: "Limited support",
  1: "Very limited support",
};

export default function MainPage() {
  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero hero-split hero-split-main-page">
          <div className="stack">
            <h1>IPIP Workbench</h1>
            <p>
              A selection of five instruments touching personality and emotional
              intelligence derived from public-domain questions and samples from
              the{" "}
              <a href="https://ipip.ori.org/">
                International Personality Item Pool.
              </a>{" "}
              Read more about the research by clicking "Full Report" or gain
              more insight about yourself by taking one of the five quizzes!
            </p>
            <div className="actions">
              <Link to="/about" className="button-link">
                About These Instruments
              </Link>
              <a href="/report/unified_report.html">Full Report</a>
            </div>
          </div>
          <div className="hero-image-frame">
            <img
              src="/home-page.png"
              alt="Image of a brain representing cognition and psychometrics"
              className="hero-image"
            />
          </div>
        </section>

        <section className="page-section">
          <h2>Instruments</h2>
          <div className="instrument-card-grid">
            {instruments.map((instrument) => (
              <Link
                key={instrument.slug}
                to={`/instrument/${instrument.slug}`}
                className="instrument-card-link"
              >
                <article className="card instrument-tile">
                  <h3>{instrument.shortName}</h3>
                  <div className="instrument-tile-visual">
                    {renderInstrumentVisual(instrument.slug)}
                  </div>
                  <div className="instrument-tile-meta">
                    <span className="instrument-category-label">
                      {instrument.categoryLabel}
                    </span>
                    <span
                      className={`instrument-support-label support-${instrument.supportLevels.overall}`}
                    >
                      {supportLabelMap[instrument.supportLevels.overall]}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
