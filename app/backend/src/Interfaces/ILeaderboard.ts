export interface ILeaderboard {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: string;
}

type Match = {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  inProgress: boolean;
};

export type LeaderboardTeam = {
  id: number;
  teamName: string;
  homeMatch?: Match[];
  awayMatch?: Match[];
};
