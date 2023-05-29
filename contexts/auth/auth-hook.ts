import User from "../../lib/interfaces/user";

export interface AuthHook {
  user: User | null;
  isLogged: () => boolean;
  loginWithCode: (token: string) => Promise<User>;
  loginWithToken: (token: string) => Promise<User>;
  logout: () => Promise<void>;
  redirectToLogin: () => void;
}
