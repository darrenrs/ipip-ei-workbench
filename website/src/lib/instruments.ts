import type { Instrument } from "@/types";

export const instruments: Instrument[] = [
  {
    slug: "big-five",
    name: "Big Five",
    shortName: "Big Five",
    category: "personality",
    categoryLabel: "Trait personality",
    supportLevel: "strong",
    publicStatus: "quiz",
    quizEnabled: true,
    cautionRequired: false,
    overview:
      "A public-facing personality profile using theory-defined domains with strong practical support.",
    supportSummary:
      "This instrument is one of the strongest public quiz candidates in the project and is appropriate for portfolio-facing exploration.",
    cautionText:
      "Use as a descriptive self-reflection tool rather than a fixed label.",
    userFacingScales: [
      "Openness",
      "Conscientiousness",
      "Extraversion",
      "Agreeableness",
      "Emotional stability",
    ],
    reportLinks: {
      html: "/reports/unified-report.html#big-five",
      pdf: "/reports/unified-report.pdf",
    },
  },
  {
    slug: "bis-bas",
    name: "BIS/BAS",
    shortName: "BIS/BAS",
    category: "motivation",
    categoryLabel: "Motivation systems",
    supportLevel: "strong",
    publicStatus: "quiz",
    quizEnabled: true,
    cautionRequired: false,
    overview:
      "A reinforcement sensitivity measure suited to careful public presentation when the scales remain theory-defined.",
    supportSummary:
      "This measure has strong support in the project context and works well as a second public quiz alongside Big Five.",
    cautionText:
      "Treat these scores as broad motivational tendencies, not as diagnosis or destiny.",
    userFacingScales: ["BIS", "Drive", "Fun Seeking", "Reward Responsiveness"],
    reportLinks: {
      html: "/reports/unified-report.html#bis-bas",
      pdf: "/reports/unified-report.pdf",
    },
  },
  {
    slug: "barchard",
    name: "Barchard Personality Components",
    shortName: "Barchard",
    category: "trait-ei",
    categoryLabel: "Trait components",
    supportLevel: "mixed",
    publicStatus: "report-only",
    quizEnabled: false,
    cautionRequired: true,
    overview:
      "A mixed-support set of personality components that can be discussed transparently but should be introduced with caution.",
    supportSummary:
      "Evidence is mixed enough that the public-facing site should frame this as technical exploration rather than as a polished quiz product.",
    cautionText:
      "This content is best treated as exploratory and report-driven unless stronger support emerges.",
    userFacingScales: ["Component summaries"],
    reportLinks: {
      html: "/reports/unified-report.html#barchard",
      pdf: "/reports/unified-report.pdf",
    },
  },
  {
    slug: "trait-ei",
    name: "Trait Emotional Intelligence",
    shortName: "Trait EI",
    category: "trait-ei",
    categoryLabel: "Trait emotional intelligence",
    supportLevel: "weak",
    publicStatus: "report-only",
    quizEnabled: false,
    cautionRequired: true,
    overview:
      "Included for analysis and discussion, but not strong enough for a public quiz in the first version of the site.",
    supportSummary:
      "The current project context supports explanation and technical reporting, not a live public-facing assessment.",
    cautionText: "Do not collapse these findings into a single EQ-style claim.",
    userFacingScales: ["Theory-defined subscales only"],
    reportLinks: {
      html: "/reports/unified-report.html#trait-ei",
      pdf: "/reports/unified-report.pdf",
    },
  },
  {
    slug: "via",
    name: "VIA Character Strengths",
    shortName: "VIA",
    category: "character",
    categoryLabel: "Character strengths",
    supportLevel: "weak",
    publicStatus: "report-only",
    quizEnabled: false,
    cautionRequired: true,
    overview:
      "A character-strengths instrument with enough interest for discussion, but not enough support here for a public quiz.",
    supportSummary:
      "Useful as part of the broader project narrative, but better handled as report-linked content in v1.",
    cautionText:
      "Keep interpretation narrow and avoid overclaiming comparative precision.",
    userFacingScales: ["Strength-level summaries"],
    reportLinks: {
      html: "/reports/unified-report.html#via",
      pdf: "/reports/unified-report.pdf",
    },
  },
];

export const instrumentBySlug = Object.fromEntries(
  instruments.map((instrument) => [instrument.slug, instrument]),
) as Record<string, Instrument>;

export const publicQuizInstruments = instruments.filter(
  (instrument) => instrument.quizEnabled,
);

export const reportOnlyInstruments = instruments.filter(
  (instrument) => !instrument.quizEnabled,
);
