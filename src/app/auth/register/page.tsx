// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

// export default function RegisterPage() {
//   const { register } = useAuth();
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [first_name, setFirstName] = useState("");
//   const [last_name, setLastName] = useState("");
//   const [password, setPassword] = useState("");
//   const [password2, setPassword2] = useState("");
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (password !== password2) return setErr("Passwords do not match");
//     setLoading(true);
//     setErr(null);
//     try {
//       await register({ email, first_name, last_name, password });
//       router.push("/onboard");
//     } catch (e: any) {
//       setErr(e?.error || e?.detail || JSON.stringify(e));
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))] text-[rgb(var(--foreground))] px-4">
//       <div className="w-full max-w-md p-8 bg-[rgb(var(--card))] text-[rgb(var(--card-foreground))] rounded-xl shadow-lg">
//         <h1 className="text-3xl font-semibold mb-6 text-center">Register</h1>
//         <form onSubmit={onSubmit} className="space-y-4">
//           <input
//             value={first_name}
//             onChange={(e) => setFirstName(e.target.value)}
//             placeholder="First name"
//             required
//             className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
//           />
//           <input
//             value={last_name}
//             onChange={(e) => setLastName(e.target.value)}
//             placeholder="Last name"
//             required
//             className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
//           />
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             type="email"
//             required
//             className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
//           />
//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             type="password"
//             required
//             className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
//           />
//           <input
//             value={password2}
//             onChange={(e) => setPassword2(e.target.value)}
//             placeholder="Confirm password"
//             type="password"
//             required
//             className="w-full px-4 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="cursor-pointer w-full py-2 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] rounded-md font-medium hover:bg-[rgb(var(--primary-foreground))] hover:text-[rgb(var(--primary))] transition-colors disabled:opacity-50"
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//           {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
//         </form>
//         <div className="mt-4 text-center text-sm">
//           <a href="/auth/login" className="text-[rgb(var(--accent))] hover:underline">
//             Already have an account? Sign in
//           </a>
//         </div>
//       </div>
//     </main>
//   );
// }



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
      await register({ email, first_name: firstName, last_name: lastName, password });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-800 text-white relative overflow-hidden">
      {/* Background Animated Lights */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-[10%] left-[20%] w-[40vmax] h-[40vmax] bg-cyan-500 rounded-full blur-[100px] opacity-20"
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[10%] w-[35vmax] h-[35vmax] bg-blue-600 rounded-full blur-[120px] opacity-25"
          animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Register Card */}
      <motion.div
        className="w-[90%] max-w-md p-8 rounded-3xl bg-gray-900/60 backdrop-blur-xl border border-white/10 shadow-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
          BitMind Systems
        </h1>
        <p className="text-gray-400 mb-8 text-sm">Create your account</p>

        <form className="flex flex-col gap-4 text-left" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-gray-300">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="John"
              required
              className="w-full mt-1 p-3 rounded-lg bg-gray-800/60 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Doe"
              required
              className="w-full mt-1 p-3 rounded-lg bg-gray-800/60 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
              className="w-full mt-1 p-3 rounded-lg bg-gray-800/60 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-gray-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="w-full mt-1 p-3 rounded-lg bg-gray-800/60 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm text-gray-300">Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="w-full mt-1 p-3 rounded-lg bg-gray-800/60 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {err && <p className="text-red-500 text-sm mt-1">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 w-full py-3 rounded-lg font-semibold text-white hover:opacity-90 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-cyan-400 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}