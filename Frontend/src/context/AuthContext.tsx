// in this file we have saved user login logout state local storage and further backend will connect here

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { mockLogin, mockSignup } from '../api/apiAuth';
import type { AuthUser } from '../api/apiAuth';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = 'ai-career-user';
const TOKEN_KEY = 'ai-career-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const saveSession = (nextUser: AuthUser, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_KEY, nextToken);
  };

  const login = async (email: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const response = await mockLogin(email, password);
      saveSession(response.user, response.token);
    } catch (err) {
      setAuthError((err as Error).message);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const response = await mockSignup(name, email, password);
      saveSession(response.user, response.token);
    } catch (err) {
      setAuthError((err as Error).message);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isAuthLoading,
      authError,
      login,
      signup,
      logout
    }),
    [user, token, isAuthLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }

  return context;
}