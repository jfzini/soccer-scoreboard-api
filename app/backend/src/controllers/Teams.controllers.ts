import { Request, Response } from 'express';
import TeamsService from '../services/Teams.services';
import mapStatus from './utils/mapStatus';

class TeamsController {
  private teamsService: TeamsService = new TeamsService();

  async getTeams(_req: Request, res: Response) {
    const { status, data } = await this.teamsService.getAllTeams();
    return res.status(mapStatus(status)).json(data);
  }
}

export default TeamsController;
