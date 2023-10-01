import * as bcrypt from 'bcryptjs';
import Token from '../auth/Token';
import UserModel from '../database/models/UserModel';
import { IServiceResponse } from '../Interfaces/IServiceResponse';

class UserService {
  private userModel = UserModel;
  private token = new Token();

  public async loginUser(email: string, password: string): Promise<IServiceResponse<UserModel>> {
    const data = await this.userModel.findOne({ where: { email } });
    if (!data) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const { password: hashedPassword, ...rest } = data.dataValues;
    const isValidPassword = bcrypt.compareSync(password, hashedPassword);
    if (!isValidPassword) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const token = this.token.generateToken(rest);
    return { status: 'SUCCESSFUL', data: { token } };
  }

  public async createUser(user: any): Promise<IServiceResponse<UserModel>> {
    const foundUser = await this.userModel.findOne({ where: { email: user.email } });
    if (foundUser) {
      return { status: 'BAD_REQUEST', data: { message: 'User already exists' } };
    }
    const { password, ...rest } = user;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const { dataValues } = await this.userModel.create({ ...rest, password: hashedPassword });
    const { password: hashedPassword2, ...rest2 } = dataValues;
    const token = this.token.generateToken(rest2);
    return { status: 'SUCCESSFUL', data: { token } };
  }
}

export default UserService;
