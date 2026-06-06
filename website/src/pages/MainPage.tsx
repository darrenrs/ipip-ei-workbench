import { Link } from "react-router-dom";
import { withBaseUrl } from "@/lib/baseUrl";
import { instruments } from "@/lib/data/instrumentMetadata";
import { supportOverallLabelMap } from "@/lib/supportLabels";
import { renderInstrumentVisual } from "@/components/InstrumentVisuals";
import PageTitle from "@/components/PageTitle";
import SavedResultsList from "@/components/SavedResultsList";
import PageLayout from "@/pages/PageLayout";

export default function MainPage() {
  return (
    <PageLayout>
      <PageTitle title="IPIP Workbench" />
      <div className="page-stack">
        <section className="hero hero-split hero-split-main-page">
          <div className="stack hero-main-copy">
            <div className="hero-main-title-row">
              <h1>IPIP Workbench</h1>
              <div className="hero-image-frame hero-image-frame-mobile">
                <img
                  src={withBaseUrl("home-page.png")}
                  alt="Image of a brain representing cognition and psychometrics"
                  className="hero-image"
                />
              </div>
            </div>
            <p>
              A selection of five instruments touching personality and emotional
              intelligence derived from public-domain questions from the{" "}
              <a href="https://ipip.ori.org/">
                International Personality Item Pool
              </a>{" "}
              and samples from the Eugene-Springfield Community Sample. Read
              more about the research by clicking "Full Report" or gain more
              insight about yourself by taking one of the five quizzes!
            </p>
            <div className="actions">
              <Link to="/about" className="button-link">
                About These Instruments
              </Link>
              <a href={withBaseUrl("report/unified_report.html")}>
                Full Report
              </a>
            </div>
          </div>
          <div className="hero-image-frame hero-image-frame-desktop">
            <img
              src={withBaseUrl("home-page.png")}
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
                      {supportOverallLabelMap[instrument.supportLevels.overall]}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="page-section">
          <h2>Results</h2>
          <SavedResultsList />
        </section>
      </div>
    </PageLayout>
  );
}
