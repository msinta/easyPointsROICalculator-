import { useT } from "@/lib/i18n";

export function SocialProof() {
  const { lang, tr } = useT();

  return (
    <section style={{ background: "#F5F4FF", padding: "32px 24px" }}>
      <div className="mx-auto text-center" style={{ maxWidth: 1200 }}>
        <p className="mb-4" style={{ fontSize: 14, color: "#6B7280" }}>
          {tr.socialProof.headline[lang]}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {tr.socialProof.proofs[lang].map((text) => (
            <span
              key={text}
              className="bg-white inline-flex items-center"
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 100,
                padding: "8px 20px",
                fontSize: 14,
                color: "#1A1A1A",
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
