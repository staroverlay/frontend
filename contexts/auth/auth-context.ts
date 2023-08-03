import React from "react";

import { AuthHook } from "./auth-hook";

import User from "../../lib/interfaces/user";

export const AuthContext = React.createContext<AuthHook>({
  user: null,
  setUser: (): void => {
    throw new Error("Not implemented");
  },
  isLogged: (): boolean => false,
  login: async (): Promise<User> => {
    throw new Error("Not implemented");
  },
  logout: async (): Promise<void> => {
    throw new Error("Not implemented");
  },
});
