import { Link, Navigate, useParams } from "react-router-dom";
import {
  supportOverallLabelMap,
  supportReliabilityLabelMap,
  supportFactorStructureLabelMap,
} from "@/lib/supportLabels";
import {
  getInstrument,
  getInstrumentData,
  getScaleNames,
  getSubscaleNames,
  hasInstrument,
} from "@/lib/instruments";
import PageLayout from "@/pages/PageLayout";

export default function InstrumentPage() {
  const { slug } = useParams();

  if (!slug || !hasInstrument(slug)) {
    return <Navigate to="/" replace />;
  }

  const instrument = getInstrument(slug)!;
  const instrumentData = getInstrumentData(slug)!;

  const scaleNames = getScaleNames(instrumentData);
  const subscaleNames = getSubscaleNames(instrumentData);

  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero hero-split">
          <div className="stack">
            <span className="label">Synopsis</span>
            <h1>{instrument.name}</h1>
            <p>{instrument.description}</p>
          </div>

          <aside className="surface-card support-box">
            <p>
              <strong>Instrument Type: </strong> {instrument.categoryLabel}
            </p>
            <p>
              <strong>Summary: </strong> {instrument.summary}
            </p>
            <p>
              <strong>Length: </strong> {instrumentData.items.length} items (~
              {Math.ceil(instrumentData.items.length / 10)} min to take)
            </p>
            <p>
              <strong>Model Author:</strong> {instrument.modelAuthor}
            </p>
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
          </aside>
        </section>

        <section className="page-section">
          <h2>Scales</h2>
          <div className="tag-row">
            {scaleNames.map((scale) => (
              <span key={scale} className="tag">
                {scale}
              </span>
            ))}
          </div>
        </section>

        {subscaleNames.length > 0 ? (
          <section className="page-section">
            <h2>Subscales</h2>
            <div className="tag-row">
              {subscaleNames.map((subscale) => (
                <span key={subscale} className="tag">
                  {subscale}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="page-section">
          <h2>Actions</h2>
          {instrument.supportLevels.overall < 4 ? (
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
