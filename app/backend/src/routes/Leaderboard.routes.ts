import * as express from 'express';
import { Request, Response } from 'express';
import LeaderboardController from '../controllers/Leaderboard.controllers';

const LeaderboardRouter = express.Router();

const leaderboardController = new LeaderboardController();

LeaderboardRouter.get('/', (req: Request, res: Response) =>
  leaderboardController.getAllMatchesData(req, res));

LeaderboardRouter.get('/home', (req: Request, res: Response) =>
  leaderboardController.getHomeOrAwayMatchesData(req, res));

LeaderboardRouter.get('/away', (req: Request, res: Response) =>
  leaderboardController.getHomeOrAwayMatchesData(req, res));
export default LeaderboardRouter;
