import ISessionAndUser from "@/lib/interfaces/session-and-user";
import User from "../../lib/interfaces/user";

export interface AuthHook {
  sessionId: string | null;
  user: User | null;
  setUser: (user: User | null) => void;
  isLogged: () => boolean;
  login: (session: ISessionAndUser) => User;
  logout: (invalidate: boolean) => Promise<void>;
}
