import * as express from 'express';
import MatchController from '../controllers/Matches.controllers';

const MatchesRouter = express.Router();

const matchesController = new MatchController();

MatchesRouter.get('/', (req: express.Request, res: express.Response) =>
  matchesController.getMaches(req, res));

export default MatchesRouter;
