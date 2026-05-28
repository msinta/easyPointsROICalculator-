import type { Team, Match, TeamAdvancement } from "./types";

export function scoreTeam(
  team: Team,
  matches: Match[],
  advancements: TeamAdvancement[]
): { points: number; goals: number } {
  let points = 0;
  let goals = 0;

  for (const match of matches) {
    if (!match.is_completed) continue;
    const isHome = match.home_team_id === team.id;
    const isAway = match.away_team_id === team.id;
    if (!isHome && !isAway) continue;

    const myGoals = (isHome ? match.home_goals : match.away_goals) ?? 0;
    const theirGoals = (isHome ? match.away_goals : match.home_goals) ?? 0;

    // Goals tracked only as tiebreaker — they do NOT add points
    goals += myGoals;

    if (myGoals > theirGoals) {
      points += 2; // Win
    } else if (myGoals === theirGoals) {
      points += 1; // Draw
    }
    // Loss: 0
  }

  const adv = advancements.find((a) => a.team_id === team.id);
  if (adv) {
    if (adv.finished_second_in_group) points += 4;
    if (adv.finished_first_in_group) points += 6;
    if (adv.advanced_to_round_32) points += 3;
    if (adv.advanced_to_round_16) points += 8;
    if (adv.advanced_to_quarters) points += 10;
    if (adv.advanced_to_semis) points += 12;
    if (adv.advanced_to_final) points += 15;
    if (adv.won_world_cup) points += 25;
  }

  return { points, goals };
}

export function scoreEntry(
  entryTeams: Team[],
  matches: Match[],
  advancements: TeamAdvancement[]
): { points: number; goals: number } {
  let totalPoints = 0;
  let totalGoals = 0;
  for (const team of entryTeams) {
    const { points, goals } = scoreTeam(team, matches, advancements);
    totalPoints += points;
    totalGoals += goals;
  }
  return { points: totalPoints, goals: totalGoals };
}
