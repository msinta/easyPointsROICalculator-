import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import type { Team } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  participantId: string;
  onSuccess: () => void;
  existingEntryCount: number;
}

type LevelSelections = Record<number, string[]>;

export function NewEntryModal({
  open,
  onClose,
  participantId,
  onSuccess,
  existingEntryCount,
}: Props) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [entryName, setEntryName] = useState("");
  const [selected, setSelected] = useState<LevelSelections>({
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    supabase
      .from("teams")
      .select("*")
      .order("level")
      .order("name")
      .then(({ data }) => setTeams(data ?? []));
    setSelected({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
    setEntryName("");
    setError("");
  }, [open]);

  function toggleTeam(team: Team) {
    const lvl = selected[team.level] ?? [];
    if (lvl.includes(team.id)) {
      setSelected({ ...selected, [team.level]: lvl.filter((id) => id !== team.id) });
    } else if (lvl.length < 2) {
      setSelected({ ...selected, [team.level]: [...lvl, team.id] });
    }
  }

  const allSelected = [1, 2, 3, 4, 5, 6].every((l) => (selected[l] ?? []).length === 2);
  const totalSelected = Object.values(selected).flat().length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allSelected) {
      setError("Select exactly 2 teams from each of the 6 levels.");
      return;
    }
    setLoading(true);
    setError("");

    const name = entryName.trim() || `Entry ${existingEntryCount + 1}`;

    const { data: entry, error: entryErr } = await supabase
      .from("entries")
      .insert({ participant_id: participantId, entry_name: name })
      .select("id")
      .single();

    if (entryErr || !entry) {
      setError("Failed to create entry. Please try again.");
      setLoading(false);
      return;
    }

    const rows = Object.values(selected)
      .flat()
      .map((team_id) => ({ entry_id: entry.id, team_id }));

    const { error: teamsErr } = await supabase.from("entry_teams").insert(rows);
    if (teamsErr) {
      setError("Failed to save team selections. Please try again.");
      setLoading(false);
      return;
    }

    onSuccess();
    onClose();
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Entry — Pick Your 12 Teams</DialogTitle>
          <p className="text-sm text-gray-500">
            Choose exactly 2 teams from each level ({totalSelected}/12 selected).
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div>
            <Label>Entry Name (optional)</Label>
            <Input
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
              placeholder={`Entry ${existingEntryCount + 1}`}
              className="mt-1.5"
            />
          </div>

          {[1, 2, 3, 4, 5, 6].map((level) => {
            const lvlTeams = teams.filter((t) => t.level === level);
            const sel = selected[level] ?? [];
            return (
              <div key={level}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm text-gray-700">
                    Level {level}
                    <span className="text-xs font-normal text-gray-400 ml-2">
                      (stronger teams at lower levels)
                    </span>
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      sel.length === 2
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {sel.length}/2
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lvlTeams.map((team) => {
                    const isSel = sel.includes(team.id);
                    const isDisabled = !isSel && sel.length >= 2;
                    return (
                      <button
                        key={team.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggleTeam(team)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                          isSel
                            ? "bg-green-600 text-white border-green-600 shadow-sm"
                            : isDisabled
                            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                            : "bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50"
                        }`}
                      >
                        <span>{team.flag}</span>
                        <span>{team.name}</span>
                        {isSel && <span className="ml-0.5">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={loading || !allSelected}
          >
            {loading
              ? "Submitting…"
              : allSelected
              ? "Submit Entry ✓"
              : `Select ${12 - totalSelected} more team${12 - totalSelected !== 1 ? "s" : ""}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
