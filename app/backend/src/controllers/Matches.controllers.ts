import { Request, Response } from 'express';
import MatchService from '../services/Matches.services';
import mapStatus from './utils/mapStatus';

class TeamsController {
  private matchesService = new MatchService();

  async getTeams(_req: Request, res: Response) {
    const { status, data } = await this.matchesService.getAllMatches();
    return res.status(mapStatus(status)).json(data);
  }
}

export default TeamsController;
