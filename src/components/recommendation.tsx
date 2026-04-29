import { Gift, Layers, Megaphone, Clock } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";
import type { Industry } from "@/lib/calculator";

interface RecommendationProps {
  aov: number;
  monthlyOrders: number;
  repeatRate: number;
  industry: Industry;
}

function getEarnRate(aov: number, lang: Lang, tr: ReturnType<typeof useT>["tr"]) {
  if (aov < 3000) return tr.recEarnRate.low[lang];
  if (aov <= 10000) return tr.recEarnRate.mid[lang];
  return tr.recEarnRate.high[lang];
}

function getTierStructure(
  monthlyOrders: number,
  aov: number,
  lang: Lang,
  tr: ReturnType<typeof useT>["tr"]
) {
  const monthlyRevenue = monthlyOrders * aov;
  if (monthlyRevenue < 500000) {
    return tr.recTiers.low[lang];
  }
  const silverThreshold = (aov * 10).toLocaleString("ja-JP");
  const goldThreshold = lang === "en"
    ? (aov * 30).toLocaleString("ja-JP")
    : (aov * 30).toLocaleString("ja-JP");
  if (monthlyRevenue <= 3000000) {
    return lang === "en"
      ? `2 tiers recommended: Silver at ¥${silverThreshold} cumulative spend, Gold at ¥${goldThreshold}`
      : `2ティアを推奨：シルバー（累計¥${silverThreshold}）、ゴールド（累計¥${goldThreshold}）`;
  }
  const platinumThreshold = (aov * 50).toLocaleString("ja-JP");
  const goldHighThreshold = (aov * 25).toLocaleString("ja-JP");
  return lang === "en"
    ? `3 tiers recommended: Silver at ¥${silverThreshold}, Gold at ¥${goldHighThreshold}, Platinum at ¥${(aov * 50).toLocaleString("ja-JP")}`
    : `3ティアを推奨：シルバー（¥${silverThreshold}）、ゴールド（¥${goldHighThreshold}）、プラチナ（¥${platinumThreshold}）`;
}

function getCampaignStrategy(
  industry: Industry,
  lang: Lang,
  tr: ReturnType<typeof useT>["tr"]
) {
  const key = tr.recCampaign[industry] ? industry : "default";
  return tr.recCampaign[key][lang];
}

function getPointExpiry(
  repeatRate: number,
  lang: Lang,
  tr: ReturnType<typeof useT>["tr"]
) {
  if (repeatRate < 15) return tr.recExpiry.low[lang];
  if (repeatRate <= 30) return tr.recExpiry.mid[lang];
  return tr.recExpiry.high[lang];
}

export function Recommendation({
  aov,
  monthlyOrders,
  repeatRate,
  industry,
}: RecommendationProps) {
  const { lang, tr } = useT();

  const earnRate = getEarnRate(aov, lang, tr);
  const tierStructure = getTierStructure(monthlyOrders, aov, lang, tr);
  const campaignStrategy = getCampaignStrategy(industry, lang, tr);
  const pointExpiry = getPointExpiry(repeatRate, lang, tr);

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold mb-8 text-foreground">
          {tr.recommendation.title[lang]}
        </h2>

        <div className="bg-card rounded-2xl shadow-sm p-9">
          <div className="flex flex-col gap-6">
            <RecItem
              icon={<Gift size={20} className="text-[#5936E3]" />}
              title={tr.recommendation.earnRate[lang]}
              text={earnRate}
              tag={tr.recommendation.freePlan[lang]}
              tagVariant="green"
            />
            <div className="border-t border-border" />
            <RecItem
              icon={<Layers size={20} className="text-[#5936E3]" />}
              title={tr.recommendation.tierStructure[lang]}
              text={tierStructure}
              tag={tr.recommendation.proPlan[lang]}
              tagVariant="purple"
            />
            <div className="border-t border-border" />
            <RecItem
              icon={<Megaphone size={20} className="text-[#5936E3]" />}
              title={tr.recommendation.campaignStrategy[lang]}
              text={campaignStrategy}
              tag={tr.recommendation.basicPlan[lang]}
              tagVariant="blue"
            />
            <div className="border-t border-border" />
            <RecItem
              icon={<Clock size={20} className="text-[#5936E3]" />}
              title={tr.recommendation.pointExpiry[lang]}
              text={pointExpiry}
              tag={tr.recommendation.basicPlan[lang]}
              tagVariant="blue"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const TAG_STYLES = {
  green: { background: "#ECFDF5", color: "#059669" },
  purple: { background: "#EEE9FF", color: "#5936E3" },
  blue: { background: "#EFF6FF", color: "#3B82F6" },
} as const;

function RecItem({
  icon,
  title,
  text,
  tag,
  tagVariant,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tag: string;
  tagVariant: keyof typeof TAG_STYLES;
}) {
  const tagStyle = TAG_STYLES[tagVariant];
  return (
    <div className="flex gap-4">
      <div
        className="flex items-center justify-center shrink-0 rounded-[10px]"
        style={{ width: 40, height: 40, background: "#F5F4FF" }}
      >
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-[15px] text-foreground">{title}</p>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={tagStyle}
          >
            {tag}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
