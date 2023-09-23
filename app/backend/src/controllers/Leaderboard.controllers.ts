import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.services';
import mapStatus from './utils/mapStatus';

class LeaderboardController {
  private leaderboardService = new LeaderboardService();

  public async getHomeOrAwayMatchesData(req: Request, res: Response) {
    const path = req.route.path.split('/').pop();
    const { status, data } = await this.leaderboardService.getHomeOrAwayMatchesData(path);
    return res.status(mapStatus(status)).json(data);
  }

  public async getAllMatchesData(req: Request, res: Response) {
    const { status, data } = await this.leaderboardService.getAllMatchesData();
    return res.status(mapStatus(status)).json(data);
  }
}

export default LeaderboardController;
