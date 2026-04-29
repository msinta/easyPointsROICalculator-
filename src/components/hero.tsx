import { useT } from "@/lib/i18n";

export function Hero() {
  const { lang, tr } = useT();

  return (
    <section className="text-center" style={{ padding: "80px 24px 60px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <span
          className="inline-block text-sm font-semibold rounded-full"
          style={{
            background: "#EEE9FF",
            color: "#5936E3",
            padding: "6px 16px",
            fontSize: 14,
            borderRadius: 100,
          }}
        >
          {tr.hero.badge[lang]}
        </span>

        <h1 className="mt-6 font-bold tracking-tight" style={{ fontSize: 52, lineHeight: 1.1, color: "#1A1A1A" }}>
          {tr.hero.title1[lang]}
          <br />
          <span className="italic font-serif" style={{ color: "#5936E3" }}>
            {tr.hero.title2[lang]}
          </span>
        </h1>

        <p
          className="mx-auto mt-5"
          style={{ fontSize: 18, color: "#6B7280", maxWidth: 560, lineHeight: 1.6 }}
        >
          {tr.hero.subtitle[lang]}
        </p>
      </div>
    </section>
  );
}
