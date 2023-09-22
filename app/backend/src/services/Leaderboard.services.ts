import { IServiceResponse } from '../Interfaces/IServiceResponse';
import TeamModel from '../database/models/TeamModel';
import LeaderBoardUtils from './utils/LeaderBoardUtils';

class LeaderBoardService {
  private teamModel = TeamModel;

  public async getAllHomeMatchesData(): Promise<any> {
    const rawData = await this.teamModel.findAll({
      include: [
        {
          association: 'homeMatch',
          where: {
            inProgress: false,
          },
        },
      ],
    });

    const teste = new LeaderBoardUtils(rawData[0].toJSON());

    return { status: 'SUCCESSFUL', data: teste };
  }
}

export default LeaderBoardService;
