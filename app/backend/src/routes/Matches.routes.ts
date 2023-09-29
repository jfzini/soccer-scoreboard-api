import * as express from 'express';
import { Request, Response } from 'express';
import MatchController from '../controllers/Matches.controllers';
import tokenMiddleware from '../middlewares/token.middlewares';
import middlewares from '../middlewares/match.middlewares';

const MatchesRouter = express.Router();

const matchesController = new MatchController();

MatchesRouter.get('/', (req: Request, res: Response) => matchesController.getMaches(req, res));

MatchesRouter.patch(
  '/:matchId/finish',
  tokenMiddleware,
  (req: Request, res: Response) => matchesController.endMatch(req, res),
);

MatchesRouter.patch(
  '/:matchId',
  tokenMiddleware,
  middlewares.validateUpdateGoalsFields,
  (req: Request, res: Response) => matchesController.updateMatchGoals(req, res),
);

MatchesRouter.post(
  '/',
  tokenMiddleware,
  middlewares.validateCreateMatchFields,
  middlewares.validateUpdateGoalsFields,
  (req: Request, res: Response) => matchesController.createMatch(req, res),
);

export default MatchesRouter;
