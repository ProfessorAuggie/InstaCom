export type ModelInputs = {
  personalizationIntensity: number;
  contentHomogeneity: number;
  engagementPressure: number;
  autonomyFriction: number;
  userVulnerability: number;
  transparency: number;
};

export type ScoreComponent = {
  key: keyof ModelInputs;
  label: string;
  value: number;
  weight: number;
  contribution: number;
};

export type ReelRecommendation = {
  id: string;
  title: string;
  category: string;
  score: number;
  rationale: string;
  safetyTag: "Balanced" | "Caution";
};

export type ModelOutput = {
  manipulationPressure: number;
  resistanceFactor: number;
  behavioralThreshold: number;
  netPressure: number;
  manipulationRisk: number;
  category: "Low Risk" | "Borderline" | "Manipulative";
  components: ScoreComponent[];
  recommendations: ReelRecommendation[];
  explanation: string;
};

type ReelProfile = {
  id: string;
  title: string;
  category: string;
  novelty: number;
  depth: number;
  intensity: number;
  socialProof: number;
  transparencyFit: number;
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));

const WEIGHTS: Record<keyof ModelInputs, number> = {
  personalizationIntensity: 0.24,
  contentHomogeneity: 0.17,
  engagementPressure: 0.22,
  autonomyFriction: 0.2,
  userVulnerability: 0.12,
  transparency: -0.15
};

const LABELS: Record<keyof ModelInputs, string> = {
  personalizationIntensity: "Personalization Intensity",
  contentHomogeneity: "Content Homogeneity",
  engagementPressure: "Engagement Pressure",
  autonomyFriction: "Autonomy Friction",
  userVulnerability: "User Vulnerability",
  transparency: "Transparency"
};

const REEL_CATALOG: ReelProfile[] = [
  {
    id: "r1",
    title: "Quick Science Myth-Busting",
    category: "Education",
    novelty: 0.86,
    depth: 0.76,
    intensity: 0.38,
    socialProof: 0.55,
    transparencyFit: 0.8
  },
  {
    id: "r2",
    title: "Street Photography Challenge",
    category: "Creativity",
    novelty: 0.74,
    depth: 0.61,
    intensity: 0.44,
    socialProof: 0.58,
    transparencyFit: 0.72
  },
  {
    id: "r3",
    title: "Daily Fitness Micro-Routine",
    category: "Wellness",
    novelty: 0.57,
    depth: 0.72,
    intensity: 0.51,
    socialProof: 0.62,
    transparencyFit: 0.69
  },
  {
    id: "r4",
    title: "Comedic Relatable Skits",
    category: "Entertainment",
    novelty: 0.49,
    depth: 0.42,
    intensity: 0.68,
    socialProof: 0.81,
    transparencyFit: 0.45
  },
  {
    id: "r5",
    title: "Travel Hidden Gems",
    category: "Lifestyle",
    novelty: 0.78,
    depth: 0.64,
    intensity: 0.47,
    socialProof: 0.59,
    transparencyFit: 0.75
  },
  {
    id: "r6",
    title: "High-Drama Reaction Clips",
    category: "Viral",
    novelty: 0.37,
    depth: 0.21,
    intensity: 0.92,
    socialProof: 0.96,
    transparencyFit: 0.2
  },
  {
    id: "r7",
    title: "Startup and Career Breakdowns",
    category: "Professional",
    novelty: 0.66,
    depth: 0.82,
    intensity: 0.42,
    socialProof: 0.57,
    transparencyFit: 0.85
  },
  {
    id: "r8",
    title: "DIY Home Hacks",
    category: "Practical",
    novelty: 0.63,
    depth: 0.58,
    intensity: 0.46,
    socialProof: 0.64,
    transparencyFit: 0.7
  }
];

function recommendReels(inputs: ModelInputs, manipulationRisk: number): ReelRecommendation[] {
  const personalization = clamp01(inputs.personalizationIntensity / 100);
  const homogeneity = clamp01(inputs.contentHomogeneity / 100);
  const engagementPressure = clamp01(inputs.engagementPressure / 100);
  const autonomyFriction = clamp01(inputs.autonomyFriction / 100);
  const vulnerability = clamp01(inputs.userVulnerability / 100);
  const transparency = clamp01(inputs.transparency / 100);

  return REEL_CATALOG.map((reel) => {
    const preferenceFit =
      reel.novelty * (1 - homogeneity) * 0.3 +
      reel.depth * (1 - vulnerability) * 0.3 +
      reel.socialProof * personalization * 0.25 +
      reel.transparencyFit * transparency * 0.15;

    const manipulationPenalty =
      reel.intensity * engagementPressure * 0.45 +
      reel.socialProof * autonomyFriction * 0.2 +
      manipulationRisk * (1 - reel.transparencyFit) * 0.35;

    const score = clamp01(preferenceFit - manipulationPenalty * 0.4 + 0.25);

    const safetyTag: ReelRecommendation["safetyTag"] =
      score > 0.6 && reel.intensity < 0.7 && reel.transparencyFit > 0.55 ? "Balanced" : "Caution";

    const rationale =
      safetyTag === "Balanced"
        ? "Good fit with lower manipulation pressure and clearer recommendation quality."
        : "High engagement pull or lower transparency fit; monitor exposure frequency.";

    return {
      id: reel.id,
      title: reel.title,
      category: reel.category,
      score,
      rationale,
      safetyTag
    };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export const DEFAULT_INPUTS: ModelInputs = {
  personalizationIntensity: 70,
  contentHomogeneity: 60,
  engagementPressure: 75,
  autonomyFriction: 65,
  userVulnerability: 50,
  transparency: 30
};

export function evaluateBehavioralThresholdModel(inputs: ModelInputs): ModelOutput {
  const normalized = {
    personalizationIntensity: clamp01(inputs.personalizationIntensity / 100),
    contentHomogeneity: clamp01(inputs.contentHomogeneity / 100),
    engagementPressure: clamp01(inputs.engagementPressure / 100),
    autonomyFriction: clamp01(inputs.autonomyFriction / 100),
    userVulnerability: clamp01(inputs.userVulnerability / 100),
    transparency: clamp01(inputs.transparency / 100)
  };

  const components: ScoreComponent[] = (Object.keys(normalized) as Array<keyof ModelInputs>).map((key) => ({
    key,
    label: LABELS[key],
    value: normalized[key],
    weight: WEIGHTS[key],
    contribution: normalized[key] * WEIGHTS[key]
  }));

  const manipulationPressure = clamp01(
    normalized.personalizationIntensity * 0.3 +
      normalized.contentHomogeneity * 0.2 +
      normalized.engagementPressure * 0.28 +
      normalized.autonomyFriction * 0.22
  );

  const resistanceFactor = clamp01(normalized.transparency * 0.7 + (1 - normalized.userVulnerability) * 0.3);

  // Dynamic threshold: higher transparency raises the threshold for manipulative classification.
  const behavioralThreshold = clamp01(0.52 + normalized.transparency * 0.2 - normalized.userVulnerability * 0.12);

  const rawScore = components.reduce((sum, item) => sum + item.contribution, 0);
  const netPressure = clamp01(manipulationPressure - resistanceFactor * 0.22 + rawScore * 0.35 + 0.15);

  // Convert distance from threshold into probability-like risk value.
  const manipulationRisk = clamp01(sigmoid((netPressure - behavioralThreshold) * 8));

  let category: ModelOutput["category"] = "Low Risk";
  if (manipulationRisk >= 0.66) {
    category = "Manipulative";
  } else if (manipulationRisk >= 0.34) {
    category = "Borderline";
  }

  const explanation =
    category === "Manipulative"
      ? "The predicted pressure exceeds behavioral safeguards and likely crosses a manipulation threshold."
      : category === "Borderline"
        ? "The system is close to crossing into manipulation and should be audited for safer defaults."
        : "The system appears persuasive but remains below the manipulation boundary under current assumptions.";

        const recommendations = recommendReels(inputs, manipulationRisk);

  return {
    manipulationPressure,
    resistanceFactor,
    behavioralThreshold,
    netPressure,
    manipulationRisk,
    category,
    components,
    recommendations,
    explanation
  };
}
