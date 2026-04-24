import { Link } from "react-router-dom";
import type { Instrument } from "@/types";
import { SupportBadge } from "./SupportBadge";

type InstrumentCardProps = {
  instrument: Instrument;
};

export function InstrumentCard({ instrument }: InstrumentCardProps) {
  return (
    <article className="instrument-card">
      <div className="instrument-card-header">
        <p className="instrument-kicker">{instrument.categoryLabel}</p>
        <SupportBadge instrument={instrument} />
      </div>
      <div className="instrument-card-body">
        <h3>{instrument.name}</h3>
        <p>{instrument.overview}</p>
      </div>
      <div className="instrument-card-actions">
        <Link to={`/instruments/${instrument.slug}`} className="button-link">
          View instrument
        </Link>
        {instrument.quizEnabled ? (
          <Link to={`/quiz/${instrument.slug}`} className="button-link button-link-secondary">
            Launch quiz
          </Link>
        ) : null}
      </div>
    </article>
  );
}
