import IUser from '../user';
import ISessionWithToken from './session-with-token';

export default interface ISessionAndUser {
  session: ISessionWithToken;
  user: IUser;
}
