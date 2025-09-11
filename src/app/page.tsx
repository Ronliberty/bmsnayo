"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

export default function LandingPage() {
  // Hide scrollbars for immersive landing
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 text-white dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors">
      {/* Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-[15%] left-[10%] w-[35vmax] h-[35vmax] bg-pink-500 rounded-full blur-[100px] opacity-25"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[15%] w-[30vmax] h-[30vmax] bg-indigo-500 rounded-full blur-[120px] opacity-25"
          animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Navbar */}
      <motion.nav
        className="w-full flex justify-between items-center p-6 md:p-10 z-20"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300">
          Nayo.
        </div>
        <Link
          href="/dashboard"
          className="bg-white text-purple-900 dark:bg-purple-600 dark:text-white px-6 py-2 rounded-full font-medium shadow-lg hover:opacity-90 transition duration-300"
        >
          Get Started Free
        </Link>
      </motion.nav>

      {/* Hero */}
      <div className="flex-grow flex items-center justify-center w-full px-6 z-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Left text */}
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Connect. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-300">
                Share.
              </span>{" "}
              <br />
              Build.
            </h1>
            <p className="text-lg text-gray-200 dark:text-gray-400 mb-8 max-w-md mx-auto md:mx-0">
              Discover opportunities. Showcase your skills. Grow with global
              partnerships. All inside Nayo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300"
              >
                Get Started
              </Link>
              <Link
                href="/auth/login"
                className="border border-gray-400 dark:border-gray-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right mockup */}
          <motion.div
            className="md:w-1/2 flex justify-center mt-12 md:mt-0"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative bg-gray-800/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-[30px] p-6 w-72 h-96 flex flex-col items-center justify-center shadow-2xl">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl font-bold">N</span>
              </div>
              <div className="space-y-3 text-center w-full">
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full w-2/3 mx-auto"></div>
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full w-1/2 mx-auto"></div>
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full w-3/4 mx-auto"></div>
              </div>
              <motion.div
                className="mt-8 w-28 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold shadow-md shadow-pink-500/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Connect
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="py-6 text-center text-gray-400 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} Nayo. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
}
