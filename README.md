# InstaCom: Behavioral Threshold Model Web App

This repository contains a Vercel-ready Next.js website implementing a research prototype model for:

- Predicting when personalization pressure crosses into manipulation
- Visualizing behavioral thresholds in social media algorithm design
- Exploring scenario changes through interactive inputs

## Model Summary

The model is implemented in `lib/model.ts` and combines:

- Manipulation pressure factors:
	- Personalization intensity
	- Content homogeneity
	- Engagement pressure
	- Autonomy friction
- Contextual/user factors:
	- User vulnerability
	- Transparency (protective)

Output includes:

- Manipulation risk score (0 to 1)
- Behavioral threshold (dynamic)
- Net pressure
- Risk category (`Low Risk`, `Borderline`, `Manipulative`)
- Component contribution bars for interpretability

## Quick Start

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Tune to Your Paper

Edit coefficients and thresholds in `lib/model.ts`:

- `WEIGHTS`
- `behavioralThreshold` formula
- `manipulationPressure` and `resistanceFactor` formulas
- category cutoffs

This lets you align the implementation to your exact empirical coefficients and validation data.

## Deploy to Vercel

### Option 1: Vercel Dashboard

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Framework auto-detects as Next.js.
4. Deploy.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

For production:

```bash
vercel --prod
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Custom CSS (responsive, desktop + mobile)

## Notes

The paper files were attached in the chat, but not directly available inside workspace files for automatic parsing. The current implementation is a research-aligned prototype inferred from your paper titles and structure. Once you provide exact equations/coefficients from the manuscript text, the model can be updated in minutes.