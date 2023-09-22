import { ILeaderboard, LeaderboardTeam } from '../../Interfaces/ILeaderboard';
import TeamModel from '../../database/models/TeamModel';

class LeaderBoardUtils implements ILeaderboard {
  public name: string;
  public totalPoints = 0;
  public totalGames = 0;
  public totalVictories = 0;
  public totalDraws = 0;
  public totalLosses = 0;
  public goalsFavor = 0;
  public goalsOwn = 0;
  public goalsBalance = 0;
  public efficiency = '0';

  constructor(matchesData: TeamModel) {
    this.name = matchesData.teamName;
    this.calculateMatchesResults(matchesData);
    this.calculatePoints();
    this.calculateTotalGames();
    this.calculateGoalsBalance();
    this.calculateEfficiency();
  }

  private calculatePoints(): void {
    this.totalPoints = this.totalVictories * 3 + this.totalDraws;
  }

  private calculateTotalGames(): void {
    this.totalGames = this.totalVictories + this.totalDraws + this.totalLosses;
  }

  private calculateMatchesResults(matchesData: LeaderboardTeam): void {
    const team = matchesData.homeMatch ? 'home' : 'away';
    const enemyTeam = matchesData.homeMatch ? 'away' : 'home';
    matchesData[`${team}Match`]?.forEach((match) => {
      if (match[`${team}TeamGoals`] > match[`${enemyTeam}TeamGoals`]) {
        this.totalVictories += 1;
      }
      if (match[`${team}TeamGoals`] === match[`${enemyTeam}TeamGoals`]) {
        this.totalDraws += 1;
      }
      if (match[`${team}TeamGoals`] < match[`${enemyTeam}TeamGoals`]) {
        this.totalLosses += 1;
      }
      this.goalsFavor += match[`${team}TeamGoals`];
      this.goalsOwn += match[`${enemyTeam}TeamGoals`];
    });
  }

  private calculateGoalsBalance(): void {
    this.goalsBalance = this.goalsFavor - this.goalsOwn;
  }

  private calculateEfficiency(): void {
    this.efficiency = ((this.totalPoints / (this.totalGames * 3)) * 100).toFixed(2);
  }
}

export default LeaderBoardUtils;
