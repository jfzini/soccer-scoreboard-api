import * as express from 'express';
import UserController from '../controllers/User.controllers';
import middlewares from '../middlewares/user.middlewares';
import validateToken from '../middlewares/token.middlewares';

const LoginRouter = express.Router();

const userController = new UserController();

LoginRouter.post('/', middlewares.validateLogin, (req: express.Request, res: express.Response) =>
  userController.loginUser(req, res));

LoginRouter.get('/role', validateToken, (req: express.Request, res: express.Response) =>
  UserController.getRole(req, res));

export default LoginRouter;
