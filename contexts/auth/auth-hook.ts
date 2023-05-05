import User from "../../lib/user";

export interface AuthHook {
  authURL: string;
  user: User | null;
  isLogged: () => boolean;
  login: () => Promise<User>;
  logout: () => Promise<void>;
}
