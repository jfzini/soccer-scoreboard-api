import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

type Payload = {
  id: number;
  username: string;
  role: string;
  email: string;
};

class Token {
  private secret: string = process.env.JWT_SECRET || 'secret';
  private options: SignOptions = { expiresIn: '7d', algorithm: 'HS256' };

  public generateToken(payload: Payload): string {
    return jwt.sign(payload, this.secret, this.options);
  }
}

export default Token;