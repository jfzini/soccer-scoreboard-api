import { Request, Response } from 'express';
import MatchService from '../services/Matches.services';
import TeamsService from '../services/Teams.services';
import mapStatus from './utils/mapStatus';

class MatchesController {
  private matchesService = new MatchService();
  private teamService = new TeamsService();

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

  public async createMatch(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    const foundTeamA = await this.teamService.getTeamById(parseInt(homeTeamId, 10));
    const foundTeamB = await this.teamService.getTeamById(parseInt(awayTeamId, 10));
    const foundTeams = [foundTeamA, foundTeamB];
    const invalidTeam = foundTeams.some((team) => team.status !== 'SUCCESSFUL');
    if (invalidTeam) return res.status(404).json({ message: 'There is no team with such id!' });

    const { status, data } = await this.matchesService.createMatch(
      parseInt(homeTeamId, 10),
      parseInt(awayTeamId, 10),
      parseInt(homeTeamGoals, 10),
      parseInt(awayTeamGoals, 10),
    );
    return res.status(mapStatus(status)).json(data);
  }
}

export default MatchesController;
