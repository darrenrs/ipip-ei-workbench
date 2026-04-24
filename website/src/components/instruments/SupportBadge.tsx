import type { Instrument, SupportLevel } from "@/types";

const supportLabelMap: Record<SupportLevel, string> = {
  strong: 'Strong support',
  'strong-with-caveats': 'Strong with caveats',
  mixed: 'Mixed support',
  weak: 'Weak support',
  experimental: 'Experimental',
}

type SupportBadgeProps = {
  instrument: Instrument;
};

export function SupportBadge({ instrument }: SupportBadgeProps) {
  return (
    <span
      className={`support-badge support-${instrument.supportLevel}`}
      title={instrument.supportSummary}
    >
      {supportLabelMap[instrument.supportLevel]}
    </span>
  );
}
