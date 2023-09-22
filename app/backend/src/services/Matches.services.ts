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

  public async getMatchesByProgress(inProgress: boolean): Promise<IServiceResponse<MatchModel>> {
    const data = await this.matchModel.findAll({
      where: { inProgress },
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

  public async endMatch(matchId: number): Promise<IServiceResponse<MatchModel>> {
    const [insert] = await this.matchModel.update(
      { inProgress: false },
      { where: { id: matchId } },
    );
    if (!insert) {
      return { status: 'BAD_REQUEST', data: { message: 'No matches found' } };
    }

    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  public async updateMatchGoals(
    matchId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<IServiceResponse<MatchModel>> {
    const [insert] = await this.matchModel.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id: matchId, inProgress: true } },
    );
    if (!insert) {
      return {
        status: 'BAD_REQUEST',
        data: { message: 'No matches found, it is already finished or the results are the same' },
      };
    }

    return { status: 'SUCCESSFUL', data: { message: 'Match goals were updated!' } };
  }
}

export default MatchesService;
