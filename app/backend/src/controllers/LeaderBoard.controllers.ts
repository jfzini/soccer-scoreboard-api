import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.services';
import mapStatus from './utils/mapStatus';

class LeaderboardController {
  private leaderboardService = new LeaderboardService();

  public async getAllMatchesData(_req: Request, res: Response) {
    const { status, data } = await this.leaderboardService.getAllHomeMatchesData();
    return res.status(mapStatus(status)).json(data);
  }

}

export default LeaderboardController;
