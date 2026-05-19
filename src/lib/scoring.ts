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
    const myPen = isHome ? match.home_penalty_goals : match.away_penalty_goals;
    const theirPen = isHome ? match.away_penalty_goals : match.home_penalty_goals;

    const scored = myGoals + myPen;
    const conceded = theirGoals + theirPen;

    points += scored;
    points -= conceded;
    goals += scored;

    const hasPenalties = myPen > 0 || theirPen > 0;

    if (myGoals > theirGoals) {
      points += 3;
    } else if (myGoals === theirGoals) {
      if (hasPenalties) {
        if (myPen > theirPen) points += 3;
      } else {
        points += 1;
      }
    }
  }

  const adv = advancements.find((a) => a.team_id === team.id);
  if (adv) {
    if (adv.advanced_to_round_32) points += 2;
    if (adv.advanced_to_round_16) points += 2;
    if (adv.advanced_to_quarters) points += 3;
    if (adv.advanced_to_semis) points += 4;
    if (adv.advanced_to_final) points += 5;
    if (adv.won_world_cup) points += 10;
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
