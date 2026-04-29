# easyPoints ROI Calculator

A tool that helps Shopify merchants estimate how much additional revenue a loyalty program could generate for their store. Built for the easyPoints marketing site.

Merchants input their store metrics (monthly orders, AOV, repeat rate, industry) and get a projected revenue range backed by real data from Japanese easyPoints merchants.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts (stacked area chart)
- shadcn/ui components
- English / Japanese language toggle

## Getting started

```
npm install
npm run dev
```

## Build

```
npm run build
```

Output goes to `dist/`.

## How it works

1. User fills in store details (orders, AOV, repeat rate, industry, margin)
2. Optionally enters an email to receive results
3. Clicks "Calculate ROI"
4. Results show a conservative-to-optimistic revenue range, broken down by:
   - Repeat purchase uplift
   - AOV increase from loyalty members
   - Campaign revenue (2x point events)
5. A 12-month stacked area chart shows cumulative uplift by source
6. A recommended program setup section appears based on store size

The math uses industry-specific uplift rates derived from easyPoints merchant benchmarks. See `src/lib/calculator.ts` for the formulas.

## Project structure

```
src/
  App.tsx              — main layout, state management
  lib/
    calculator.ts      — ROI formulas and types
    i18n.tsx           — translations (en/ja)
    utils.ts           — tailwind merge helper
  components/
    calculator-inputs  — form with sliders, selects, email field
    calculator-results — revenue cards + stacked area chart
    empty-state        — placeholder before calculation
    recommendation     — program setup suggestions
    hero, nav, cta,
    footer, social-proof
    ui/                — shadcn primitives
```
