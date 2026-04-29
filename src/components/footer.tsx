import { useT } from "@/lib/i18n";

export function Footer() {
  const { lang, tr } = useT();
  const columns = tr.footer.columns[lang];

  return (
    <footer style={{ background: "#1A1A1A", color: "white", padding: "60px 24px 0" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-10">
          <div className="col-span-2">
            <p className="text-lg font-bold">easyPoints</p>
            <p className="mt-2" style={{ fontSize: 14, color: "#9CA3AF" }}>
              {tr.footer.tagline[lang]}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-semibold text-sm mb-3" style={{ color: "#D1D5DB" }}>
                {col.title}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "#9CA3AF" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-4 py-6"
          style={{ borderTop: "1px solid #333" }}
        >
          <p style={{ fontSize: 13, color: "#6B7280" }}>
            &copy; {tr.footer.copyright[lang]}
          </p>
          <a href="#" className="text-sm" style={{ color: "#6B7280" }}>
            {tr.footer.terms[lang]}
          </a>
        </div>
      </div>
    </footer>
  );
}
