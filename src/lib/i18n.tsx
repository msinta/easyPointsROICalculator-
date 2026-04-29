import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "ja";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

const translations = {
  nav: {
    pricing: { en: "Pricing", ja: "料金" },
    features: { en: "Features", ja: "機能" },
    caseStudies: { en: "Case Studies", ja: "導入事例" },
    resources: { en: "Resources", ja: "リソース" },
    install: { en: "Install", ja: "インストール" },
  },
  hero: {
    badge: { en: "Free Tool", ja: "無料ツール" },
    title1: { en: "Calculate your loyalty", ja: "ロイヤルティプログラムの" },
    title2: { en: "program ROI", ja: "ROIを計算" },
    subtitle: {
      en: "See how much additional revenue easyPoints could generate for your Shopify store — based on real results from Japanese merchants.",
      ja: "easyPointsがShopifyストアにどれだけの追加収益をもたらすか — 日本のストアの実績データに基づいて試算します。",
    },
  },
  inputs: {
    yourStore: { en: "Your store", ja: "ストア情報" },
    monthlyOrders: { en: "Monthly orders", ja: "月間注文数" },
    aov: { en: "Average order value", ja: "平均注文額" },
    repeatRate: { en: "Current repeat purchase rate", ja: "現在のリピート購入率" },
    industry: { en: "Industry", ja: "業種" },
    grossMargin: { en: "Gross margin", ja: "粗利益率" },
    selectIndustry: { en: "Select industry", ja: "業種を選択" },
    selectMargin: { en: "Select margin", ja: "粗利率を選択" },
    email: { en: "Email (optional)", ja: "メールアドレス（任意）" },
    emailPlaceholder: { en: "you@example.com", ja: "you@example.com" },
    emailHint: { en: "Get your results sent to your inbox", ja: "結果をメールで受け取る" },
    calculate: { en: "Calculate ROI", ja: "ROIを計算する" },
    fillAll: { en: "Fill in all fields to calculate your results", ja: "すべての項目を入力してください" },
  },
  industries: {
    "Beauty & Cosmetics": { en: "Beauty & Cosmetics", ja: "美容・コスメ" },
    "Apparel & Fashion": { en: "Apparel & Fashion", ja: "アパレル・ファッション" },
    "Food & Beverage": { en: "Food & Beverage", ja: "食品・飲料" },
    "Accessories & Jewelry": { en: "Accessories & Jewelry", ja: "アクセサリー・ジュエリー" },
    "Home & Lifestyle": { en: "Home & Lifestyle", ja: "インテリア・ライフスタイル" },
    Electronics: { en: "Electronics", ja: "家電・電子機器" },
    Other: { en: "Other", ja: "その他" },
  } as Record<string, { en: string; ja: string }>,
  margins: {
    "Under 20%": { en: "Under 20%", ja: "20%未満" },
    "20–40%": { en: "20–40%", ja: "20〜40%" },
    "40–60%": { en: "40–60%", ja: "40〜60%" },
    "Over 60%": { en: "Over 60%", ja: "60%以上" },
  } as Record<string, { en: string; ja: string }>,
  results: {
    additionalRevenue: { en: "Additional annual revenue", ja: "年間追加収益" },
    rangeNote: {
      en: "Conservative to optimistic range based on easyPoints Japanese merchant data",
      ja: "easyPointsの日本ストアデータに基づく控えめ〜楽観的な予測範囲",
    },
    repeatUplift: { en: "Repeat uplift", ja: "リピート率向上" },
    aovIncrease: { en: "AOV increase", ja: "客単価向上" },
    campaignUplift: { en: "Campaign uplift", ja: "キャンペーン効果" },
    upFrom: { en: "Up from", ja: "現在の" },
    extraPerMonth: { en: "extra per month", ja: "の追加収益/月" },
    membersSpend: { en: "Members spend ~8% more per order", ja: "会員は1注文あたり約8%多く購入" },
    campaignDesc: { en: "Estimated uplift during 2x point campaigns", ja: "2倍ポイントキャンペーン中の推定効果" },
    perMonth: { en: "/month", ja: "/月" },
    perCampaign: { en: "/campaign", ja: "/キャンペーン" },
    chartTitle: { en: "12-month additional revenue breakdown", ja: "12ヶ月の追加収益内訳" },
    chartSubtitle: { en: "Cumulative uplift by source: repeat purchases, AOV, and campaigns", ja: "リピート購入・客単価・キャンペーンによる累計追加収益" },
    chartRepeat: { en: "Repeat purchases", ja: "リピート購入" },
    chartAov: { en: "AOV uplift", ja: "客単価向上" },
    chartCampaign: { en: "Campaigns", ja: "キャンペーン" },
  },
  emptyState: {
    additionalRevenue: { en: "Additional annual revenue", ja: "年間追加収益" },
    enterDetails: { en: "Enter your store details and click Calculate ROI", ja: "ストア情報を入力し「ROIを計算する」をクリック" },
    repeatUplift: { en: "Repeat uplift", ja: "リピート率向上" },
    aovIncrease: { en: "AOV increase", ja: "客単価向上" },
    campaignUplift: { en: "Campaign uplift", ja: "キャンペーン効果" },
    chartTitle: { en: "12-month revenue projection", ja: "12ヶ月の収益予測" },
    chartSubtitle: { en: "Cumulative revenue from loyalty program", ja: "ロイヤルティプログラムによる累計収益" },
  },
  socialProof: {
    headline: {
      en: "Based on real results from Japanese merchants using easyPoints",
      ja: "easyPointsを利用する日本のストアの実績データに基づいています",
    },
    proofs: {
      en: [
        "Kawaba Online Store — 4.4x repeat purchases",
        "CROUKA — +20% repeat rate",
        "Pincher Japan — 75% point redemption",
      ],
      ja: [
        "川場オンラインストア — リピート購入4.4倍",
        "CROUKA — リピート率+20%",
        "ピンチャージャパン — ポイント利用率75%",
      ],
    },
  },
  recommendation: {
    title: { en: "Recommended program setup for your store", ja: "ストアにおすすめのプログラム設定" },
    earnRate: { en: "Earn rate", ja: "ポイント付与率" },
    tierStructure: { en: "Tier structure", ja: "ティア構成" },
    campaignStrategy: { en: "Campaign strategy", ja: "キャンペーン戦略" },
    pointExpiry: { en: "Point expiry", ja: "ポイント有効期限" },
    freePlan: { en: "Free Plan", ja: "無料プラン" },
    proPlan: { en: "Pro Plan", ja: "Proプラン" },
    basicPlan: { en: "Basic Plan", ja: "Basicプラン" },
  },
  recEarnRate: {
    low: {
      en: "1 point per ¥100 (1% earn rate) — keep rewards conservative at low order values to protect margins",
      ja: "¥100あたり1ポイント（1%付与率）— 低単価では利益率を守るため控えめな付与率を推奨",
    },
    mid: {
      en: "1–2 points per ¥100 (1–2% earn rate) — standard for your price range",
      ja: "¥100あたり1〜2ポイント（1〜2%付与率）— この価格帯の標準的な付与率",
    },
    high: {
      en: "2 points per ¥100 (2% earn rate) — higher AOV supports more generous rewards",
      ja: "¥100あたり2ポイント（2%付与率）— 高単価なのでより手厚いリワードが可能",
    },
  },
  recTiers: {
    low: {
      en: "No tiers yet — focus on building your member base first. Add tiers when you reach 300+ active members",
      ja: "まだティアは不要 — まず会員基盤の構築に注力。アクティブ会員300人以上でティア導入を推奨",
    },
  },
  recCampaign: {
    "Beauty & Cosmetics": {
      en: "Birthday point campaigns perform exceptionally well in beauty. Run 2x point events around skincare seasonal launches",
      ja: "誕生日ポイントキャンペーンは美容分野で特に効果的。スキンケアの季節商品発売時に2倍ポイントイベントを実施",
    },
    "Food & Beverage": {
      en: "Monthly bonus point days drive repeat visits — similar to Kawaba Online Store's 4.4x repeat purchase result",
      ja: "月間ボーナスポイントデーがリピート来店を促進 — 川場オンラインストアの4.4倍リピート購入と同様の施策",
    },
    "Apparel & Fashion": {
      en: "Season-change campaigns (spring/autumn) with 2x points on new arrivals drive strong results — used by CROUKA for +20% repeat rate",
      ja: "季節の変わり目キャンペーン（春/秋）で新商品に2倍ポイント付与 — CROUKAはこの手法でリピート率+20%を達成",
    },
    "Home & Lifestyle": {
      en: "Gift-season campaigns (お中元 July, お歳暮 December) with bonus points perform best for home goods",
      ja: "ギフトシーズン（お中元7月、お歳暮12月）にボーナスポイントを付与する施策がインテリア商材に最適",
    },
    default: {
      en: "Run 2x point campaigns 4–6 times per year tied to Japanese seasonal events (New Year, Golden Week, summer, end of year)",
      ja: "日本の季節イベント（正月、ゴールデンウィーク、夏、年末）に合わせて年4〜6回の2倍ポイントキャンペーンを実施",
    },
  } as Record<string, { en: string; ja: string }>,
  recExpiry: {
    low: {
      en: "Set points to expire after 12 months of inactivity — creates urgency for low-engagement customers to return",
      ja: "12ヶ月の無活動でポイント失効に設定 — エンゲージメントの低い顧客の再来店を促進",
    },
    mid: {
      en: "Set points to expire after 18 months — balances urgency with customer goodwill",
      ja: "18ヶ月でポイント失効に設定 — 緊急感と顧客満足度のバランスを確保",
    },
    high: {
      en: "Expiry optional — your customers are already engaged. Consider expiry only if you want to clear dormant point liability",
      ja: "有効期限は任意 — 顧客はすでにアクティブ。休眠ポイントの負債を整理したい場合のみ検討",
    },
  },
  cta: {
    title: { en: "Ready to see these results in your store?", ja: "あなたのストアでこの成果を実現しませんか？" },
    subtitle: {
      en: "Free to install. No credit card required. 300 active customers included on the free plan.",
      ja: "無料でインストール。クレジットカード不要。無料プランで300人のアクティブ顧客まで対応。",
    },
    button: { en: "Install easyPoints free", ja: "easyPointsを無料でインストール" },
    stats: {
      en: "4,000+ Japanese Shopify stores \u00b7 4.8\u2605 rating \u00b7 5 years in service",
      ja: "日本のShopifyストア4,000以上 \u00b7 評価4.8\u2605 \u00b7 サービス開始5年",
    },
  },
  footer: {
    tagline: { en: "Rewards program app for Shopify stores", ja: "Shopifyストア向けリワードプログラムアプリ" },
    copyright: { en: "Team Lunaris, 2024. All rights reserved.", ja: "Team Lunaris, 2024. All rights reserved." },
    terms: { en: "Terms and conditions", ja: "利用規約" },
    columns: {
      en: [
        { title: "About", links: ["Our Story", "Careers", "Blog", "Press Kit"] },
        { title: "Features", links: ["Point Rewards", "VIP Tiers", "Referrals", "Point Campaigns", "Shopify POS"] },
        { title: "Resources", links: ["Help Center", "Documentation", "Case Studies", "API Reference"] },
        { title: "Company", links: ["Contact Us", "Partners", "Privacy Policy", "Terms of Service"] },
      ],
      ja: [
        { title: "企業情報", links: ["ストーリー", "採用情報", "ブログ", "プレスキット"] },
        { title: "機能", links: ["ポイント特典", "VIPティア", "リファラル", "ポイントキャンペーン", "Shopify POS"] },
        { title: "リソース", links: ["ヘルプセンター", "ドキュメント", "導入事例", "APIリファレンス"] },
        { title: "会社", links: ["お問い合わせ", "パートナー", "プライバシーポリシー", "利用規約"] },
      ],
    },
  },
} as const;

export function useT() {
  const { lang } = useLang();
  return { lang, tr: translations };
}
