class LeaderBoardUtils {
  public name: string;
  public totalPoints: number = 0;
  public totalGames: number = 0;
  public totalVictories: number = 0;
  public totalDraws: number = 0;
  public totalLosses: number = 0;
  public goalsFavor: number = 0;
  public goalsOwn: number = 0;

  constructor(matchesData: any) {
    this.name = matchesData.teamName;
    this.calculateMatchesResults(matchesData);
    this.calculatePoints();
    this.calculateTotalGames();
  }

  private calculatePoints(): void {
    this.totalPoints = this.totalVictories * 3 + this.totalDraws;
  }

  private calculateTotalGames(): void {
    this.totalGames = this.totalVictories + this.totalDraws + this.totalLosses;
  }

  private calculateMatchesResults(matchesData: any): void {
    let victories = 0;
    let draws = 0;
    let losses = 0;
    let goalsFavor = 0;
    let goalsOwn = 0;
    let team = matchesData.homeMatch ? 'home' : 'away';
    let enemyTeam = matchesData.homeMatch ? 'away' : 'home';
    matchesData[`${team}Match`].forEach((match: any) => {
      if(match[`${team}TeamGoals`] > match[`${enemyTeam}TeamGoals`]) {
        victories++;
      }
      if(match[`${team}TeamGoals`] === match[`${enemyTeam}TeamGoals`]) {
        draws++;
      }
      if(match[`${team}TeamGoals`] < match[`${enemyTeam}TeamGoals`]) {
        losses++;
      }
      goalsFavor += match[`${team}TeamGoals`];
      goalsOwn += match[`${enemyTeam}TeamGoals`];
    });
    this.totalVictories = victories;
    this.totalDraws = draws;
    this.totalLosses = losses;
    this.goalsFavor = goalsFavor;
    this.goalsOwn = goalsOwn;
  }

  // public getAll() {
  //   return {
  //     name: this.name,
  //     totalPoints: this.totalPoints,
  //     totalGames: this.totalGames,
  //     totalVictories: this.totalVictories,
  //     totalDraws: this.totalDraws,
  //     totalLosses: this.totalLosses,
  //     goalsFavor: this.goalsFavor,
  //     goalsOwn: this.goalsOwn,
  //   }
  // }
}

export default LeaderBoardUtils;