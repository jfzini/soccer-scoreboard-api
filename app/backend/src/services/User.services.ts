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
}

export default UserService;
