import { PropsWithChildren, useEffect, useState } from "react";

import { AuthContext } from "./auth-context";
import User from "../../lib/interfaces/user";
import { setBearerToken } from "../../lib/graphql/client";
import { getCurrentUser } from "../../lib/services/auth";
import twitch from "../../lib/services/twitch";

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
      if (token) {
        await loginWithToken(token).catch((e) => {
          logout();
        });
      }
      setFetched(true);
    }

    if (!fetched) {
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, token]);

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
      {fetched && children}
    </AuthContext.Provider>
  );
}
