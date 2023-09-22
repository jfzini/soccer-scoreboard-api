import { IServiceResponse } from '../Interfaces/IServiceResponse';
import TeamModel from '../database/models/TeamModel';
import LeaderBoardUtils from './utils/LeaderBoardUtils';

class LeaderBoardService {
  private teamModel = TeamModel;

  // LEMBRAR DE DEIXAR A FUNÇÃO DINAMICA RECEBENDO HOME OU AWAY COMO PARAMETRO
  public async getAllHomeMatchesData(): Promise<IServiceResponse<TeamModel>> {
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

    const parsedData = rawData.map((team) => new LeaderBoardUtils(team.toJSON()));

    return { status: 'SUCCESSFUL', data: parsedData };
  }
}

export default LeaderBoardService;
