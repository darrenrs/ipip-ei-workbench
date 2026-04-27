import { Link, Navigate, useParams } from "react-router-dom";
import { instrumentBySlug } from "@/lib/instruments";
import {
  supportOverallLabelMap,
  supportReliabilityLabelMap,
  supportFactorStructureLabelMap,
} from "@/types";
import PageLayout from "@/pages/PageLayout";

export default function InstrumentPage() {
  const { slug } = useParams();

  if (!slug || !instrumentBySlug[slug]) {
    return <Navigate to="/" replace />;
  }

  const instrument = instrumentBySlug[slug];

  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero hero-split">
          <div className="stack">
            <span className="label">{instrument.categoryLabel}</span>
            <h1>{instrument.name}</h1>
            <p>{instrument.description}</p>
          </div>

          <aside className="surface-card support-box">
            <div className="support-badge-row">
              <span
                className={`support-badge support-${instrument.supportLevels.overall}`}
              >
                {supportOverallLabelMap[instrument.supportLevels.overall]}
              </span>
              <span
                className={`support-badge support-${instrument.supportLevels.reliability}`}
              >
                {
                  supportReliabilityLabelMap[
                    instrument.supportLevels.reliability
                  ]
                }
              </span>
              <span
                className={`support-badge support-${instrument.supportLevels.factorStructure}`}
              >
                {
                  supportFactorStructureLabelMap[
                    instrument.supportLevels.factorStructure
                  ]
                }
              </span>
            </div>
            <p>
              <strong>Model Author:</strong> {instrument.modelAuthor}
            </p>
            <p>
              <strong>Summary: </strong> {instrument.summary}
            </p>
          </aside>
        </section>

        <section className="page-section">
          <h2>Measured Scales</h2>
          <div className="tag-row">
            {instrument.previewScales.map((scale) => (
              <span key={scale} className="tag">
                {scale}
              </span>
            ))}
          </div>
        </section>

        <section className="page-section">
          <h2>Actions</h2>
          {instrument.supportLevels.overall < 5 ? (
            <article className="card instrument-summary">
              <h3>Caution</h3>
              <p>
                This quiz does not have strong overall support. Interpretation
                is strongly cautioned.
              </p>
            </article>
          ) : (
            ""
          )}
          <div className="button-row">
            <Link
              to={`/instrument/${instrument.slug}/quiz`}
              className="button-link"
            >
              Begin Quiz
            </Link>
            <a href={instrument.reportLinks.measure} className="button-link">
              More Info
            </a>
            <a href={instrument.reportLinks.analysis} className="button-link">
              Reliability & Factor Analysis
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
