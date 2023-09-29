import { NextFunction, Request, Response } from 'express';

class MatchMiddlewares {
  public static validateUpdateGoalsFields(req: Request, res: Response, next: NextFunction) {
    const { homeTeamGoals, awayTeamGoals } = req.body;
    if (homeTeamGoals === undefined || awayTeamGoals === undefined) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const parsedHomeTeamGoals = parseInt(homeTeamGoals, 10);
    const parsedAwayTeamGoals = parseInt(awayTeamGoals, 10);

    if (Number.isNaN(parsedAwayTeamGoals) || Number.isNaN(parsedHomeTeamGoals)) {
      return res.status(400).json({ message: 'Goals must be numbers' });
    }
    if (homeTeamGoals < 0 || awayTeamGoals < 0) {
      return res.status(400).json({ message: 'Goals cannot be negative' });
    }
    next();
  }

  public static validateCreateMatchFields(req: Request, res: Response, next: NextFunction) {
    const { homeTeamId, awayTeamId } = req.body;
    if (!homeTeamId || !awayTeamId) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const parsedHomeTeamId = parseInt(homeTeamId, 10);
    const parsedAwayTeamId = parseInt(awayTeamId, 10);

    if (Number.isNaN(parsedAwayTeamId) || Number.isNaN(parsedHomeTeamId)) {
      return res.status(400).json({ message: 'Team ids must be numbers' });
    }
    if (homeTeamId === awayTeamId) {
      return res
        .status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }
    if (homeTeamId < 0 || awayTeamId < 0) {
      return res.status(400).json({ message: 'Team ids cannot be negative' });
    }
    next();
  }
}

export default MatchMiddlewares;
