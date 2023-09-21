import * as express from 'express';
import UserController from '../controllers/User.controllers';
import validateLoginFields from '../middlewares/user.middlewares';

const LoginRouter = express.Router();

const userController = new UserController();

LoginRouter.post('/', validateLoginFields, (req, res) => userController.loginUser(req, res));

export default LoginRouter;
