import * as express from 'express';
import UserController from '../controllers/User.controllers';

const LoginRouter = express.Router();

const userController = new UserController();

LoginRouter.post('/', (req, res) => userController.loginUser(req, res));

export default LoginRouter;
