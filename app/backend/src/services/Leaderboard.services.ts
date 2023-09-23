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

    parsedData.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.totalPoints < b.totalPoints) return 1;
      if (a.totalVictories > b.totalVictories) return -1;
      if (a.totalVictories < b.totalVictories) return 1;
      if (a.goalsBalance > b.goalsBalance) return -1;
      if (a.goalsBalance < b.goalsBalance) return 1;
      if (a.goalsFavor > b.goalsFavor) return -1;
      if (a.goalsFavor < b.goalsFavor) return 1;
      return 0;
    });

    return { status: 'SUCCESSFUL', data: parsedData };
  }
}

export default LeaderBoardService;
