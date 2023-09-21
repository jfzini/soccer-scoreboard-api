import { Request, Response } from 'express';
import UserService from '../services/User.services';
import mapStatus from './utils/mapStatus';

class UserController {
  private userService: UserService = new UserService();

  public async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const { status, data } = await this.userService.loginUser(email, password);
    return res.status(mapStatus(status)).json(data);
  }
}

export default UserController;
