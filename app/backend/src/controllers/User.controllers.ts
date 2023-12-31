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

  public async createUser(req: Request, res: Response) {
    const { username, email, password, role } = req.body;
    const { status, data } = await this.userService.createUser({ username, email, password, role });
    return res.status(mapStatus(status)).json(data);
  }

  public static getRole(req: Request, res: Response) {
    const { role } = req.body.user;
    return res.status(200).json({ role });
  }
}

export default UserController;
