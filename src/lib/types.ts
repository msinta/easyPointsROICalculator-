export interface Team {
  id: string;
  name: string;
  flag: string;
  level: number;
}

export interface Participant {
  id: string;
  name: string;
  access_code: string;
}

export interface Entry {
  id: string;
  participant_id: string;
  entry_name: string;
  created_at: string;
  participant?: Participant;
  teams?: Team[];
}

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  stage: "group" | "round_of_32" | "round_of_16" | "quarter_final" | "semi_final" | "final";
  home_goals: number | null;
  away_goals: number | null;
  home_penalty_goals: number;
  away_penalty_goals: number;
  is_completed: boolean;
  match_date: string | null;
  home_team?: Team;
  away_team?: Team;
}

export interface TeamAdvancement {
  team_id: string;
  finished_second_in_group: boolean;
  finished_first_in_group: boolean;
  advanced_to_round_32: boolean;
  advanced_to_round_16: boolean;
  advanced_to_quarters: boolean;
  advanced_to_semis: boolean;
  advanced_to_final: boolean;
  won_world_cup: boolean;
}

export interface EntryScore {
  entry: Entry;
  points: number;
  goals: number;
  rank: number;
}

export type UserSession =
  | { type: "admin" }
  | { type: "participant"; id: string; name: string }
  | null;

export const STAGE_LABELS: Record<Match["stage"], string> = {
  group: "Group Stage",
  round_of_32: "Round of 32",
  round_of_16: "Round of 16",
  quarter_final: "Quarter-Final",
  semi_final: "Semi-Final",
  final: "Final",
};
