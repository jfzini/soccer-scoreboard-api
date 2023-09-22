import { Request, Response } from 'express';
import MatchService from '../services/Matches.services';
import mapStatus from './utils/mapStatus';

class MatchesController {
  private matchesService = new MatchService();

  public async getMaches(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress) return this.getMatchesByProgress(req, res);
    const { status, data } = await this.matchesService.getAllMatches();
    return res.status(mapStatus(status)).json(data);
  }

  public async getMatchesByProgress(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress !== 'true' && inProgress !== 'false') {
      return res.status(400).json({ message: 'Invalid query parameter' });
    }
    const parsedInProgress = JSON.parse(inProgress as string);
    const { status, data } = await this.matchesService.getMatchesByProgress(parsedInProgress);
    return res.status(mapStatus(status)).json(data);
  }

  public async endMatch(req: Request, res: Response) {
    const { matchId } = req.params;
    const { status, data } = await this.matchesService.endMatch(parseInt(matchId, 10));
    return res.status(mapStatus(status)).json(data);
  }

  public async updateMatchGoals(req: Request, res: Response) {
    const { matchId } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const { status, data } = await this.matchesService.updateMatchGoals(
      parseInt(matchId, 10),
      parseInt(homeTeamGoals, 10),
      parseInt(awayTeamGoals, 10),
    );
    return res.status(mapStatus(status)).json(data);
  }
}

export default MatchesController;
