import type { Instrument } from "@/types";

export const instruments: Instrument[] = [
  {
    slug: "big-five",
    name: "Big Five Personality Domains",
    shortName: "Big Five",
    modelAuthor: "General",
    summary: "A strongly validated, five-dimensional summary of personality.",
    description:
      "The Big Five personality domains are a set of five factors that describe aspects of human personality. These heterogeneous factors, known as openness to experience, conscientiousness, extraversion, agreeableness, and neuroticism, are reported on a continuous scale. Combined, they account for the majority of the variance in human personality. The Big Five implementation on this website was based on Goldberg's (1992) Big Five factor markers.",
    categoryLabel: "Personality",
    supportLevels: {
      reliability: 4,
      factorStructure: 4,
      overall: 4,
    },
    reportLinks: {
      measure: "/report/unified_report.html#big-five",
      analysis: "/report/unified_report.html#big-five-1",
    },
  },
  {
    slug: "bis-bas",
    name: "Behavioral Inhibition/Activation Systems",
    shortName: "BIS/BAS",
    modelAuthor: "Gray, Jeffery Alan",
    summary:
      "Brain-based systems that govern a person's interactions with their environment.",
    description:
      "The BIS/BAS is a theory of personality denoted by separation of one's interactions with the environment into the behavioral inhibition system (BIS), which is related to negative conditioning and sensitivity to avoidance, the behavioral activation system (BAS), which pertains to positive conditioning and sensitivity to reward, and the primarily autonomous fight-or-flight system (FFFS). The BIS/BAS scale is based on a 1994 model of the BIS/BAS hypothesis (Carver and White 1994).",
    categoryLabel: "Personality",
    supportLevels: {
      reliability: 3,
      factorStructure: 4,
      overall: 4,
    },
    reportLinks: {
      measure:
        "/report/unified_report.html#behavioral-inhibitionactivation-systems-bisbas",
      analysis:
        "/report/unified_report.html#behavioral-inhibitionactivation-systems-bisbas-1",
    },
  },
  {
    slug: "barchard-ei",
    name: "Barchard Emotional Intelligence",
    shortName: "Barchard EI",
    modelAuthor: "Barchard, Kimberly A.",
    summary: "Seven personality components of emotional intelligence.",
    description:
      "In her doctoral thesis, Kimberly Barchard of the University of British Columbia proposed a model of emotional intelligence including 14 constructs. Barchard identified half of these subcomponents as personality dimensions, meaning they could be measured by self-assessment rather than being cognitive abilities measured by performance (Barchard 2001). The implementation on this website uses the seven personality subcomponents.",
    categoryLabel: "Emotional intelligence",
    supportLevels: {
      reliability: 3,
      factorStructure: 2,
      overall: 3,
    },
    reportLinks: {
      measure: "/report/unified_report.html#barchard-emotional-intelligence",
      analysis: "/report/unified_report.html#barchard-emotional-intelligence-1",
    },
  },
  {
    slug: "via-is",
    name: "IPIP Values in Action",
    shortName: "IPIP-VIA",
    modelAuthor: "Peterson, Christopher; Seligman, Martin E.P.",
    summary: "24 character traits grouped into 6 broad virtues.",
    description:
      "The Values in Action Inventory of Strengths is an assessment focusing on measuring 24 character strengths among six broad virtues including wisdom, courage, humanity, justice, temperance, and transcendence. Although the current instrument is proprietary, a public-domain variant utilizing 240 (later reduced to 213) IPIP items and slightly different verbiage was constructed by Peterson and Seligman (2004). The official instrument has received some criticism due to factor analyses suggesting a different model.",
    categoryLabel: "Personality",
    supportLevels: {
      reliability: 3,
      factorStructure: 0,
      overall: 1,
    },
    reportLinks: {
      measure: "/report/unified_report.html#ipip-values-in-action-ipip-via-is",
      analysis:
        "/report/unified_report.html#ipip-values-in-action-ipip-via-is-1",
    },
  },
  {
    slug: "trait-ei",
    name: "IPIP Trait Emotional Intelligence",
    shortName: "IPIP-Trait EI",
    modelAuthor: "Petrides, K.V.",
    summary: "Grouping emotional intelligence in traits.",
    description:
      "Trait Emotional Intelligence or Trait EI is a theoretical model about emotional intelligence developed by K.V. Petrides. In Trait EI, an individual's self-reported perceptions about their own emotional abilities is considered a measurable personality trait (Petrides and Furnham 2001). The model contains 15 traits organized under four facets: well-being, self-control, emotionality, sociability, with two traits being isolated. Trait EI is used in TEIQue, a proprietary personality assessment which has been found by factor analysis to be consistent with the theoretical model (Mikolajczak et al. 2007). The implementation in this study does not use copyrighted content; each trait was manually assigned five items from the IPIP.",
    categoryLabel: "Emotional intelligence",
    supportLevels: {
      reliability: 2,
      factorStructure: 1,
      overall: 1,
    },
    reportLinks: {
      measure:
        "/report/unified_report.html#ipip-trait-emotional-intelligence-ipip-trait-ei",
      analysis:
        "/report/unified_report.html#ipip-trait-emotional-intelligence-ipip-trait-ei-1",
    },
  },
];

export const instrumentMetadataBySlug = Object.fromEntries(
  instruments.map((instrument) => [instrument.slug, instrument]),
) as Record<string, Instrument>;
