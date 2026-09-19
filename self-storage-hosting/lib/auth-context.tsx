"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthError, toUser, type User } from "@/lib/auth-form";

const API = process.env.NEXT_PUBLIC_API_BASE;
const AVAILABLE = Boolean(API);

type AuthCtx = {
  user: User | null;
  ready: boolean;
  // False when the site was built without an account server address. The
  // forms say so, instead of sending requests that cannot work.
  available: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

// The server answers every failure with { code, message }. The code is kept
// so the form can explain it with friendlyAuthError(). The message is for
// the console, not for visitors.
function errorFrom(data: unknown, status: number): AuthError {
  const { code, message } = (data ?? {}) as { code?: unknown; message?: unknown };
  return new AuthError(
    typeof code === "string" ? code : "HTTP_ERROR",
    typeof message === "string" ? message : `Request failed (${status})`
  );
}

async function post(path: string, body: unknown): Promise<unknown> {
  if (!API) throw new AuthError("UNAVAILABLE", "NEXT_PUBLIC_API_BASE is not set");
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
  } catch (e) {
    throw new AuthError("NETWORK", e instanceof Error ? e.message : String(e));
  }
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) throw errorFrom(data, res.status);
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // When there is no API base there is nothing to await, so ready starts true.
  const [ready, setReady] = useState(!API);

  const refreshProfile = useCallback(async () => {
    if (!API) return;
    try {
      const res = await fetch(`${API}/api/users/profile`, { credentials: "include" });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) throw errorFrom(data, res.status);
      setUser(toUser(data));
    } finally {
      setReady(true);
    }
  }, []);

  // Runs only after mount, so nothing here affects prerendered HTML.
  useEffect(() => {
    if (!API) {
      console.error("NEXT_PUBLIC_API_BASE is not set; signing in is unavailable.");
      return;
    }
    // A failed check leaves the visitor signed out, which is safe. The reason
    // still has to reach the console instead of disappearing.
    refreshProfile().catch((err) => console.error("Could not check the signed-in account:", err));
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setUser(toUser(await post("/api/users/login", { email, password })));
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setUser(toUser(await post("/api/users/register", { email, password, name })));
  }, []);

  const logout = useCallback(async () => {
    await post("/api/users/logout", {});
    setUser(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, ready, available: AVAILABLE, login, register, logout, refreshProfile }),
    [user, ready, login, register, logout, refreshProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
