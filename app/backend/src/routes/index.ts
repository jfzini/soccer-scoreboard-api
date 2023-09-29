import { Router } from 'express';
import LoginRouter from './Login.routes';
import MatchesRouter from './Matches.routes';
import TeamsRouter from './Teams.routes';
import LeaderboardRouter from './Leaderboard.routes';

const router = Router();

router.use('/login', LoginRouter);
router.use('/matches', MatchesRouter);
router.use('/teams', TeamsRouter);
router.use('/leaderboard', LeaderboardRouter);

export default router;