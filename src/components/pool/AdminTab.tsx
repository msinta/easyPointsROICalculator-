import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Team, Participant, Match, TeamAdvancement } from "@/lib/types";
import { STAGE_LABELS } from "@/lib/types";

type SubTab = "participants" | "matches" | "advancement" | "teams";

export function AdminTab() {
  const [subTab, setSubTab] = useState<SubTab>("participants");

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {(["participants", "matches", "advancement", "teams"] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              subTab === t
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {subTab === "participants" && <ParticipantsAdmin />}
      {subTab === "matches" && <MatchesAdmin />}
      {subTab === "advancement" && <AdvancementAdmin />}
      {subTab === "teams" && <TeamsAdmin />}
    </div>
  );
}

// ─── Participants ────────────────────────────────────────────────────────────

function ParticipantsAdmin() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("participants")
      .select("*")
      .order("created_at");
    setParticipants(data ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addParticipant(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const { error: err } = await supabase
      .from("participants")
      .insert({ name: name.trim(), access_code: code.trim() });
    if (err) {
      setError(err.message.includes("unique") ? "That name is already taken." : err.message);
    } else {
      setName("");
      setCode("");
      await load();
    }
    setSaving(false);
  }

  async function deleteParticipant(id: string) {
    if (!confirm("Delete this participant and all their entries?")) return;
    await supabase.from("participants").delete().eq("id", id);
    await load();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={addParticipant} className="bg-gray-50 rounded-xl p-4 space-y-3">
        <p className="font-semibold text-sm text-gray-700">Add Participant</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Access Code</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 1234"
              required
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
          {saving ? "Adding…" : "Add Participant"}
        </Button>
      </form>

      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Access Code</th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {participants.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  No participants yet.
                </td>
              </tr>
            )}
            {participants.map((p) => (
              <tr key={p.id} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 font-mono text-gray-500">{p.access_code}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deleteParticipant(p.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Matches ─────────────────────────────────────────────────────────────────

function MatchesAdmin() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [homeId, setHomeId] = useState("");
  const [awayId, setAwayId] = useState("");
  const [stage, setStage] = useState<Match["stage"]>("group");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [scoreForm, setScoreForm] = useState({
    home_goals: "", away_goals: "",
    home_penalty_goals: "0", away_penalty_goals: "0",
    hasPenalties: false,
  });

  const load = useCallback(async () => {
    const [{ data: t }, { data: m }] = await Promise.all([
      supabase.from("teams").select("*").order("level").order("name"),
      supabase
        .from("matches")
        .select(`*, home_team:teams!matches_home_team_id_fkey(id,name,flag), away_team:teams!matches_away_team_id_fkey(id,name,flag)`)
        .order("created_at", { ascending: false }),
    ]);
    setTeams(t ?? []);
    setMatches((m ?? []) as Match[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addMatch(e: React.FormEvent) {
    e.preventDefault();
    if (homeId === awayId) return;
    setSaving(true);
    await supabase.from("matches").insert({
      home_team_id: homeId,
      away_team_id: awayId,
      stage,
    });
    setHomeId("");
    setAwayId("");
    await load();
    setSaving(false);
  }

  async function saveScore(matchId: string) {
    const hg = parseInt(scoreForm.home_goals);
    const ag = parseInt(scoreForm.away_goals);
    const hp = scoreForm.hasPenalties ? parseInt(scoreForm.home_penalty_goals) : 0;
    const ap = scoreForm.hasPenalties ? parseInt(scoreForm.away_penalty_goals) : 0;
    if (isNaN(hg) || isNaN(ag)) return;

    await supabase.from("matches").update({
      home_goals: hg,
      away_goals: ag,
      home_penalty_goals: hp,
      away_penalty_goals: ap,
      is_completed: true,
    }).eq("id", matchId);

    setEditingId(null);
    await load();
  }

  async function deleteMatch(id: string) {
    if (!confirm("Remove this match?")) return;
    await supabase.from("matches").delete().eq("id", id);
    await load();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={addMatch} className="bg-gray-50 rounded-xl p-4 space-y-3">
        <p className="font-semibold text-sm text-gray-700">Add Match</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Home Team</Label>
            <select
              value={homeId}
              onChange={(e) => setHomeId(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="">Select…</option>
              {[1,2,3,4,5,6].map((lvl) => (
                <optgroup key={lvl} label={`Level ${lvl}`}>
                  {teams.filter((t) => t.level === lvl).map((t) => (
                    <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Away Team</Label>
            <select
              value={awayId}
              onChange={(e) => setAwayId(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="">Select…</option>
              {[1,2,3,4,5,6].map((lvl) => (
                <optgroup key={lvl} label={`Level ${lvl}`}>
                  {teams.filter((t) => t.level === lvl).map((t) => (
                    <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Stage</Label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Match["stage"])}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
            >
              {(Object.entries(STAGE_LABELS) as [Match["stage"], string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <Button type="submit" disabled={saving || !homeId || !awayId || homeId === awayId} className="bg-green-600 hover:bg-green-700 text-white">
          {saving ? "Adding…" : "Add Match"}
        </Button>
      </form>

      <div className="space-y-2">
        {matches.length === 0 && (
          <p className="text-center py-6 text-gray-400 text-sm">No matches added yet.</p>
        )}
        {matches.map((match) => {
          const home = match.home_team as any;
          const away = match.away_team as any;
          const isEditing = editingId === match.id;

          return (
            <div key={match.id} className="border border-gray-100 rounded-xl p-4 bg-white space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <span>{home?.flag} {home?.name}</span>
                  <span className="text-gray-400">vs</span>
                  <span>{away?.flag} {away?.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {STAGE_LABELS[match.stage]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {match.is_completed ? (
                    <span className="text-sm font-bold text-green-700">
                      {match.home_goals}–{match.away_goals}
                      {(match.home_penalty_goals > 0 || match.away_penalty_goals > 0) &&
                        ` (${match.home_penalty_goals}–${match.away_penalty_goals} pens)`}
                      {" "}✓
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Pending</span>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(isEditing ? null : match.id);
                      setScoreForm({
                        home_goals: match.home_goals?.toString() ?? "",
                        away_goals: match.away_goals?.toString() ?? "",
                        home_penalty_goals: match.home_penalty_goals?.toString() ?? "0",
                        away_penalty_goals: match.away_penalty_goals?.toString() ?? "0",
                        hasPenalties: (match.home_penalty_goals ?? 0) > 0 || (match.away_penalty_goals ?? 0) > 0,
                      });
                    }}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    {isEditing ? "Cancel" : "Edit Score"}
                  </button>
                  <button
                    onClick={() => deleteMatch(match.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">{home?.name} Goals</Label>
                      <Input
                        type="number"
                        min="0"
                        value={scoreForm.home_goals}
                        onChange={(e) => setScoreForm({ ...scoreForm, home_goals: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{away?.name} Goals</Label>
                      <Input
                        type="number"
                        min="0"
                        value={scoreForm.away_goals}
                        onChange={(e) => setScoreForm({ ...scoreForm, away_goals: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scoreForm.hasPenalties}
                      onChange={(e) => setScoreForm({ ...scoreForm, hasPenalties: e.target.checked })}
                      className="rounded"
                    />
                    Penalty shootout
                  </label>

                  {scoreForm.hasPenalties && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">{home?.name} Penalties</Label>
                        <Input
                          type="number"
                          min="0"
                          value={scoreForm.home_penalty_goals}
                          onChange={(e) => setScoreForm({ ...scoreForm, home_penalty_goals: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{away?.name} Penalties</Label>
                        <Input
                          type="number"
                          min="0"
                          value={scoreForm.away_penalty_goals}
                          onChange={(e) => setScoreForm({ ...scoreForm, away_penalty_goals: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => saveScore(match.id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    Save Score &amp; Mark Complete
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Advancement ─────────────────────────────────────────────────────────────

const ADV_STAGES: { key: keyof Omit<TeamAdvancement, "team_id">; label: string }[] = [
  { key: "advanced_to_round_32", label: "R32" },
  { key: "advanced_to_round_16", label: "R16" },
  { key: "advanced_to_quarters", label: "QF" },
  { key: "advanced_to_semis", label: "SF" },
  { key: "advanced_to_final", label: "Final" },
  { key: "won_world_cup", label: "🏆" },
];

function AdvancementAdmin() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [advancements, setAdvancements] = useState<Record<string, TeamAdvancement>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [{ data: t }, { data: a }] = await Promise.all([
        supabase.from("teams").select("*").order("level").order("name"),
        supabase.from("team_advancement").select("*"),
      ]);
      setTeams(t ?? []);
      const map: Record<string, TeamAdvancement> = {};
      (a ?? []).forEach((row: TeamAdvancement) => { map[row.team_id] = row; });
      setAdvancements(map);
    }
    load();
  }, []);

  async function toggle(team: Team, key: keyof Omit<TeamAdvancement, "team_id">) {
    setSaving(team.id + key);
    const existing = advancements[team.id];
    const newVal = !existing?.[key];
    const updated = {
      team_id: team.id,
      advanced_to_round_32: existing?.advanced_to_round_32 ?? false,
      advanced_to_round_16: existing?.advanced_to_round_16 ?? false,
      advanced_to_quarters: existing?.advanced_to_quarters ?? false,
      advanced_to_semis: existing?.advanced_to_semis ?? false,
      advanced_to_final: existing?.advanced_to_final ?? false,
      won_world_cup: existing?.won_world_cup ?? false,
      [key]: newVal,
    };

    await supabase.from("team_advancement").upsert(updated, { onConflict: "team_id" });
    setAdvancements((prev) => ({ ...prev, [team.id]: updated }));
    setSaving(null);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        Toggle which stages each team has advanced to. Points are awarded automatically.
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Team</th>
              {ADV_STAGES.map((s) => (
                <th key={s.key} className="px-3 py-3 text-center">{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[1,2,3,4,5,6].map((lvl) => (
              teams.filter((t) => t.level === lvl).map((team) => {
                const adv = advancements[team.id];
                return (
                  <tr key={team.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium">
                      <span className="mr-1.5">{team.flag}</span>
                      {team.name}
                      <span className="text-xs text-gray-400 ml-1.5">L{team.level}</span>
                    </td>
                    {ADV_STAGES.map((s) => {
                      const checked = adv?.[s.key] ?? false;
                      const isSaving = saving === team.id + s.key;
                      return (
                        <td key={s.key} className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => toggle(team, s.key)}
                            disabled={!!isSaving}
                            className={`w-6 h-6 rounded border-2 transition-all text-xs flex items-center justify-center mx-auto ${
                              checked
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                          >
                            {checked ? "✓" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Teams ───────────────────────────────────────────────────────────────────

function TeamsAdmin() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("teams").select("*").order("level").order("name").then(({ data }) => {
      setTeams(data ?? []);
    });
  }, []);

  async function updateLevel(team: Team, level: number) {
    setSaving(team.id);
    await supabase.from("teams").update({ level }).eq("id", team.id);
    setTeams((prev) => prev.map((t) => (t.id === team.id ? { ...t, level } : t)));
    setSaving(null);
  }

  async function updateName(team: Team, name: string) {
    setSaving(team.id + "n");
    await supabase.from("teams").update({ name }).eq("id", team.id);
    setTeams((prev) => prev.map((t) => (t.id === team.id ? { ...t, name } : t)));
    setSaving(null);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        Adjust team names and levels. Changes save automatically.
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Flag</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left w-32">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {teams.map((team) => (
              <tr key={team.id} className="bg-white">
                <td className="px-4 py-2 text-xl">{team.flag}</td>
                <td className="px-4 py-2">
                  <input
                    className="border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-green-400 rounded px-1 w-full"
                    defaultValue={team.name}
                    onBlur={(e) => {
                      if (e.target.value.trim() !== team.name) {
                        updateName(team, e.target.value.trim());
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={team.level}
                    onChange={(e) => updateLevel(team, parseInt(e.target.value))}
                    className="border border-gray-200 rounded px-2 py-1 text-sm bg-white"
                    disabled={saving === team.id}
                  >
                    {[1,2,3,4,5,6].map((l) => (
                      <option key={l} value={l}>Level {l}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
