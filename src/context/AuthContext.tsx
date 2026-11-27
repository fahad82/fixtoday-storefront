"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Account, TOKEN_KEY, accountService } from '@/services/accountService';

interface AuthContextType {
  user: Account | null;
  /** False until we know whether this browser is signed in. */
  isReady: boolean;
  login: (email: string, password: string) => Promise<Account>;
  register: (body: { name: string; email: string; password: string; phone?: string }) => Promise<Account>;
  logout: () => void;
  setUser: (user: Account) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Check a saved sign-in with the server, so an expired one is dropped.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const check = token ? accountService.me() : Promise.resolve(null);
    check
      .then((u) => setUser(u))
      .catch((err: unknown) => {
        // Only forget the sign-in if the server rejected it, not on a network blip.
        if (String((err as Error)?.message).includes('401')) localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await accountService.login(email, password);
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (body: { name: string; email: string; password: string; phone?: string }) => {
    const res = await accountService.register(body);
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, isReady, login, register, logout, setUser }), [user, isReady, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
