export type Industry =
  | "Beauty & Cosmetics"
  | "Apparel & Fashion"
  | "Food & Beverage"
  | "Accessories & Jewelry"
  | "Home & Lifestyle"
  | "Electronics"
  | "Other";

export type GrossMargin = "Under 20%" | "20–40%" | "40–60%" | "Over 60%";

const INDUSTRY_UPLIFT: Record<Industry, number> = {
  "Beauty & Cosmetics": 0.22,
  "Apparel & Fashion": 0.18,
  "Food & Beverage": 0.25,
  "Accessories & Jewelry": 0.18,
  "Home & Lifestyle": 0.15,
  Electronics: 0.12,
  Other: 0.15,
};

const MEMBERSHIP_RATE = 0.12;
const AOV_UPLIFT = 0.08;

export interface CalculatorResult {
  conservative: number;
  optimistic: number;
  monthlyRepeat: number;
  monthlyAov: number;
  campaignPerPeriod: number;
  newRepeatRate: number;
  chartData: { month: string; repeat: number; aov: number; campaign: number }[];
}

export function calculate(
  monthlyOrders: number,
  aov: number,
  currentRepeatRate: number,
  industry: Industry
): CalculatorResult {
  const repeatUplift = INDUSTRY_UPLIFT[industry];
  const newRepeatRate =
    (currentRepeatRate + currentRepeatRate * repeatUplift) * 100;

  const repeatRevenue = monthlyOrders * MEMBERSHIP_RATE * aov * repeatUplift;
  const aovRevenue = monthlyOrders * MEMBERSHIP_RATE * aov * AOV_UPLIFT;
  const campaignRevenue = monthlyOrders * aov * 0.02 * 0.5;

  const monthlyUplift = repeatRevenue + aovRevenue + campaignRevenue;
  const annualUplift = monthlyUplift * 12;

  return {
    conservative: Math.round(annualUplift * 0.7),
    optimistic: Math.round(annualUplift * 1.3),
    monthlyRepeat: Math.round(repeatRevenue),
    monthlyAov: Math.round(aovRevenue),
    campaignPerPeriod: Math.round(campaignRevenue),
    newRepeatRate: Math.round(newRepeatRate * 10) / 10,
    chartData: Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      repeat: Math.round(repeatRevenue * (i + 1)),
      aov: Math.round(aovRevenue * (i + 1)),
      campaign: Math.round(campaignRevenue * (i + 1)),
    })),
  };
}

export function formatYen(n: number): string {
  if (n >= 100000000) return `¥${(n / 100000000).toFixed(1)}億`;
  if (n >= 10000) return `¥${Math.round(n / 10000).toLocaleString()}万`;
  return `¥${n.toLocaleString("ja-JP")}`;
}

export const INDUSTRIES: Industry[] = [
  "Beauty & Cosmetics",
  "Apparel & Fashion",
  "Food & Beverage",
  "Accessories & Jewelry",
  "Home & Lifestyle",
  "Electronics",
  "Other",
];

export const MARGINS: GrossMargin[] = [
  "Under 20%",
  "20–40%",
  "40–60%",
  "Over 60%",
];