import { useState, useEffect } from "react";
import { useLang, type Lang } from "@/lib/i18n";

const navLinks = {
  en: ["Pricing", "Features", "Case Studies", "Resources"],
  ja: ["料金", "機能", "導入事例", "リソース"],
};

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b transition-shadow"
      style={{
        borderColor: "#F0F0F0",
        boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div className="mx-auto flex items-center justify-between px-6" style={{ maxWidth: 1200, height: 64 }}>
        <a href="/" className="text-xl font-bold" style={{ color: "#5936E3" }}>
          easyPoints
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks[lang].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium transition-colors"
              style={{ color: "#6B7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#5936E3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LangToggle lang={lang} setLang={setLang} />
          <a
            href="https://apps.shopify.com/easy-points"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "#5936E3", padding: "10px 20px" }}
          >
            {lang === "en" ? "Install" : "インストール"}
          </a>
        </div>
      </div>
    </nav>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div
      className="flex items-center rounded-full"
      style={{ background: "#F3F4F6", padding: 3 }}
    >
      <button
        onClick={() => setLang("en")}
        className="text-xs font-semibold rounded-full transition-all"
        style={{
          padding: "5px 12px",
          background: lang === "en" ? "white" : "transparent",
          color: lang === "en" ? "#1A1A1A" : "#9CA3AF",
          boxShadow: lang === "en" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ja")}
        className="text-xs font-semibold rounded-full transition-all"
        style={{
          padding: "5px 12px",
          background: lang === "ja" ? "white" : "transparent",
          color: lang === "ja" ? "#1A1A1A" : "#9CA3AF",
          boxShadow: lang === "ja" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
        }}
      >
        JP
      </button>
    </div>
  );
}
