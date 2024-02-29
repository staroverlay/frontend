import ISessionAndUser from '@/services/sessions/session-and-user';
import User from '@/services/users/user';

export interface AuthHook {
  sessionId: string | null;
  user: User | null;
  setUser: (user: User | null) => void;
  isLogged: () => boolean;
  login: (session: ISessionAndUser) => User;
  logout: (invalidate: boolean) => Promise<void>;
}
