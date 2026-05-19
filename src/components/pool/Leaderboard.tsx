import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { scoreEntry } from "@/lib/scoring";
import type { Entry, Match, TeamAdvancement } from "@/lib/types";

interface ScoredEntry {
  entry: Entry;
  points: number;
  goals: number;
  rank: number;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [advancements, setAdvancements] = useState<TeamAdvancement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: e }, { data: m }, { data: a }] = await Promise.all([
        supabase.from("entries").select(`
          id, participant_id, entry_name, created_at,
          participant:participants(id, name),
          teams:entry_teams(team:teams(id, name, flag, level))
        `),
        supabase.from("matches").select("*").eq("is_completed", true),
        supabase.from("team_advancement").select("*"),
      ]);

      const normalized = (e ?? []).map((entry: any) => ({
        ...entry,
        teams: entry.teams?.map((et: any) => et.team).filter(Boolean) ?? [],
      }));

      setEntries(normalized);
      setMatches((m ?? []) as Match[]);
      setAdvancements(a ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const scored: ScoredEntry[] = entries
    .map((entry) => {
      const { points, goals } = scoreEntry(
        (entry.teams ?? []) as any,
        matches,
        advancements
      );
      return { entry, points, goals, rank: 0 };
    })
    .sort((a, b) => b.points - a.points || b.goals - a.goals)
    .map((s, i, arr) => {
      let rank = i + 1;
      if (i > 0 && arr[i - 1].points === s.points && arr[i - 1].goals === s.goals) {
        rank = arr[i - 1].rank;
      }
      return { ...s, rank };
    });

  const totalPool = entries.length * 20;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Loading standings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.length > 0 && (
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl p-5">
          <p className="text-sm font-medium opacity-80 mb-3">
            Prize Pool — {entries.length} {entries.length === 1 ? "entry" : "entries"} · C${totalPool}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "🥇 1st Place", pct: 0.6 },
              { label: "🥈 2nd Place", pct: 0.3 },
              { label: "🥉 3rd Place", pct: 0.1 },
            ].map((p) => (
              <div key={p.label} className="text-center bg-white/10 rounded-lg py-3 px-1">
                <div className="text-lg font-bold">C${Math.round(totalPool * p.pct)}</div>
                <div className="text-xs opacity-70 mt-0.5">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {scored.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">⚽</div>
          <p className="font-semibold text-lg">No entries yet</p>
          <p className="text-sm mt-1">Participants can sign in and submit their picks.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left w-16">Rank</th>
                <th className="px-4 py-3 text-left">Entry</th>
                <th className="px-4 py-3 text-left">Participant</th>
                <th className="px-4 py-3 text-right">Pts</th>
                <th className="px-4 py-3 text-right">Goals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scored.map(({ entry, points, goals, rank }) => (
                <tr
                  key={entry.id}
                  className={
                    rank === 1
                      ? "bg-amber-50"
                      : rank === 2
                      ? "bg-slate-50"
                      : rank === 3
                      ? "bg-orange-50"
                      : "bg-white"
                  }
                >
                  <td className="px-4 py-3 font-bold text-base">
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {entry.entry_name || "Entry"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {(entry.participant as any)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-green-700 text-base">
                    {points}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400">{goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-5 text-sm">
        <p className="font-semibold text-gray-800 mb-3">📋 Scoring Rules</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-gray-600">
          {[
            ["Win", "+3"],
            ["Draw", "+1"],
            ["Goal scored (incl. penalties)", "+1"],
            ["Goal conceded (incl. penalties)", "−1"],
            ["Advance to Round of 32", "+2"],
            ["Advance to Round of 16", "+2"],
            ["Advance to Quarter-Finals", "+3"],
            ["Advance to Semi-Finals", "+4"],
            ["Advance to the Final", "+5"],
            ["Win the World Cup", "+10"],
          ].map(([label, pts]) => (
            <div key={label} className="flex justify-between col-span-1">
              <span>{label}</span>
              <span
                className={`font-semibold ${pts.startsWith("−") ? "text-red-500" : "text-green-700"}`}
              >
                {pts}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Tiebreaker: most goals scored by selected teams. If still tied, winnings are split equally.
          Prize split: 60% / 30% / 10%.
        </p>
      </div>
    </div>
  );
}
