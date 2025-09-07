// app/register/page.tsx
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
      await register({ email, first_name, last_name, password});
      // optionally auto-login or redirect to login page
      router.push("/login");
    } catch (e: any) {
      setErr(JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input value={first_name} onChange={(e)=>setFirstName(e.target.value)} placeholder="First name" required />
        <input value={last_name} onChange={(e)=>setLastName(e.target.value)} placeholder="Last name" required />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        <input value={password2} onChange={(e)=>setPassword2(e.target.value)} placeholder="Confirm password" type="password" required />
        <button type="submit" disabled={loading}>Register</button>
        {err && <p style={{ color: "red" }}>{err}</p>}
      </form>
    </main>
  );
}
