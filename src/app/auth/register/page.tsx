"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== password2) return setErr("Passwords do not match");
    setLoading(true);
    setErr(null);
    try {
      await register({ email, first_name, last_name, password });
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.error || e?.detail || JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))] text-[rgb(var(--foreground))] px-4">
      <div className="w-full max-w-md p-8 bg-[rgb(var(--card))] text-[rgb(var(--card-foreground))] rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Register</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            required
            className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
          />
          <input
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            required
            className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
          />
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
          <input
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm password"
            type="password"
            required
            className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
          />
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-2 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] rounded-md font-medium hover:bg-[rgb(var(--primary-foreground))] hover:text-[rgb(var(--primary))] transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
        </form>
        <div className="mt-4 text-center text-sm">
          <a href="/auth/login" className="text-[rgb(var(--accent))] hover:underline">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </main>
  );
}
