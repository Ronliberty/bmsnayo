// context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  access: string | null;
  user: any | null;
  loading: boolean; 
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: any) => Promise<any>;
  refresh: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [access, setAccess] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Call this to log in
  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setAccess(data.access);
      setUser(data.user ?? null);
    } finally {
      setLoading(false);
    }
  }

  async function register(payload: any) {
    const app_uuid = process.env.NEXT_PUBLIC_APP_UUID;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
       body: JSON.stringify({
      ...payload,   // spread into an object
      app_uuid: process.env.NEXT_PUBLIC_APP_UUID,     // add uuid
    }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  }

  // attempt refresh, store new access if successful
  async function refresh(): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setAccess(null);
        setUser(null);
        return false;
      }
      setAccess(data.access);
      return true;
    } catch (err) {
      setAccess(null);
      setUser(null);
      return false;
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAccess(null);
    setUser(null);
  }

  // optional: on mount, attempt refresh so user is auto-logged if cookie present
  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ access, user, loading, login, logout, register, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
