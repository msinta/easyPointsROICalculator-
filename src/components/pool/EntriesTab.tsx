import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { NewEntryModal } from "./NewEntryModal";
import type { Entry, Team, UserSession } from "@/lib/types";

interface Props {
  session: UserSession;
}

export function EntriesTab({ session }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("entries")
      .select(`
        id, participant_id, entry_name, created_at,
        participant:participants(id, name),
        teams:entry_teams(team:teams(id, name, flag, level))
      `)
      .order("created_at", { ascending: true });

    const normalized = (data ?? []).map((e: any) => ({
      ...e,
      teams: e.teams?.map((et: any) => et.team).filter(Boolean) ?? [],
    }));

    setEntries(normalized);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const myEntries =
    session?.type === "participant"
      ? entries.filter((e) => e.participant_id === session.id)
      : [];

  const canAdd = session?.type === "participant" && myEntries.length < 5;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Loading entries…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {session?.type === "participant" && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-gray-500">
            Signed in as{" "}
            <span className="font-semibold text-gray-800">{session.name}</span>
            {" · "}
            <span>{myEntries.length}/5 entries used</span>
          </p>
          {canAdd && (
            <Button
              onClick={() => setShowNew(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              + New Entry
            </Button>
          )}
          {!canAdd && myEntries.length >= 5 && (
            <span className="text-xs text-gray-400">Maximum 5 entries reached.</span>
          )}
        </div>
      )}

      {!session && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-800">
          Sign in to submit your own entry (up to 5 entries per participant, C$20 each).
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="font-semibold text-lg">No entries yet</p>
          <p className="text-sm mt-1">Sign in to be the first to submit.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              isOwn={
                session?.type === "participant" &&
                entry.participant_id === session.id
              }
              onEdit={() => setEditEntry(entry)}
            />
          ))}
        </div>
      )}

      {session?.type === "participant" && (
        <NewEntryModal
          open={showNew || !!editEntry}
          onClose={() => { setShowNew(false); setEditEntry(null); }}
          participantId={session.id}
          onSuccess={load}
          existingEntryCount={myEntries.length}
          editEntry={editEntry ?? undefined}
        />
      )}
    </div>
  );
}

function EntryCard({ entry, isOwn, onEdit }: { entry: Entry; isOwn: boolean; onEdit: () => void }) {
  const teams = (entry.teams ?? []) as Team[];
  const byLevel = [1, 2, 3, 4, 5, 6].map((lvl) => ({
    level: lvl,
    teams: teams.filter((t) => t.level === lvl),
  }));

  return (
    <div
      className={`rounded-xl border p-4 space-y-3 shadow-sm transition-shadow hover:shadow-md ${
        isOwn
          ? "border-green-200 bg-green-50"
          : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">
            {entry.entry_name || "Entry"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {(entry.participant as any)?.name ?? "Unknown"}
          </p>
        </div>
        {isOwn && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onEdit}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium"
            >
              Edit
            </button>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Mine
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        {byLevel.map(({ level, teams: lvlTeams }) => (
          <div key={level} className="flex items-start gap-2 text-xs">
            <span className="text-gray-400 w-12 shrink-0 pt-0.5">Lvl {level}</span>
            <div className="flex flex-wrap gap-1">
              {lvlTeams.length > 0 ? (
                lvlTeams.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-gray-700"
                  >
                    {t.flag} {t.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-300 italic">not selected</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
