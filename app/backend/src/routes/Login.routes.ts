import * as express from 'express';
import { Request, Response } from 'express';
import UserController from '../controllers/User.controllers';
import middlewares from '../middlewares/user.middlewares';
import tokenMiddleware from '../middlewares/token.middlewares';

const LoginRouter = express.Router();

const userController = new UserController();

LoginRouter.post(
  '/',
  middlewares.validateLoginFields,
  middlewares.validateEmailFormat,
  middlewares.validatePasswordFormat,
  (req: Request, res: Response) => userController.loginUser(req, res),
);

LoginRouter.post(
  '/create',
  middlewares.validateEmailFormat,
  middlewares.validatePasswordFormat,
  (req: Request, res: Response) => userController.createUser(req, res),
);

LoginRouter.get('/role', tokenMiddleware, (req: Request, res: Response) =>
  UserController.getRole(req, res));

export default LoginRouter;
