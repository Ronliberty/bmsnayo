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
  const [loading, setLoading] = useState(true); // start as true

  // ------------------ LOGIN ------------------
  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for HttpOnly cookie
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
    } finally {
      setLoading(false);
    }
  }

  // ------------------ REGISTER ------------------
  async function register(payload: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...payload,
        react_app: process.env.NEXT_PUBLIC_APP_UUID,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  }

  // ------------------ REFRESH ------------------
 async function refresh(): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh/`, {
      method: "POST",
      credentials: "include", // send cookies
    });

    if (!res.ok) {
      setAccess(null);
      setUser(null);
      return false;
    }

    const data = await res.json();
    setAccess(data.access);
    setUser(data.user ?? null);
    return true;
  } catch (err) {
    setAccess(null);
    setUser(null);
    return false;
  }
}


  // ------------------ LOGOUT ------------------
  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout/`, {
      method: "POST",
      credentials: "include", // clear cookie
    });
    setAccess(null);
    setUser(null);
  }

  // ------------------ AUTO REFRESH ON PAGE LOAD ------------------
  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
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
