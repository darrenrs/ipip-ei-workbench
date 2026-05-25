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
          "Describes how much a person tends to seek social interaction, activity, and excitement.",
        highPole:
          "Linked with being outgoing, energetic, talkative, assertive, and comfortable around groups.",
        lowPole:
          "Linked with being quieter, more reserved, more independent, and more easily drained by social situations.",
      },

      agreeableness: {
        summary:
          "Describes how much a person tends to be kind, cooperative, and considerate of others.",
        highPole:
          "Linked with being trusting, helpful, forgiving, empathetic, and easy to get along with.",
        lowPole:
          "Linked with being more skeptical, direct, competitive, independent-minded, or willing to disagree.",
      },

      conscientiousness: {
        summary:
          "Describes how organized, responsible, and self-controlled a person tends to be.",
        highPole:
          "Linked with being reliable, disciplined, careful, goal-oriented, and good at following through.",
        lowPole:
          "Linked with being more spontaneous, flexible, distractible, disorganized, or likely to procrastinate.",
      },

      neuroticism: {
        summary:
          "Describes how strongly a person tends to experience stress, worry, and negative emotions.",
        highPole:
          "Linked with being anxious, emotionally reactive, self-conscious, easily stressed, or prone to overthinking.",
        lowPole:
          "Linked with being calm, emotionally steady, relaxed under pressure, and quicker to recover from stress.",
      },

      openness: {
        summary:
          "Describes how much a person tends to enjoy new ideas, experiences, and ways of thinking.",
        highPole:
          "Linked with curiosity, creativity, imagination, abstract thinking, and interest in art or unusual ideas.",
        lowPole:
          "Linked with practicality, preference for familiar routines, concrete thinking, and lower interest in novelty.",
      },
    },
    subscales: {},
  },
  "bis-bas": {
    scales: {
      anxiety: {
        summary:
          "The sole factor in behavioral inhibition of striving towards goals and desires; describes how strongly a person notices or anticipates possible punishment.",
        highPole:
          "Linked with worry, caution, sensitivity to criticism, and feeling tense in uncertain situations.",
        lowPole:
          "Linked with staying calm, taking fewer things as threatening, and worrying less about possible problems.",
      },
      fun_seeking: {
        summary:
          "One of three factors associated with behavioral activation; describes how much a person enjoys excitement, novelty, and spontaneous rewards.",
        highPole:
          "Linked with impulsiveness, seeking new experiences, enjoying thrills, and acting quickly on opportunities.",
        lowPole:
          "Linked with preferring predictability, being less impulsive, and having lower interest in sudden excitement.",
      },
      drive: {
        summary:
          "One of three factors associated with behavioral activation; describes how strongly a person pursues goals and desired outcomes.",
        highPole:
          "Linked with ambition, persistence, determination, and strong motivation to get what one wants.",
        lowPole:
          "Linked with being less intensely goal-driven, less competitive, and more willing to let rewards pass by.",
      },
      reward_response: {
        summary:
          "One of three factors associated with behavioral activation; describes how strongly a person reacts to rewards, praise, and positive outcomes.",
        highPole:
          "Linked with excitement after success, enjoyment of praise, optimism, and strong positive reactions to rewards.",
        lowPole:
          "Linked with milder reactions to rewards, less excitement from praise, and less emotional response to success.",
      },
    },
    subscales: {},
  },
  "barchard-ei": {
    scales: {
      positive_expressivity: {
        summary:
          "Describes how openly a person shows happiness, affection, and enjoyment.",
        highPole:
          "Linked with laughing openly, showing affection, and letting others see positive feelings.",
        lowPole:
          "Linked with keeping happy feelings private and showing less outward warmth or excitement.",
      },
      negative_expressivity: {
        summary:
          "Describes how openly a person shows anger, sadness, fear, or distress.",
        highPole:
          "Linked with visibly showing upset feelings, such as anger, sadness, fear, or frustration.",
        lowPole:
          "Linked with keeping negative feelings private and appearing less emotionally expressive when upset.",
      },
      attending_to_emotions: {
        summary:
          "Describes how much a person notices and thinks about their feelings.",
        highPole:
          "Linked with emotional self-awareness, reflection, and paying close attention to inner feelings.",
        lowPole:
          "Linked with paying less attention to emotions and rarely analyzing how one feels.",
      },
      emotion_based_decision_making: {
        summary: "Describes how much a person uses feelings to guide choices.",
        highPole:
          "Linked with trusting feelings, inspiration, and intuition when making important decisions.",
        lowPole:
          "Linked with relying more on facts, logic, and practical reasoning when making decisions.",
      },
      responsive_joy: {
        summary:
          "Describes how strongly a person shares in the happiness and excitement of others.",
        highPole:
          "Linked with feeling others' joy, joining in celebration, and being lifted by happy moods.",
        lowPole:
          "Linked with being less affected by others' happiness or excitement around them.",
      },
      responsive_distress: {
        summary:
          "Describes how strongly a person reacts emotionally to others' suffering or misfortune.",
        highPole:
          "Linked with being deeply moved by sadness, suffering, injury, or upsetting events.",
        lowPole:
          "Linked with staying calmer during distressing situations and being less emotionally shaken by them.",
      },
      empathic_concern: {
        summary:
          "Describes how much a person feels care, sympathy, and concern for others.",
        highPole:
          "Linked with compassion, sympathy, concern for vulnerable people, and wanting others to be helped.",
        lowPole:
          "Linked with less sympathy, less concern for others' problems, and a more detached attitude.",
      },
    },
    subscales: {},
  },
  "trait-ei": {
    scales: {
      emotionality: {
        summary:
          "Describes perceived ability to notice, express, and use emotions in close relationships.",
        highPole:
          "Linked with greater perceived emotional awareness, expression, empathy, and interpersonal emotional connection.",
        lowPole:
          "Linked with a more limited or less confident emotional-relational style.",
      },
      self_control: {
        summary:
          "Describes perceived ability to regulate emotions, manage stress, and control impulses.",
        highPole:
          "Linked with greater emotional stability, stress tolerance, patience, and resistance to urges.",
        lowPole:
          "Linked with more emotional reactivity, stress sensitivity, impulsiveness, or difficulty staying composed.",
      },
      sociability: {
        summary:
          "Describes perceived ability to navigate social situations and influence interpersonal interactions.",
        highPole:
          "Linked with assertiveness, social confidence, interpersonal influence, and awareness of social dynamics.",
        lowPole:
          "Linked with a quieter, less assertive, or less socially confident interpersonal style.",
      },
      well_being: {
        summary:
          "Describes perceived happiness, optimism, self-worth, and overall positive orientation toward life.",
        highPole:
          "Linked with confidence, life satisfaction, optimism, and a generally positive self-view.",
        lowPole:
          "Linked with lower confidence, lower life satisfaction, pessimism, or a less positive self-view.",
      },
    },
    subscales: {
      empathy: {
        summary:
          "Describes perceived ability to understand and take the perspective of other people.",
      },
      emotion_perception: {
        summary:
          "Describes perceived ability to recognize emotions in oneself and other people.",
      },
      emotion_expression: {
        summary:
          "Describes perceived ability to communicate feelings clearly to other people.",
      },
      relationships: {
        summary:
          "Describes perceived ability to form and maintain fulfilling close relationships.",
      },
      emotion_regulation: {
        summary:
          "Describes perceived ability to manage and control one's own emotional reactions.",
      },
      impulsiveness: {
        summary:
          "Describes tendency to think before acting and resist urges or temptations.",
      },
      stress_management: {
        summary:
          "Describes perceived ability to handle pressure, tension, and stressful situations.",
      },
      assertiveness: {
        summary:
          "Describes perceived ability to speak up, be direct, and stand up for oneself.",
      },
      emotion_management: {
        summary:
          "Describes perceived ability to influence and manage other people's emotional states.",
      },
      social_awareness: {
        summary:
          "Describes perceived ability to understand social situations and interact skillfully with others.",
      },
      self_esteem: {
        summary:
          "Describes perceived self-worth, confidence, and overall evaluation of oneself.",
      },
      happiness: {
        summary:
          "Describes perceived cheerfulness, life satisfaction, and general positive mood.",
      },
      optimism: {
        summary:
          "Describes perceived tendency to expect positive outcomes and look toward the future hopefully.",
      },
      adaptability: {
        summary:
          "Describes perceived ability to adjust flexibly to change, uncertainty, and new conditions.",
      },
      self_motivation: {
        summary:
          "Describes perceived drive to pursue goals and keep going despite difficulty.",
      },
    },
  },
  "via-is": {
    scales: {
      transcendence: {
        summary:
          "Describes strengths that connect a person to meaning, purpose, beauty, and something larger than the self.",
        highPole:
          "Linked with stronger appreciation, gratitude, hope, humor, spirituality, and a sense of larger meaning.",
        lowPole:
          "Linked with a more practical or present-focused style and less emphasis on awe, purpose, or spiritual meaning.",
      },
      humanity: {
        summary:
          "Describes interpersonal strengths related to caring for, understanding, and connecting with other people.",
        highPole:
          "Linked with warmth, kindness, close relationships, empathy, and awareness of other people’s feelings.",
        lowPole:
          "Linked with a more detached, private, or self-contained approach to relationships and emotional connection.",
      },
      justice: {
        summary:
          "Describes civic strengths related to fairness, responsibility, teamwork, and healthy group life.",
        highPole:
          "Linked with cooperation, fairness, loyalty, leadership, and concern for group well-being.",
        lowPole:
          "Linked with a more individual-focused style and less emphasis on group duty, fairness, or shared responsibility.",
      },
      wisdom: {
        summary:
          "Describes cognitive strengths related to learning, curiosity, judgment, creativity, and wise perspective.",
        highPole:
          "Linked with curiosity, open-minded thinking, creativity, love of learning, and useful perspective.",
        lowPole:
          "Linked with less interest in abstract ideas, exploration, learning for its own sake, or reflective judgment.",
      },
      temperance: {
        summary:
          "Describes strengths that help a person manage impulses, avoid excess, and respond with restraint.",
        highPole:
          "Linked with self-control, humility, forgiveness, caution, and careful handling of emotions or desires.",
        lowPole:
          "Linked with a more impulsive, reactive, risk-taking, or self-focused approach to choices and conflicts.",
      },
      courage: {
        summary:
          "Describes strengths used to pursue valued goals despite fear, difficulty, pressure, or opposition.",
        highPole:
          "Linked with bravery, persistence, honesty, energy, and willingness to act when something matters.",
        lowPole:
          "Linked with more avoidance, lower persistence, less directness, or reduced energy when facing difficulty.",
      },
    },
    subscales: {
      App: {
        summary:
          "Describes noticing and valuing beauty, excellence, skill, or wonder in the world.",
      },
      Cap: {
        summary:
          "Describes valuing close, caring relationships where affection and support are shared.",
      },
      Cit: {
        summary:
          "Describes working well as part of a group and contributing to shared goals.",
      },
      Cur: {
        summary:
          "Describes interest in exploring new topics, experiences, ideas, and possibilities.",
      },
      Equ: {
        summary:
          "Describes treating people fairly and giving others an equal chance.",
      },
      For: {
        summary:
          "Describes willingness to forgive others and move past resentment after being wronged.",
      },
      Gra: {
        summary:
          "Describes noticing good things and feeling thankful for them.",
      },
      Hop: {
        summary:
          "Describes expecting good things in the future and working toward them.",
      },
      Hum: {
        summary:
          "Describes enjoying laughter, playfulness, and helping others see the lighter side.",
      },
      Ind: {
        summary:
          "Describes finishing what one starts and continuing effort despite obstacles.",
      },
      Int: {
        summary:
          "Describes being honest, genuine, and responsible for one's words and actions.",
      },
      Jud: {
        summary:
          "Describes thinking things through carefully and considering evidence from multiple sides.",
      },
      Kin: {
        summary:
          "Describes helping, caring for, and doing good things for other people.",
      },
      Lea: {
        summary:
          "Describes organizing groups and helping people work together toward shared goals.",
      },
      Lov: {
        summary:
          "Describes enjoying the process of learning new skills, ideas, and bodies of knowledge.",
      },
      Mod: {
        summary:
          "Describes letting accomplishments speak for themselves without seeking special attention.",
      },
      Ori: {
        summary:
          "Describes finding original, useful, or imaginative ways to think and do things.",
      },
      Per: {
        summary:
          "Describes seeing the bigger picture and offering wise, useful guidance to others.",
      },
      Pru: {
        summary:
          "Describes making careful choices and avoiding actions one may later regret.",
      },
      Sel: {
        summary:
          "Describes regulating feelings, impulses, habits, and behavior in line with one's goals.",
      },
      Soc: {
        summary:
          "Describes understanding one's own feelings and the feelings, motives, and needs of others.",
      },
      Spi: {
        summary:
          "Describes beliefs about meaning, purpose, and one's place in a larger order.",
      },
      Val: {
        summary:
          "Describes willingness to act despite fear, difficulty, or social pressure when pursuing something valued.",
      },
      Zes: {
        summary:
          "Describes approaching life with energy, enthusiasm, excitement, and a sense of aliveness.",
      },
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
