import { RefreshCw, TrendingUp, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

export function EmptyState() {
  const { lang, tr } = useT();

  return (
    <div className="flex flex-col gap-5 flex-1 min-w-0" style={{ opacity: 0.5 }}>
      <div
        style={{
          background: "linear-gradient(135deg, #D6CEFA, #E4DDFB)",
          borderRadius: 16,
          padding: 36,
        }}
      >
        <p
          className="uppercase font-medium mb-2"
          style={{ fontSize: 13, letterSpacing: "0.08em", color: "#8B7FC7" }}
        >
          {tr.emptyState.additionalRevenue[lang]}
        </p>
        <div className="flex items-center gap-3 mb-2">
          <span style={{ fontSize: 40, fontWeight: 700, color: "#A599D6" }}>--</span>
        </div>
        <p style={{ fontSize: 14, color: "#A599D6" }}>
          {tr.emptyState.enterDetails[lang]}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonMetric
          icon={<RefreshCw size={18} style={{ color: "#C4B5FD" }} />}
          label={tr.emptyState.repeatUplift[lang]}
        />
        <SkeletonMetric
          icon={<TrendingUp size={18} style={{ color: "#C4B5FD" }} />}
          label={tr.emptyState.aovIncrease[lang]}
        />
        <SkeletonMetric
          icon={<Sparkles size={18} style={{ color: "#C4B5FD" }} />}
          label={tr.emptyState.campaignUplift[lang]}
        />
      </div>

      <div
        style={{
          borderRadius: 16,
          padding: 24,
          border: "1px solid #E5E7EB",
          background: "#FAFAFA",
        }}
      >
        <p className="font-bold" style={{ fontSize: 16, color: "#9CA3AF" }}>
          {tr.emptyState.chartTitle[lang]}
        </p>
        <p className="mt-1 mb-5" style={{ fontSize: 13, color: "#D1D5DB" }}>
          {tr.emptyState.chartSubtitle[lang]}
        </p>
        <div
          className="flex items-end justify-between"
          style={{ height: 160, paddingBottom: 8 }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                width: "6%",
                height: `${12 + i * 7}%`,
                background: "#E5E7EB",
                borderRadius: "4px 4px 0 0",
              }}
            />
          ))}
        </div>
        <div
          className="flex justify-between mt-2"
          style={{ fontSize: 11, color: "#D1D5DB" }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i}>M{i + 1}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonMetric({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: 20,
        border: "1px solid #E5E7EB",
        background: "#FAFAFA",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="shrink-0">{icon}</span>
        <span
          className="uppercase font-medium"
          style={{ fontSize: 11, color: "#D1D5DB", letterSpacing: "0.04em" }}
        >
          {label}
        </span>
      </div>
      <p className="font-bold" style={{ fontSize: 20, color: "#D1D5DB" }}>
        --
      </p>
      <div
        className="mt-2 rounded"
        style={{ height: 12, width: "75%", background: "#E5E7EB" }}
      />
    </div>
  );
}
