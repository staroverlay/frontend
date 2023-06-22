import { PropsWithChildren, useEffect, useState } from "react";

import { AuthContext } from "./auth-context";
import User from "../../lib/interfaces/user";
import { setBearerToken } from "../../lib/graphql/client";
import { getCurrentUser } from "../../lib/services/auth";
import twitch from "../../lib/services/twitch";
import { toastError } from "../../lib/utils/toasts";
import Loading from "../../components/layout/loading";

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>();
  const [user, setUser] = useState<User | null>(null);

  const [fetched, setFetched] = useState(false);

  function isLogged() {
    return user != null && token != null;
  }

  async function loginWithCode(code: string): Promise<User> {
    const res = await fetch("/api/login", {
      body: JSON.stringify({ code }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
    });

    const { session, user, error } = await res.json();
    if (session && user) {
      const { token } = session;
      localStorage.setItem("token", token);
      setBearerToken(token);
      setToken(token);
      setUser(user);
      return user;
    } else {
      const errorMessage = error?.message || error || "Unknown error";
      throw new Error(errorMessage);
    }
  }

  async function loginWithToken(newToken: string) {
    if (token != newToken) setToken(newToken);
    setBearerToken(newToken);
    const user = await getCurrentUser();
    setUser(user);
    return user;
  }

  async function logout(): Promise<void> {
    setBearerToken("");
    localStorage.removeItem("token");
  }

  function redirectToLogin() {
    window.location.href = twitch.authenticate();
  }

  useEffect(() => {
    async function login() {
      const token = localStorage.getItem("token");

      if (!token) {
        return setFetched(true);
      }

      let error = null;
      const user = await loginWithToken(token).catch(
        (e) => (error = e.message)
      );
      const logged = user !== null;

      if (logged) {
        setFetched(true);
      } else {
        const isFetchError = error === "Failed to fetch";
        if (isFetchError) {
          return toastError(`Failed to fetch, maybe the server is down.`);
        }
        logout();
        setFetched(true);
        toastError(`Failed to login, retrying...`);
      }
    }

    if (!fetched) {
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogged,
        loginWithCode,
        loginWithToken,
        redirectToLogin,
        logout,
      }}
    >
      <Loading loaded={fetched} message={"Logging in"}>
        {children}
      </Loading>
    </AuthContext.Provider>
  );
}
