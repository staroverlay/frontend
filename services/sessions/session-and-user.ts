import Profile from '../profile/profile';
import IUser from '../users/user';
import ISessionWithToken from './session-with-token';

export default interface ISessionAndUser {
  profile: Profile | null;
  session: ISessionWithToken;
  user: IUser;
}
