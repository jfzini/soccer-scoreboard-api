import { IServiceResponse } from '../Interfaces/IServiceResponse';
import TeamModel from '../database/models/TeamModel';

class TeamsService {
  private teamModel = TeamModel;

  public async getAllTeams(): Promise<IServiceResponse<TeamModel>> {
    const data = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data };
  }

  public async getTeamById(id: number): Promise<IServiceResponse<TeamModel>> {
    const data = await this.teamModel.findByPk(id);
    if (!data) return { status: 'NOT_FOUND', data: { message: 'No team was found' } };
    return { status: 'SUCCESSFUL', data };
  }
}

export default TeamsService;
