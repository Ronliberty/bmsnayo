// src/components/about/HeroSection.tsx
"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-28 text-center">
        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl font-semibold tracking-tight">
          Earn, learn, and collaborate{" "}
          <span className="text-primary">in one place</span>
        </h1>

        {/* Value proposition */}
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
          Nayo is an all-in-one platform for buying and selling services,
          accessing digital products, forming partnerships, and growing your
          skills — backed by secure escrow.
        </p>

        {/* CTA */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Get started
          </Link>

          <Link
            href="#how-it-works"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-accent transition"
          >
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
}
