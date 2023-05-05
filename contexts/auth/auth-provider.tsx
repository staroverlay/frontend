import { PropsWithChildren, useEffect, useState } from "react";

import { AuthContext } from "./auth-context";
import User from "../../lib/interfaces/user";
import useWindow from "../../hooks/useWindow";
import { setBearerToken } from "../../lib/graphql/client";
import { getCurrentUser } from "../../lib/services/auth";
import twitch from "../../lib/services/twitch";

type NullableUser = User | null;

export function AuthProvider({ children }: PropsWithChildren) {
  const [fetched, setFetched] = useState<boolean>(false);
  const [user, setUser] = useState<NullableUser>(null);
  const authURL = twitch.authenticate();
  const { openAndWaitMessage } = useWindow(authURL);

  useEffect(() => {
    if (!fetched) {
      const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        if (token) {
          setBearerToken(token);
          const user = await getCurrentUser();
          setUser(user);
        }

        setFetched(true);
      };

      fetchUserData();
    }
  }, [fetched]);

  function isLogged(): boolean {
    return user !== null;
  }

  async function login(): Promise<User> {
    const { user, session } = await openAndWaitMessage("so_auth");
    if (user) setUser(user);
    if (session) {
      const { token } = session;
      localStorage.setItem("token", token);
      setBearerToken(token);
    }
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
      {fetched && children}
    </AuthContext.Provider>
  );
}
