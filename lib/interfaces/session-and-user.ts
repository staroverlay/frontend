import ISessionWithToken from './session-with-token';
import IUser from './user';

export default interface ISessionAndUser {
  session: ISessionWithToken;
  user: IUser;
}
