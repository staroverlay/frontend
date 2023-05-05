import React from "react";

import { AuthHook } from "./auth-hook";

import User from "../../lib/interfaces/user";

export const AuthContext = React.createContext<AuthHook>({
  authURL: "",
  user: null,
  isLogged: (): boolean => false,
  login: (): Promise<User> => new Promise(() => {}),
  logout: (): Promise<void> => new Promise(() => {}),
});
