import React from "react";

import { AuthHook } from "./auth-hook";

import User from "../../lib/interfaces/user";

export const AuthContext = React.createContext<AuthHook>({
  user: null,
  isLogged: (): boolean => false,
  loginWithCode: (code: string): Promise<User> => new Promise(() => {}),
  loginWithToken: (token: string): Promise<User> => new Promise(() => {}),
  logout: (): Promise<void> => new Promise(() => {}),
  redirectToLogin: (): void => {},
});
