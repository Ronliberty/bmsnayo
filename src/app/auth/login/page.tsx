"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.error || e?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[rgb(var(--background))] text-[rgb(var(--foreground))] px-4">
      <nav className="w-full py-4 flex justify-between items-center">
        <div className="text-xl font-bold">Nayo.</div>
        <div className="space-x-4">
          <Link href="/" className="text-[rgb(var(--accent))] hover:underline">
            Home
          </Link>
          <Link href="/about" className="text-[rgb(var(--accent))] hover:underline">
            About
          </Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-[rgb(var(--card))] text-[rgb(var(--card-foreground))] rounded-xl shadow-lg">
          <h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
              className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
            />
            <button
              type="submit"
              disabled={loading}
              className=" cursor-pointer w-full py-2 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] rounded-md font-medium hover:bg-[rgb(var(--primary-foreground))] hover:text-[rgb(var(--primary))] transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
          </form>
          <div className="mt-4 flex justify-between text-sm">
            <a href="/forgot-password" className="cursor-pointer text-[rgb(var(--accent))] hover:underline">
              Forgot password?
            </a>
            <a href="/auth/register" className="cursor-pointer text-[rgb(var(--accent))] hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}