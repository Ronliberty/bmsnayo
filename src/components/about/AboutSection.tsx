// src/components/about/AboutSection.tsx
"use client";

import { useEffect, useState } from "react";

export default function AboutSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AboutSkeleton />;
  }

  return (
    <section id="about" className="relative">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            About Nayo
          </h2>
          <p className="mt-4 text-muted-foreground">
            Nayo helps individuals and businesses earn, learn, and collaborate
            safely in one secure digital ecosystem.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-10 md:grid-cols-2">
          <Block
            title="Our Mission"
            text="Empowering individuals and businesses to earn, learn, and collaborate safely through a secure, transparent, and community-driven platform."
          />
          <Block
            title="Our Vision"
            text="To become the leading global platform for freelance services, digital products, and collaborative partnerships—where trust, learning, and growth come together."
          />
        </div>

        {/* What We Do */}
        <div className="mt-16">
          <h3 className="text-lg font-medium">
            What Nayo Does
          </h3>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Feature title="Marketplace with Escrow">
              Buy and sell services or digital products confidently using secure
              escrow payments.
            </Feature>
            <Feature title="Partnerships & Collaboration">
              Create and manage projects with clear roles, shared goals, and
              accountability.
            </Feature>
            <Feature title="Community & Learning">
              Join discussions, webinars, and skill-building sessions with
              like-minded professionals.
            </Feature>
            <Feature title="Job Insights">
              Access real-time trends and market data to make smarter decisions.
            </Feature>
            <Feature title="Trust & Transparency">
              Secure transactions, clear processes, and built-in data protection.
            </Feature>
            <Feature title="All-in-One Platform">
              Everything you need to earn, learn, and collaborate in one place.
            </Feature>
          </div>
        </div>

        {/* Story */}
        <div className="mt-20 max-w-3xl">
          <h3 className="text-lg font-medium">
            Our Story
          </h3>
          <p className="mt-4 text-muted-foreground">
            Nayo was founded by tech enthusiasts and entrepreneurs who saw the
            need for a safer, more collaborative digital services platform.
          </p>
          <p className="mt-4 text-muted-foreground">
            Since 2023, Nayo has grown into a platform supporting freelancers,
            creators, and businesses worldwide—built on trust, learning, and
            collaboration.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable Blocks                                                     */
/* ------------------------------------------------------------------ */

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-base sm:text-lg font-medium">{title}</h3>
      <p className="mt-3 text-muted-foreground">{text}</p>
    </div>
  );
}

function Feature({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h4 className="font-medium">{title}</h4>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton Loader                                                     */
/* ------------------------------------------------------------------ */

function AboutSkeleton() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 animate-pulse">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="mt-4 h-4 w-full max-w-md rounded bg-muted" />
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-10 md:grid-cols-2">
          <SkeletonBlock />
          <SkeletonBlock />
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="mt-3 h-3 w-full rounded bg-muted" />
              <div className="mt-2 h-3 w-5/6 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkeletonBlock() {
  return (
    <div>
      <div className="h-4 w-32 rounded bg-muted" />
      <div className="mt-3 h-3 w-full rounded bg-muted" />
      <div className="mt-2 h-3 w-5/6 rounded bg-muted" />
    </div>
  );
}
