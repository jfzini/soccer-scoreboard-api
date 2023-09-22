import * as express from 'express';
import MatchController from '../controllers/Matches.controllers';

const MatchesRouter = express.Router();

const matchesController = new MatchController();

MatchesRouter.get('/', (req: express.Request, res: express.Response) =>
  matchesController.getTeams(req, res));

export default MatchesRouter;
