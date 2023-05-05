import { PropsWithChildren, useState } from "react";

import { AuthContext } from "./auth-context";
import User from "../../lib/interfaces/user";
import useWindow from "../../hooks/useWindow";

type NullableUser = User | null;

interface AuthProviderProps extends PropsWithChildren {
  authURL: string;
  user: NullableUser;
}

export function AuthProvider({
  children,
  authURL,
  user: LoggedUser,
}: AuthProviderProps) {
  const [user, setUser] = useState<NullableUser>(LoggedUser);
  const { openAndWaitMessage } = useWindow(authURL);

  function isLogged(): boolean {
    return user !== null;
  }

  async function login(): Promise<User> {
    const { user, token } = await openAndWaitMessage("so_auth");
    if (user) setUser(user);
    if (token) localStorage.setItem("token", token);
    return user as User;
  }

  async function logout(): Promise<void> {}

  return (
    <AuthContext.Provider
      value={{
        authURL,
        user,
        isLogged,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
