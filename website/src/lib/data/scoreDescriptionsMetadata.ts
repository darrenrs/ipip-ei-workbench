export type ScoreDescription = {
  summary: string;
  highPole?: string;
  lowPole?: string;
};

type InstrumentScoreDescriptions = {
  scales: Record<string, ScoreDescription>;
  subscales: Record<string, ScoreDescription>;
};

function templateScoreDescription(scoreName: string): ScoreDescription {
  return {
    summary: `Placeholder for ${scoreName}. Replace this with a concise description of what this score measures.`,
    highPole:
      "Higher-score interpretation placeholder. Replace with neutral wording about what a higher score tends to reflect.",
    lowPole:
      "Lower-score interpretation placeholder. Replace with neutral wording about what a lower score tends to reflect.",
  };
}

export const scoreDescriptionsByInstrument: Record<
  string,
  InstrumentScoreDescriptions
> = {
  "big-five": {
    scales: {
      extraversion: {
        summary:
          "Social energy, assertiveness, and comfort with interpersonal stimulation.",
        highPole:
          "Higher scores generally suggest a more outgoing, expressive, and socially active style.",
        lowPole:
          "Lower scores generally suggest a more reserved, quiet, or selective social style.",
      },
      agreeableness: templateScoreDescription("Agreeableness"),
      conscientiousness: templateScoreDescription("Conscientiousness"),
      neuroticism: templateScoreDescription("Neuroticism"),
      openness: templateScoreDescription("Openness to Experience"),
    },
    subscales: {},
  },
  "bis-bas": {
    scales: {
      anxiety: {
        summary:
          "Sensitivity to possible punishment, uncertainty, and cues that something may go wrong.",
        highPole:
          "Higher scores generally suggest stronger caution, worry, or threat monitoring.",
        lowPole:
          "Lower scores generally suggest less inhibition or anxiety in response to potential negative outcomes.",
      },
      fun_seeking: templateScoreDescription("BAS (Fun-Seeking)"),
      drive: templateScoreDescription("BAS (Drive)"),
      reward_response: templateScoreDescription("BAS (Reward-Responsiveness)"),
    },
    subscales: {},
  },
  "barchard-ei": {
    scales: {
      positive_expressivity: {
        summary:
          "Tendency to openly show positive emotions such as enjoyment, warmth, and enthusiasm.",
        highPole:
          "Higher scores generally suggest more visible expression of pleasant emotions.",
        lowPole:
          "Lower scores generally suggest a more restrained or less visibly expressive positive emotional style.",
      },
      negative_expressivity: templateScoreDescription("Negative Expressivity"),
      attending_to_emotions: templateScoreDescription("Attending to Emotions"),
      emotion_based_decision_making: templateScoreDescription(
        "Emotion-Based Decision-Making",
      ),
      responsive_joy: templateScoreDescription("Responsive Joy"),
      responsive_distress: templateScoreDescription("Responsive Distress"),
      empathic_concern: templateScoreDescription("Empathic Concern"),
    },
    subscales: {},
  },
  "trait-ei": {
    scales: {
      emotionality: {
        summary:
          "Perceived ability to notice, express, and use emotions in close relationships.",
        highPole:
          "Higher scores generally suggest greater perceived emotional awareness and interpersonal emotional connection.",
        lowPole:
          "Lower scores generally suggest a more limited or less confident emotional-relational style.",
      },
      self_control: templateScoreDescription("Self-Control"),
      sociability: templateScoreDescription("Sociability"),
      well_being: templateScoreDescription("Well-Being"),
    },
    subscales: {
      empathy: templateScoreDescription("Empathy"),
      emotion_perception: templateScoreDescription("Emotion Perception"),
      emotion_expression: templateScoreDescription("Emotion Expression"),
      relationships: templateScoreDescription("Relationships"),
      emotion_regulation: templateScoreDescription("Emotion Regulation"),
      impulsiveness: templateScoreDescription("Impulsiveness"),
      stress_management: templateScoreDescription("Stress Management"),
      assertiveness: templateScoreDescription("Assertiveness"),
      emotion_management: templateScoreDescription("Emotion Management"),
      social_awareness: templateScoreDescription("Social Awareness"),
      self_esteem: templateScoreDescription("Self-Esteem"),
      happiness: templateScoreDescription("Happiness"),
      optimism: templateScoreDescription("Optimism"),
      adaptability: templateScoreDescription("Adaptability"),
      self_motivation: templateScoreDescription("Self-Motivation"),
    },
  },
  "via-is": {
    scales: {
      transcendence: templateScoreDescription("Transcendence"),
      humanity: templateScoreDescription("Humanity"),
      justice: templateScoreDescription("Justice"),
      wisdom: templateScoreDescription("Wisdom"),
      temperance: templateScoreDescription("Temperance"),
      courage: templateScoreDescription("Courage"),
    },
    subscales: {
      App: templateScoreDescription("Appreciation of Beauty"),
      Cap: templateScoreDescription("Capacity for Love"),
      Cit: templateScoreDescription("Citizenship/Teamwork"),
      Cur: templateScoreDescription("Curiosity"),
      Equ: templateScoreDescription("Equity/Fairness"),
      For: templateScoreDescription("Forgiveness/Mercy"),
      Gra: templateScoreDescription("Gratitude"),
      Hop: templateScoreDescription("Hope/Optimism"),
      Hum: templateScoreDescription("Humor/Playfulness"),
      Ind: templateScoreDescription("Industry/Perseverance/Persistence"),
      Int: templateScoreDescription("Integrity/Honesty/Authenticity"),
      Jud: templateScoreDescription("Judgment/Open-Mindedness"),
      Kin: templateScoreDescription("Kindness/Generosity"),
      Lea: templateScoreDescription("Leadership"),
      Lov: templateScoreDescription("Love of Learning"),
      Mod: templateScoreDescription("Modesty/Humility"),
      Ori: templateScoreDescription("Originality/Creativity"),
      Per: templateScoreDescription("Perspective/Wisdom"),
      Pru: templateScoreDescription("Prudence"),
      Sel: templateScoreDescription("Self-Regulation/Self-Control"),
      Soc: templateScoreDescription("Social/Personal/Emotional Intelligence"),
      Spi: templateScoreDescription("Spirituality/Religiousness"),
      Val: {
        summary:
          "Willingness to act despite fear, difficulty, or social pressure when pursuing something valued.",
        highPole:
          "Higher scores generally suggest more readiness to face risk or discomfort for an important purpose.",
        lowPole:
          "Lower scores generally suggest a more cautious or conflict-avoidant approach when risk or pressure is present.",
      },
      Zes: templateScoreDescription("Zest/Enthusiasm/Vitality"),
    },
  },
};

export function getScoreDescription(
  instrumentSlug: string,
  scoreLevel: "scale" | "subscale",
  scoreId: string,
  scoreName: string,
): ScoreDescription {
  const descriptionSet = scoreDescriptionsByInstrument[instrumentSlug];
  const scoreDescriptions =
    scoreLevel === "scale" ? descriptionSet?.scales : descriptionSet?.subscales;

  return scoreDescriptions?.[scoreId] ?? templateScoreDescription(scoreName);
}
