import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CalculatorResult } from "@/lib/calculator";
import { formatYen } from "@/lib/calculator";
import { RefreshCw, TrendingUp, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

interface CalculatorResultsProps {
  result: CalculatorResult;
  currentRepeatRate: number;
  animate: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0);
  return (
    <div
      className="bg-white rounded-xl border text-sm"
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        padding: "12px 16px",
        borderColor: "#F0F0F0",
      }}
    >
      <p className="font-semibold mb-1" style={{ color: "#1A1A1A" }}>
        {label}
      </p>
      {[...payload].reverse().map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color, fontSize: 13 }}>
          {entry.name}: {formatYen(entry.value)}
        </p>
      ))}
      <p className="font-semibold mt-1 pt-1" style={{ borderTop: "1px solid #F0F0F0", fontSize: 13, color: "#1A1A1A" }}>
        Total: {formatYen(total)}
      </p>
    </div>
  );
}

export function CalculatorResults({ result, currentRepeatRate, animate }: CalculatorResultsProps) {
  const { lang, tr } = useT();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!animate) return;
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 100);
    const t2 = setTimeout(() => setStep(2), 300);
    const t3 = setTimeout(() => setStep(3), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [animate, result]);

  const baseTransition = "opacity 0.5s ease, transform 0.5s ease";

  const repeatDesc = lang === "en"
    ? `Up from ${currentRepeatRate}% — generating ${formatYen(result.monthlyRepeat)} extra per month`
    : `現在の${currentRepeatRate}%から — 月${formatYen(result.monthlyRepeat)}の追加収益`;

  return (
    <div className="flex flex-col gap-5 flex-1 min-w-0">
      <div
        className="text-white"
        style={{
          background: "linear-gradient(135deg, #5936E3, #7B5FE8)",
          borderRadius: 16,
          padding: 36,
          opacity: step >= 1 ? 1 : 0,
          transform: step >= 1 ? "translateY(0)" : "translateY(20px)",
          transition: baseTransition,
        }}
      >
        <p
          className="uppercase font-medium mb-2"
          style={{ fontSize: 13, letterSpacing: "0.08em", opacity: 0.8 }}
        >
          {tr.results.additionalRevenue[lang]}
        </p>
        <p className="font-bold" style={{ fontSize: 40, lineHeight: 1.2 }}>
          {formatYen(result.conservative)} – {formatYen(result.optimistic)}
        </p>
        <p className="mt-2" style={{ fontSize: 14, opacity: 0.7 }}>
          {tr.results.rangeNote[lang]}
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        style={{
          opacity: step >= 2 ? 1 : 0,
          transform: step >= 2 ? "translateY(0)" : "translateY(20px)",
          transition: baseTransition,
        }}
      >
        <MetricCard
          icon={<RefreshCw size={18} style={{ color: "#5936E3" }} />}
          label={tr.results.repeatUplift[lang]}
          value={`${result.newRepeatRate}%`}
          description={repeatDesc}
        />
        <MetricCard
          icon={<TrendingUp size={18} style={{ color: "#5936E3" }} />}
          label={tr.results.aovIncrease[lang]}
          value={`${formatYen(result.monthlyAov)}${tr.results.perMonth[lang]}`}
          description={tr.results.membersSpend[lang]}
        />
        <MetricCard
          icon={<Sparkles size={18} style={{ color: "#5936E3" }} />}
          label={tr.results.campaignUplift[lang]}
          value={`${formatYen(result.campaignPerPeriod)}${tr.results.perCampaign[lang]}`}
          description={tr.results.campaignDesc[lang]}
        />
      </div>

      <div
        className="bg-white"
        style={{
          borderRadius: 16,
          padding: 24,
          border: "1px solid #F0F0F0",
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? "translateY(0)" : "translateY(20px)",
          transition: baseTransition,
        }}
      >
        <p className="font-bold" style={{ fontSize: 16, color: "#1A1A1A" }}>
          {tr.results.chartTitle[lang]}
        </p>
        <p className="mt-1 mb-5" style={{ fontSize: 13, color: "#6B7280" }}>
          {tr.results.chartSubtitle[lang]}
        </p>

        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.chartData} stackOffset="none">
              <defs>
                <linearGradient id="repeatFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5936E3" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#5936E3" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="aovFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="campaignFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                horizontal
                vertical={false}
                strokeDasharray=""
                stroke="#F5F5F5"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickFormatter={(v: string) => v.replace("Month ", "M")}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickFormatter={(v: number) => formatYen(v)}
                width={70}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="campaign"
                stackId="1"
                stroke="#10B981"
                strokeWidth={0}
                fill="url(#campaignFill)"
                name={tr.results.chartCampaign[lang]}
              />
              <Area
                type="monotone"
                dataKey="aov"
                stackId="1"
                stroke="#3B82F6"
                strokeWidth={0}
                fill="url(#aovFill)"
                name={tr.results.chartAov[lang]}
              />
              <Area
                type="monotone"
                dataKey="repeat"
                stackId="1"
                stroke="#5936E3"
                strokeWidth={2}
                fill="url(#repeatFill)"
                name={tr.results.chartRepeat[lang]}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-5 mt-4" style={{ fontSize: 13 }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: "#5936E3" }} />
            <span style={{ color: "#6B7280" }}>{tr.results.chartRepeat[lang]}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: "#3B82F6" }} />
            <span style={{ color: "#6B7280" }}>{tr.results.chartAov[lang]}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: "#10B981" }} />
            <span style={{ color: "#6B7280" }}>{tr.results.chartCampaign[lang]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div
      className="bg-white overflow-hidden"
      style={{
        borderRadius: 12,
        padding: 20,
        border: "1px solid #F0F0F0",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="shrink-0">{icon}</span>
        <span
          className="uppercase font-medium"
          style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.04em" }}
        >
          {label}
        </span>
      </div>
      <p className="font-bold" style={{ fontSize: 20, color: "#1A1A1A" }}>
        {value}
      </p>
      <p className="mt-1" style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  );
}
