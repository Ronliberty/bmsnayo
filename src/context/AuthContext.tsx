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

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email,
          password,
          react_app: process.env.NEXT_PUBLIC_APP_UUID,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setAccess(data.access);
      setUser(data.user ?? null);
      localStorage.setItem("refresh", data.refresh); // ✅ save refresh
    } finally {
      setLoading(false);
    }
  }

  async function register(payload: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        ...payload,
        react_app: process.env.NEXT_PUBLIC_APP_UUID, // ✅ fixed
      }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  }

  async function refresh(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("refresh");
      if (!refreshToken) return false;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
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
    localStorage.removeItem("refresh"); // ✅ remove refresh
    setAccess(null);
    setUser(null);
  }

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
