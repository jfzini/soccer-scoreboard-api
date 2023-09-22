import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.services';
import mapStatus from './utils/mapStatus';

class LeaderboardController {
  private leaderboardService = new LeaderboardService();

  public async getAllMatchesData(req: Request, res: Response) {
    // mostra o path
    const path = req.route.path.split('/').pop();
    const { status, data } = await this.leaderboardService.getAllHomeMatchesData(path);
    return res.status(mapStatus(status)).json(data);
  }
}

export default LeaderboardController;
