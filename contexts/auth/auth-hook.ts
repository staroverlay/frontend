import ISessionAndUser from "@/lib/interfaces/session-and-user";
import User from "../../lib/interfaces/user";

export interface AuthHook {
  user: User | null;
  setUser: (user: User | null) => void;
  isLogged: () => boolean;
  login: (session: ISessionAndUser) => Promise<User>;
  logout: (invalidate: boolean) => Promise<void>;
}
