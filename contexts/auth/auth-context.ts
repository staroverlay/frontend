import { User } from '@staroverlay/sdk';
import React from 'react';

import { AuthHook } from './auth-hook';

export const AuthContext = React.createContext<AuthHook>({
  sessionId: null,
  user: null,
  setUser: (): void => {
    throw new Error('Not implemented');
  },
  isLogged: (): boolean => false,
  login: (): User => {
    throw new Error('Not implemented');
  },
  logout: async (): Promise<void> => {
    throw new Error('Not implemented');
  },
});
