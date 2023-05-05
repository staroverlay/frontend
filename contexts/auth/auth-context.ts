import React from "react";
import User from "../../lib/user";
import { AuthHook } from "./auth-hook";

export const AuthContext = React.createContext<AuthHook>({
  authURL: "",
  user: null,
  isLogged: (): boolean => false,
  login: (): Promise<User> => new Promise(() => {}),
  logout: (): Promise<void> => new Promise(() => {}),
});
