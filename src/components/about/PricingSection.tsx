// src/components/about/PricingSection.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PricingSkeleton />;

  const plans = [
    {
      title: "Free",
      price: billing === "monthly" ? "Free" : "Free",
      benefits: ["Marketplace access", "Community & learning", "Basic insights"],
      popular: false,
    },
    {
      title: "Pro",
      price: billing === "monthly" ? "$29/mo" : "$290/yr",
      benefits: ["Advanced analytics", "Priority support", "Premium visibility"],
      popular: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      benefits: ["Custom integrations", "Team dashboards", "Dedicated support"],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        
        {/* Section Header */}
        <h2 className="text-3xl font-semibold tracking-tight">
          Plans & Pricing
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Choose the plan that best fits your goals — from getting started to scaling up.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded-md ${billing === "monthly" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md ${billing === "annual" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
            onClick={() => setBilling("annual")}
          >
            Annual
          </button>
        </div>

        {/* Plan Cards */}
        <motion.div className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-lg border border-border p-6 ${
                plan.popular ? "bg-accent/10 border-accent" : "bg-card"
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-2 py-1 text-xs font-bold text-accent">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold mt-2">{plan.title}</h3>
              <p className="mt-4 text-3xl font-bold">{plan.price}</p>

              <ul className="mt-4 space-y-2 text-sm text-muted-foreground text-left">
                {plan.benefits.map((b, idx) => (
                  <li key={idx}>• {b}</li>
                ))}
              </ul>

              <button className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition">
                Get Started
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* Pricing skeleton can be similar to before */
function PricingSkeleton() {
  return (
    <section className="relative animate-pulse">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="h-6 w-48 rounded bg-muted mx-auto" />
        <div className="mt-4 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="mt-3 h-8 w-20 rounded bg-muted mx-auto" />
              <div className="mt-4 space-y-2">
                <div className="h-3 rounded bg-muted" />
                <div className="h-3 rounded bg-muted w-5/6 mx-auto" />
              </div>
              <div className="mt-6 h-8 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
