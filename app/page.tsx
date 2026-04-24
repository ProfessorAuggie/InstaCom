"use client";

import { useMemo, useState } from "react";
import { DEFAULT_INPUTS, evaluateBehavioralThresholdModel, type ModelInputs } from "@/lib/model";

type SliderSpec = {
  key: keyof ModelInputs;
  label: string;
  hint: string;
};

const SLIDERS: SliderSpec[] = [
  {
    key: "personalizationIntensity",
    label: "Personalization Intensity",
    hint: "How aggressively the feed optimizes for predicted preferences."
  },
  {
    key: "contentHomogeneity",
    label: "Content Homogeneity",
    hint: "How narrow and repetitive recommendations become over time."
  },
  {
    key: "engagementPressure",
    label: "Engagement Pressure",
    hint: "Strength of tactics designed to maximize watch-time and interactions."
  },
  {
    key: "autonomyFriction",
    label: "Autonomy Friction",
    hint: "Difficulty of opting out, editing preferences, or pausing recommendations."
  },
  {
    key: "userVulnerability",
    label: "User Vulnerability",
    hint: "Contextual susceptibility (age, stress, mental load, digital literacy)."
  },
  {
    key: "transparency",
    label: "Transparency",
    hint: "Clarity of why content appears and availability of meaningful controls."
  }
];

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <h3>{Math.round(value * 100)}%</h3>
    </article>
  );
}

export default function Home() {
  const [inputs, setInputs] = useState<ModelInputs>(DEFAULT_INPUTS);

  const result = useMemo(() => evaluateBehavioralThresholdModel(inputs), [inputs]);

  return (
    <main className="page-wrap">
      <section className="hero">
        <p className="eyebrow">Research Prototype</p>
        <h1>Predicting When Personalization Becomes Manipulation</h1>
        <p className="subtitle">
          This interactive website operationalizes a behavioral threshold model for social media algorithms and
          estimates manipulation risk from platform design factors.
        </p>
      </section>

      <section className="grid">
        <article className="panel control-panel">
          <div className="panel-header">
            <h2>Model Inputs</h2>
            <button
              type="button"
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="ghost-btn"
              aria-label="Reset model inputs"
            >
              Reset
            </button>
          </div>

          {SLIDERS.map((item) => (
            <div className="slider-row" key={item.key}>
              <div className="slider-label-row">
                <label htmlFor={item.key}>{item.label}</label>
                <span>{inputs[item.key]}</span>
              </div>
              <input
                id={item.key}
                type="range"
                min={0}
                max={100}
                value={inputs[item.key]}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    [item.key]: Number(event.target.value)
                  }))
                }
              />
              <p className="hint">{item.hint}</p>
            </div>
          ))}
        </article>

        <article className="panel result-panel">
          <div className="panel-header">
            <h2>Risk Assessment</h2>
            <span className={`status status-${result.category.toLowerCase().replace(" ", "-")}`}>
              {result.category}
            </span>
          </div>

          <div className="metrics">
            <MetricCard label="Manipulation Risk" value={result.manipulationRisk} />
            <MetricCard label="Behavioral Threshold" value={result.behavioralThreshold} />
            <MetricCard label="Net Pressure" value={result.netPressure} />
            <MetricCard label="Resistance Factor" value={result.resistanceFactor} />
          </div>

          <p className="explanation">{result.explanation}</p>

          <div className="bars">
            {result.components.map((component) => (
              <div className="bar-row" key={component.key}>
                <p>{component.label}</p>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${component.weight < 0 ? "negative" : "positive"}`}
                    style={{ width: `${Math.round(Math.abs(component.contribution) * 100)}%` }}
                  />
                </div>
                <span>{component.contribution.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel model-note">
        <h2>Model Note</h2>
        <p>
          This implementation is a transparent scoring prototype designed for experimentation, peer review, and
          calibration against empirical study data. You can tune the model in
          <code> lib/model.ts </code>
          to match your published coefficients and validation set.
        </p>
      </section>
    </main>
  );
}
