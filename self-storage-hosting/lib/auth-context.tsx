"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type User = { id: string; email: string; name?: string; createdAt?: string };

const API = process.env.NEXT_PUBLIC_API_BASE;

type AuthCtx = {
  user: User | null;
  ready: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

async function post(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/users/profile`, { credentials: "include" });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Profile failed (${res.status})`);
      setUser(data.user as User);
    } finally {
      setReady(true);
    }
  }, []);

  // Runs only after mount, so nothing here affects prerendered HTML.
  useEffect(() => {
    if (!API) {
      console.error("NEXT_PUBLIC_API_BASE is not set; auth requests will fail.");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }
    refreshProfile().catch(() => setReady(true));
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const data = await post("/api/users/login", { email, password });
      setUser(data.user as User);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
      throw e;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setError(null);
    try {
      const data = await post("/api/users/register", { email, password, name });
      setUser(data.user as User);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    await post("/api/users/logout", {});
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, ready, error, login, register, logout, refreshProfile }),
    [user, ready, error, login, register, logout, refreshProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
