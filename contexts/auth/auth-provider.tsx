import { PropsWithChildren, useEffect, useState } from "react";

import { AuthContext } from "./auth-context";
import User from "../../lib/interfaces/user";
import { removeBearerToken, setBearerToken } from "../../lib/graphql/client";
import { getCurrentUser } from "../../lib/services/user-service";
import { toastError } from "../../lib/utils/toasts";
import Loading from "../../components/layout/loading";
import ISessionAndUser from "@/lib/interfaces/session-and-user";
import { invalidateSession } from "@/lib/services/session-service";

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>();
  const [user, setUser] = useState<User | null>(null);

  const [fetched, setFetched] = useState(false);

  function isLogged() {
    return user != null && token != null;
  }

  async function logout(invalidate = false) {
    localStorage.removeItem("token");

    if (user != null) {
      setUser(null);
    }

    if (token != null) {
      setToken(null);
    }

    if (invalidate) {
      await invalidateSession().catch(() => null);
    }
    
    removeBearerToken();
  }

  async function login({session, user}: ISessionAndUser): Promise<User> {
    const token = session.token;

    setToken(token);
    setBearerToken(token);
    setUser(user);
    localStorage.setItem("token",token);
    return user;
  }

  async function loginWithPreviousToken(): Promise<User | null> {
    const token = localStorage.getItem("token");
    if (!token) return null;

    setToken(token);
    setBearerToken(token);

    const user = await getCurrentUser();
    return user;
  }

  useEffect(() => {
    async function handle() {
      const user = await loginWithPreviousToken();
      if (user) setUser(user);
    }

    handle().catch((e) => {
      const error = e.message;

      if (error == "INVALID_SESSION") {
        logout();
      }

      toastError(e.message)
    }).finally(() => setFetched(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLogged,
        login,
        logout,
      }}
    >
      <Loading loaded={fetched} message={"Logging in"}>
        {children}
      </Loading>
    </AuthContext.Provider>
  );
}
