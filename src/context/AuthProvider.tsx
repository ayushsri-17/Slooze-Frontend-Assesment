"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@/lib/types";
import { storage } from "@/lib/storage";

type AuthContextValue = {
  session: Session | null;
  isAuthenticated: boolean;
  login: (session: Session) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // restore session on first load (same idea as your previous repo)
    const saved = storage.getSession();
    if (saved) setSession(saved);
  }, []);

  const login = (newSession: Session) => {
    storage.setSession(newSession);
    setSession(newSession);
  };

  const logout = () => {
    storage.clearSession();
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
