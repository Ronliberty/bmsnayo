"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      router.push("/dashboard");
    } catch (e: any) {
      console.error("❌ Register failed:", e);
      setErr(e?.error || e?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background Ambient Shapes */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-[15%] left-[20%] w-[40vmax] h-[40vmax] bg-primary/20 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[15%] w-[35vmax] h-[35vmax] bg-secondary/20 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      {/* Register Card */}
      <motion.div
        className="w-[90%] max-w-md p-8 rounded-2xl bg-card border border-border shadow-xl text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-primary">
          BitMind Systems
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Create your account
        </p>

        <form className="flex flex-col gap-4 text-left" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-muted-foreground">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              required
              className="w-full mt-1 p-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              required
              className="w-full mt-1 p-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full mt-1 p-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-muted-foreground">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
              className="w-full mt-1 p-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={18} />
              ) : (
                <AiOutlineEye size={18} />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm text-muted-foreground">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              required
              className="w-full mt-1 p-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={18} />
              ) : (
                <AiOutlineEye size={18} />
              )}
            </button>
          </div>

          {err && <p className="text-destructive text-sm">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-primary text-primary-foreground w-full py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
