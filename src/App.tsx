import { useState, useEffect } from "react";
import { Leaderboard } from "@/components/pool/Leaderboard";
import { EntriesTab } from "@/components/pool/EntriesTab";
import { AdminTab } from "@/components/pool/AdminTab";
import { LoginModal } from "@/components/pool/LoginModal";
import type { UserSession } from "@/lib/types";

type Tab = "leaderboard" | "entries" | "admin";

const SESSION_KEY = "wc_pool_session";

export default function App() {
  const [tab, setTab] = useState<Tab>("leaderboard");
  const [session, setSession] = useState<UserSession>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<"participant" | "admin">("participant");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) setSession(JSON.parse(stored));
    } catch {}
  }, []);

  function handleLogin(s: UserSession) {
    setSession(s);
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
    if (s?.type === "admin") setTab("admin");
  }

  function handleLogout() {
    setSession(null);
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    setTab("leaderboard");
  }

  function openLogin(mode: "participant" | "admin") {
    setLoginMode(mode);
    setLoginOpen(true);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "leaderboard", label: "🏆 Leaderboard" },
    { id: "entries", label: "📋 Entries" },
    ...(session?.type === "admin" ? [{ id: "admin" as Tab, label: "⚙️ Admin" }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl">⚽</span>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                Guardian Capital
              </p>
              <p className="text-xs text-gray-400 leading-tight">2026 World Cup Pool</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {session ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {session.type === "admin" ? "⚙️ Admin" : `👤 ${session.name}`}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openLogin("participant")}
                  className="text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-full px-4 py-1.5 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openLogin("admin")}
                  className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 transition-colors"
                >
                  Admin
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 pb-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === "leaderboard" && <Leaderboard />}
        {tab === "entries" && <EntriesTab session={session} />}
        {tab === "admin" && session?.type === "admin" && <AdminTab />}
        {tab === "admin" && session?.type !== "admin" && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">Admin access required.</p>
            <button
              onClick={() => openLogin("admin")}
              className="mt-3 text-sm text-green-600 hover:underline"
            >
              Sign in as admin →
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-xs text-gray-400 border-t border-gray-100 mt-4 text-center">
        Guardian Capital 2026 World Cup Pool · Entry fee C$20 · Max 5 entries per participant
      </footer>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
        initialMode={loginMode}
      />
    </div>
  );
}
