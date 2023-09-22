import { IServiceResponse } from '../Interfaces/IServiceResponse';
import MatchModel from '../database/models/MatchModel';

class MatchesService {
  private matchModel = MatchModel;

  public async getAllMatches(): Promise<IServiceResponse<MatchModel>> {
    const data = await this.matchModel.findAll({
      include: [
        {
          association: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          association: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });

    return { status: 'SUCCESSFUL', data };
  }
}

export default MatchesService;
