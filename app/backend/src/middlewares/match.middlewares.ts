import { NextFunction, Request, Response } from 'express';

const validateUpdateGoalsFields = (req: Request, res: Response, next: NextFunction) => {
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
};

export default validateUpdateGoalsFields;
