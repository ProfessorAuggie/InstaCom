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

export type ModelOutput = {
  manipulationPressure: number;
  resistanceFactor: number;
  behavioralThreshold: number;
  netPressure: number;
  manipulationRisk: number;
  category: "Low Risk" | "Borderline" | "Manipulative";
  components: ScoreComponent[];
  explanation: string;
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

  return {
    manipulationPressure,
    resistanceFactor,
    behavioralThreshold,
    netPressure,
    manipulationRisk,
    category,
    components,
    explanation
  };
}
