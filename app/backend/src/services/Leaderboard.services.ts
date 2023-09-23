import { IServiceResponse } from '../Interfaces/IServiceResponse';
import TeamModel from '../database/models/TeamModel';
import LeaderBoardUtils from './utils/LeaderBoardUtils';

class LeaderBoardService {
  private teamModel = TeamModel;

  public async getAllHomeMatchesData(path: string): Promise<IServiceResponse<TeamModel>> {
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
}

export default LeaderBoardService;
