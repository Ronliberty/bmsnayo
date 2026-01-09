
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Nayo
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {/* Primary */}
          <Link
            href="#about"
            className="text-muted-foreground hover:text-foreground transition"
          >
            About
          </Link>

          <Link
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Pricing
          </Link>

          {/* Social Proof */}
          <Link
            href="#testimonials"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Testimonials
          </Link>

          <Link
            href="#partners"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Partners
          </Link>

          {/* Resources */}
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Blog
          </Link>

          <Link
            href="#faqs"
            className="text-muted-foreground hover:text-foreground transition"
          >
            FAQs
          </Link>

          {/* CTA */}
          <Link
            href="/auth/login"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="flex flex-col gap-4 px-6 py-6 text-sm">
            <Link href="#about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="#pricing" onClick={() => setOpen(false)}>
              Pricing
            </Link>
            <Link href="#testimonials" onClick={() => setOpen(false)}>
              Testimonials
            </Link>
            <Link href="#partners" onClick={() => setOpen(false)}>
              Partners
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>
            <Link href="#faqs" onClick={() => setOpen(false)}>
              FAQs
            </Link>

            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-primary px-4 py-2 text-center text-primary-foreground"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
