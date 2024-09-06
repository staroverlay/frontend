import { SessionAndUser, User } from '@staroverlay/sdk';

export interface AuthHook {
  sessionId: string | null;
  user: User | null;
  setUser: (user: User | null) => void;
  isLogged: () => boolean;
  login: (session: SessionAndUser) => User;
  logout: (invalidate: boolean) => Promise<void>;
}
