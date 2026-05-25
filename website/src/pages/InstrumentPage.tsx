import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { withBaseUrl } from "@/lib/baseUrl";
import { loadInstrumentGeneratedData } from "@/lib/data/instrumentGeneratedData";
import {
  supportOverallLabelMap,
  supportReliabilityLabelMap,
  supportFactorStructureLabelMap,
} from "@/lib/supportLabels";
import { getInstrument } from "@/lib/instruments";
import {
  buildScoreDescriptionSections,
  type DescribedScore,
} from "@/lib/scoreDescriptions";
import SavedResultsList from "@/components/SavedResultsList";
import PageLayout from "@/pages/PageLayout";
import type { GeneratedInstrumentData } from "@/types";

export default function InstrumentPage() {
  const { slug } = useParams();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const instrument = getInstrument(slug);

  if (!instrument) {
    return <Navigate to="/" replace />;
  }

  return <InstrumentPageContent key={slug} slug={slug} />;
}

type InstrumentPageContentProps = {
  slug: string;
};

function InstrumentPageContent({ slug }: InstrumentPageContentProps) {
  const instrument = getInstrument(slug)!;
  const [loadState, setLoadState] = useState<{
    instrumentData: GeneratedInstrumentData | null;
    loadError: boolean;
  }>({
    instrumentData: null,
    loadError: false,
  });

  useEffect(() => {
    let isActive = true;

    loadInstrumentGeneratedData(slug)
      .then((data) => {
        if (!isActive) {
          return;
        }

        setLoadState({
          instrumentData: data,
          loadError: false,
        });
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setLoadState({
          instrumentData: null,
          loadError: true,
        });
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  const { instrumentData, loadError } = loadState;
  const isLoading = instrumentData === null && !loadError;
  const scoreDescriptionSections = instrumentData
    ? buildScoreDescriptionSections(instrumentData)
    : [];
  const labelText = loadError
    ? `Failed to load data for ${slug}. Please refresh the page to try again.`
    : isLoading
      ? `Loading ${slug} ...`
      : "Synopsis";

  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero hero-split">
          <div className="stack">
            <span className="label">{labelText}</span>
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
              <strong>Length: </strong>{" "}
              {instrumentData
                ? `${instrumentData.items.length} items (~${Math.ceil(
                    instrumentData.items.length / 9,
                  )}-${Math.ceil(instrumentData.items.length / 6)} min to take)`
                : "Loading..."}
            </p>
            <p>
              <strong>
                Model Author{instrument.modelAuthor.indexOf(";") > 0 ? "s" : ""}
                :
              </strong>{" "}
              {instrument.modelAuthor}
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
            {instrumentData ? (
              <Link
                to={`/instrument/${instrument.slug}/quiz`}
                className="button-link"
              >
                Take Quiz
              </Link>
            ) : null}
            <a
              href={withBaseUrl(instrument.reportLinks.measure)}
              className="button-link"
            >
              More Info
            </a>
            <a
              href={withBaseUrl(instrument.reportLinks.analysis)}
              className="button-link"
            >
              Reliability & Factor Analysis
            </a>
          </div>
        </section>

        <section className="page-section">
          <h2>Results</h2>
          <SavedResultsList instrumentSlug={instrument.slug} />
        </section>

        {instrumentData ? (
          <section className="page-section">
            <h2>Scales</h2>
            <div className="score-description-list">
              {scoreDescriptionSections.map((section) => (
                <article
                  key={section.scale?.scoreId ?? "orphan-subscales"}
                  className="score-description-card"
                >
                  {section.scale ? (
                    <ScoreDescriptionBlock score={section.scale} />
                  ) : (
                    <div className="score-description-main">
                      <h3>Other Subscales</h3>
                      <p className="muted">
                        These subscales are not attached to a specific parent
                        scale in the instrument data.
                      </p>
                    </div>
                  )}

                  {section.subscales.length > 0 ? (
                    <div className="subscale-description-panel">
                      <h4>Subscales</h4>
                      <div className="subscale-description-list">
                        {section.subscales.map((subscale) => (
                          <ScoreDescriptionBlock
                            key={subscale.scoreId}
                            score={subscale}
                            isCompact
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </PageLayout>
  );
}

type ScoreDescriptionBlockProps = {
  score: DescribedScore;
  isCompact?: boolean;
};

function ScoreDescriptionBlock({
  score,
  isCompact = false,
}: ScoreDescriptionBlockProps) {
  return (
    <div
      className={
        isCompact
          ? "score-description-main score-description-main-compact"
          : "score-description-main"
      }
    >
      <div className="score-description-heading-row">
        <h3>{score.scoreName}</h3>
      </div>
      <p>{score.description.summary}</p>
      {score.description.highPole || score.description.lowPole ? (
        <div className="score-pole-list">
          {score.description.highPole ? (
            <p>
              <strong>Higher: </strong>
              {score.description.highPole}
            </p>
          ) : null}
          {score.description.lowPole ? (
            <p>
              <strong>Lower: </strong>
              {score.description.lowPole}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
