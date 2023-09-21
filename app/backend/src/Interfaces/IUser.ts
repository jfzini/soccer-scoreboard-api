import Example from './Example';

export default interface IUser extends Example {
  username: string;
  role: string;
  email: string;
  password: string;
}
