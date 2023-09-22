import * as express from 'express';
import { Request, Response } from 'express';
import LeaderboardController from '../controllers/LeaderBoard.controllers';

const LeaderboardRouter = express.Router();

const leaderboardController = new LeaderboardController();

LeaderboardRouter.get('/home', (req: Request, res: Response) =>
  leaderboardController.getAllMatchesData(req, res),
);

export default LeaderboardRouter;