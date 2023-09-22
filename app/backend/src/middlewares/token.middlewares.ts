import { NextFunction, Request, Response } from 'express';
import Token from '../auth/Token';

const auth = new Token();

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token not found' });
  }

  const [, token] = authorization.split('Bearer ');
  const decoded = auth.validateToken(token);
  if (decoded) {
    req.body.user = decoded;
    next();
  } else {
    res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default validateToken;
