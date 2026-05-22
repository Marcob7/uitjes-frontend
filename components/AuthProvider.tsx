"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearStoredTokens,
  getCurrentUser,
  getStoredTokens,
  loginWithJwt,
  refreshJwtToken,
  setStoredTokens,
  type JwtTokens,
  type JwtUser,
} from "@/lib/jwtAuth";

type AuthStatus = "checking" | "authenticated" | "logged_out";

type AuthContextValue = {
  status: AuthStatus;
  user: JwtUser | null;
  tokens: JwtTokens | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<JwtUser>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  refreshUser: () => Promise<JwtUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [tokens, setTokens] = useState<JwtTokens | null>(null);
  const [user, setUser] = useState<JwtUser | null>(null);

  const clearAuth = useCallback(() => {
    clearStoredTokens();
    setTokens(null);
    setUser(null);
    setStatus("logged_out");
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const currentTokens = tokens ?? getStoredTokens();
    if (!currentTokens?.refresh) {
      clearAuth();
      return null;
    }

    try {
      const access = await refreshJwtToken(currentTokens.refresh);
      const nextTokens = { ...currentTokens, access };
      setStoredTokens(nextTokens);
      setTokens(nextTokens);
      return access;
    } catch {
      clearAuth();
      return null;
    }
  }, [clearAuth, tokens]);

  const refreshUser = useCallback(async () => {
    const currentTokens = tokens ?? getStoredTokens();
    if (!currentTokens?.access) {
      clearAuth();
      return null;
    }

    try {
      let nextUser = await getCurrentUser(currentTokens.access);

      if (!nextUser && currentTokens.refresh) {
        const refreshedAccess = await refreshJwtToken(currentTokens.refresh);
        const nextTokens = { ...currentTokens, access: refreshedAccess };
        setStoredTokens(nextTokens);
        setTokens(nextTokens);
        nextUser = await getCurrentUser(refreshedAccess);
      }

      if (!nextUser) {
        clearAuth();
        return null;
      }

      setUser(nextUser);
      setStatus("authenticated");
      return nextUser;
    } catch {
      clearAuth();
      return null;
    }
  }, [clearAuth, tokens]);

  useEffect(() => {
    const storedTokens = getStoredTokens();
    if (!storedTokens) {
      setStatus("logged_out");
      return;
    }

    const initialTokens = storedTokens;
    setTokens(initialTokens);
    let cancelled = false;

    async function loadUser() {
      try {
        let nextUser = await getCurrentUser(initialTokens.access);
        let nextTokens = initialTokens;

        if (!nextUser) {
          const access = await refreshJwtToken(initialTokens.refresh);
          nextTokens = { ...initialTokens, access };
          setStoredTokens(nextTokens);
          nextUser = await getCurrentUser(access);
        }

        if (cancelled) return;

        if (!nextUser) {
          clearAuth();
          return;
        }

        setTokens(nextTokens);
        setUser(nextUser);
        setStatus("authenticated");
      } catch {
        if (!cancelled) clearAuth();
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [clearAuth]);

  const login = useCallback(async (identifier: string, password: string) => {
    setStatus("checking");

    try {
      const nextTokens = await loginWithJwt(identifier, password);
      setStoredTokens(nextTokens);
      setTokens(nextTokens);

      const nextUser = await getCurrentUser(nextTokens.access);
      if (!nextUser) {
        clearAuth();
        throw new Error("Inloggen lukte, maar je account kon niet worden opgehaald.");
      }

      setUser(nextUser);
      setStatus("authenticated");
      return nextUser;
    } catch (error) {
      clearAuth();
      throw error;
    }
  }, [clearAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    user,
    tokens,
    isAuthenticated: status === "authenticated" && Boolean(user),
    login,
    logout,
    refreshAccessToken,
    refreshUser,
  }), [login, logout, refreshAccessToken, refreshUser, status, tokens, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
