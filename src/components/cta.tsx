import { useT } from "@/lib/i18n";

export function Cta() {
  const { lang, tr } = useT();

  return (
    <section className="text-center" style={{ padding: "80px 24px" }}>
      <div className="mx-auto" style={{ maxWidth: 600 }}>
        <h2 className="font-bold" style={{ fontSize: 32, color: "#1A1A1A", lineHeight: 1.2 }}>
          {tr.cta.title[lang]}
        </h2>
        <p className="mt-4" style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>
          {tr.cta.subtitle[lang]}
        </p>
        <a
          href="https://apps.shopify.com/easy-points"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
          style={{ background: "#5936E3", padding: "14px 28px", fontSize: 16, borderRadius: 8 }}
        >
          {tr.cta.button[lang]} &rarr;
        </a>
        <p className="mt-4" style={{ fontSize: 13, color: "#9CA3AF" }}>
          {tr.cta.stats[lang]}
        </p>
      </div>
    </section>
  );
}
