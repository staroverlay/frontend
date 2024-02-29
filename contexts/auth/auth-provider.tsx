import { PropsWithChildren, useEffect, useState } from 'react';

import Loading from '@/components/layout/loading';
import { removeBearerToken, setBearerToken } from '@/lib/clients/graphql';
import { toastError } from '@/lib/utils/toasts';
import { invalidateSession } from '@/services/sessions';
import ISessionAndUser from '@/services/sessions/session-and-user';
import { getCurrentUser } from '@/services/users';
import User from '@/services/users/user';

import { AuthContext } from './auth-context';

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [fetched, setFetched] = useState(false);

  function isLogged() {
    return user != null && token != null;
  }

  async function logout(invalidate = false) {
    if (invalidate) {
      await invalidateSession().catch(() => null);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('ssid');

    if (user != null) {
      setUser(null);
    }

    if (token != null) {
      setToken(null);
    }

    if (sessionId != null) {
      setSessionId(null);
    }

    removeBearerToken();
  }

  function login({ session, user }: ISessionAndUser): User {
    const token = session.token;

    setBearerToken(token);
    setToken(token);
    setUser(user);
    setSessionId(session._id);

    localStorage.setItem('token', token);
    localStorage.setItem('ssid', session._id);

    return user;
  }

  async function loginWithPreviousToken(): Promise<User | null> {
    const token = localStorage.getItem('token');
    const ssid = localStorage.getItem('ssid');

    if (!token || !ssid) return null;

    setToken(token);
    setBearerToken(token);
    setSessionId(ssid);

    const user = await getCurrentUser();
    return user;
  }

  useEffect(() => {
    async function handle() {
      const user = await loginWithPreviousToken();
      if (user) setUser(user);
    }

    handle()
      .catch((e) => {
        const error = e.message;

        if (error == 'INVALID_SESSION') {
          logout();
        }

        toastError(e.message);
      })
      .finally(() => setFetched(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        sessionId,
        user,
        setUser,
        isLogged,
        login,
        logout,
      }}
    >
      <Loading loaded={fetched} message={'Logging in'}>
        {children}
      </Loading>
    </AuthContext.Provider>
  );
}
