import { NextFunction, Request, Response } from 'express';

const validateLoginFields = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'All fields must be filled' });

  next();
};

const validateEmailFormat = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!emailRegex.test(email)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  next();
};

const validatePasswordFormat = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (password.length < 6) return res.status(401).json({ message: 'Invalid email or password' });

  next();
};

export default {
  validateLogin: [validateLoginFields, validateEmailFormat, validatePasswordFormat],
};
