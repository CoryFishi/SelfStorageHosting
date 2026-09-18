import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type User = { id: string; email: string; name?: string; createdAt?: string };

type AuthCtx = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthed: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  authFetch: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
const API = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(!!token);
  const [error, setError] = useState<string | null>(null);

  // keep token in localStorage + sync across tabs
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") setToken(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const authFetch: AuthCtx["authFetch"] = async (input, init) => {
    const headers = new Headers(init?.headers ?? {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const res = await fetch(input, { ...init, headers });
    if (res.status === 401) {
      // token invalid/expired → clear and surface error
      setToken(null);
      setUser(null);
    }
    return res;
  };

  const refreshProfile = async () => {
    if (!token) throw new Error("No token stored");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/app/auth/profile`,
        {
          credentials: "include",
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.message || `Profile failed (${res.status})`);
      setUser(data.user as User);
    } catch (e: any) {
      setError(e.message ?? "Profile error");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const login: AuthCtx["login"] = async (email, password) => {
    setError(null);
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/app/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.token)
      throw new Error(data?.message || "Login failed");
    setToken(data.token);
    setUser(data.user as User);
  };

  const register: AuthCtx["register"] = async (email, password, name) => {
    setError(null);
    const res = await fetch(`${API}/app/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.token)
      throw new Error(data?.message || "Register failed");
    setToken(data.token);
    setUser(data.user as User);
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_BASE}/app/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setToken(null);
    setUser(null);
    setError(null);
  };

  // auto-load profile on boot if we have a token
  useEffect(() => {
    if (token)
      refreshProfile().catch(() => {
        /* already handled in state */
      });
    else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      token,
      isLoading,
      isAuthed: !!user && !!token,
      error,
      login,
      register,
      logout,
      refreshProfile,
      authFetch,
    }),
    [user, token, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
