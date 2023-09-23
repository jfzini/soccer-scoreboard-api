import { IServiceResponse } from '../Interfaces/IServiceResponse';
import TeamModel from '../database/models/TeamModel';
import LeaderBoardUtils from './utils/LeaderBoardUtils';

class LeaderBoardService {
  private teamModel = TeamModel;

  public async getHomeOrAwayMatchesData(path: string): Promise<IServiceResponse<TeamModel>> {
    const rawData = await this.teamModel.findAll({
      include: [{ association: `${path}Match`, where: { inProgress: false } }],
    });

    const parsedData = rawData.map((team) => new LeaderBoardUtils(team.toJSON()));

    parsedData
      .sort((a, b) => b.goalsFavor - a.goalsFavor)
      .sort((a, b) => b.goalsBalance - a.goalsBalance)
      .sort((a, b) => b.totalVictories - a.totalVictories)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return { status: 'SUCCESSFUL', data: parsedData };
  }

  public async getAllMatchesData(): Promise<IServiceResponse<TeamModel>> {
    const { data: homeData } = await this.getHomeOrAwayMatchesData('home');
    const { data: awayData } = await this.getHomeOrAwayMatchesData('away');

    const allMatchesData = (homeData as LeaderBoardUtils[]).map((team) =>
      LeaderBoardUtils.mapMatchesData(awayData as LeaderBoardUtils[], team)) as LeaderBoardUtils[];

    allMatchesData
      .sort((a, b) => b.goalsFavor - a.goalsFavor)
      .sort((a, b) => b.goalsBalance - a.goalsBalance)
      .sort((a, b) => b.totalVictories - a.totalVictories)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return { status: 'SUCCESSFUL', data: allMatchesData };
  }
}

export default LeaderBoardService;
