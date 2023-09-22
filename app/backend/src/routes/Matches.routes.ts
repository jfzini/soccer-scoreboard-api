import * as express from 'express';
import { Request, Response } from 'express';
import MatchController from '../controllers/Matches.controllers';
import validateToken from '../middlewares/token.middlewares';

const MatchesRouter = express.Router();

const matchesController = new MatchController();

MatchesRouter.get('/', (req: Request, res: Response) => matchesController.getMaches(req, res));

MatchesRouter.patch('/:matchId/finish', validateToken, (req: Request, res: Response) =>
  matchesController.endMatch(req, res));

export default MatchesRouter;
