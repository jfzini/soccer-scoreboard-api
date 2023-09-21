import { IServiceResponse } from '../Interfaces/IServiceResponse';
import TeamModel from '../database/models/TeamModel';

class TeamsService {
  private teamModel = TeamModel;

  public async getAllTeams(): Promise<IServiceResponse<TeamModel>> {
    const data = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data };
  }
}

export default TeamsService;
