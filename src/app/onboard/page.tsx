"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Onboard wizard — enriched with Nayo’s mission & offerings.
 * Static content, production-ready with mock data.
 */

const steps = [
  "Welcome",
  "Marketplace",
  "Partnerships",
  "Jobs & News",
  "Seller Program",
  "Learning & Support",
  "Complete",
];

export default function Onboard() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const goToDashboard = () => router.push("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome to Nayo</h1>
              <p className="text-sm text-muted-foreground mt-1">
                A freelancer helper app — connecting freelancers, clients, and businesses with tools,
                resources, and secure opportunities.
              </p>
            </div>

            {/* Simple progress indicator */}
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-xs text-muted-foreground">Step</span>
              <div className="font-semibold">
                {step + 1}/{steps.length}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                aria-hidden
              />
            </div>
          </div>

          {/* Wizard content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {/* 1. Welcome */}
            {step === 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Welcome 👋</h2>
                <p className="text-muted-foreground">
                  Nayo is built for freelancers, by freelancers. Our mission is to create a secure,
                  empowering, and transparent ecosystem where you can work, earn, and grow with confidence.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 mt-4">
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold">Quick Start</h3>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>• Set up your profile</li>
                      <li>• Explore the marketplace</li>
                      <li>• Join a webinar or community session</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold">All-in-One Platform</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Jobs, marketplace, partnerships, learning, and live agent support — all for just
                      $20/month.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 2. Marketplace */}
            {step === 1 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Marketplace — secure by design</h2>
                <p className="text-muted-foreground">
                  Buy and sell apps, websites, accounts, and services. Every transaction is protected
                  with escrow, transparent disputes, and community-rated sellers.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="p-3 border border-border rounded-lg bg-background">
                    <div className="text-sm font-semibold">E-commerce Template</div>
                    <div className="text-xs text-muted-foreground mt-1">$1,200 • verified seller</div>
                  </div>
                  <div className="p-3 border border-border rounded-lg bg-background">
                    <div className="text-sm font-semibold">SaaS Analytics App</div>
                    <div className="text-xs text-muted-foreground mt-1">$3,500 • vetted seller</div>
                  </div>
                  <div className="p-3 border border-border rounded-lg bg-background">
                    <div className="text-sm font-semibold">Freelance Account</div>
                    <div className="text-xs text-muted-foreground mt-1">$150 • escrow-backed</div>
                  </div>
                </div>
              </section>
            )}

            {/* 3. Partnerships */}
            {step === 2 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Partnerships — earn & collaborate</h2>
                <p className="text-muted-foreground">
                  Join referral and partnership programs to earn commissions, bonuses, or reduced fees.
                  We also partner with businesses for account management, software upgrades, and social
                  media management.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• Influencer Program — 10% recurring commissions</li>
                  <li>• Freelancer Growth — $25 per verified signup</li>
                  <li>• Seller Partnerships — priority listings & reduced fees</li>
                </ul>
              </section>
            )}

            {/* 4. Jobs & News */}
            {step === 3 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Jobs & Daily News</h2>
                <p className="text-muted-foreground">
                  Stay ahead with curated freelance jobs, market trends, and industry updates.
                  Delivered daily to your dashboard and inbox.
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="text-sm font-semibold">Top Job</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Frontend React Developer • Remote • $500
                    </div>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="text-sm font-semibold">Market Insight</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Freelance SaaS sales up 12% this quarter.
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 5. Seller Program */}
            {step === 4 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Seller Program — build trust</h2>
                <p className="text-muted-foreground">
                  Verified sellers gain access to tools for listing, analytics, escrow protection,
                  and priority placement. Build credibility while selling safely.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• Dashboard with metrics & conversion data</li>
                  <li>• Verification checks for high-value items</li>
                  <li>• Payouts via PayPal, Crypto, or bank</li>
                </ul>
              </section>
            )}

            {/* 6. Learning & Support */}
            {step === 5 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Learning & Agent Support</h2>
                <p className="text-muted-foreground">
                  Weekly webinars, tutorials, and expert guidance. Plus, one-on-one sessions with
                  dedicated agents via Google Meet or Zoom to help with jobs, assessments, and
                  projects.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="text-sm font-semibold">Community Webinars</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Training, insights, and networking every week.
                    </div>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="text-sm font-semibold">Dedicated Agents</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Live support for career growth & projects.
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 7. Complete */}
            {step === 6 && (
              <section className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">You’re all set 🚀</h2>
                <p className="text-muted-foreground">
                  Nayo is your freelance ecosystem. Get started today:
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="font-semibold">Complete Profile</div>
                    <div className="text-xs text-muted-foreground mt-1">Add bio & photo</div>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="font-semibold">Deposit Funds</div>
                    <div className="text-xs text-muted-foreground mt-1">Enable escrow transactions</div>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="font-semibold">Join a Webinar</div>
                    <div className="text-xs text-muted-foreground mt-1">Learn & network weekly</div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  Need help? Reach out to a live agent or visit the Help Center.
                </p>
              </section>
            )}
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <div>
              {step > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  ← Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground hidden sm:block">
                {step < steps.length - 1
                  ? "Swipe through the tour or use Next"
                  : "You're ready!"}
              </div>

              {step < steps.length - 1 ? (
                <Button onClick={nextStep}>
                  {step === steps.length - 2 ? "Finish tour" : "Next"}
                </Button>
              ) : (
                <Button onClick={goToDashboard} className="bg-primary text-primary-foreground">
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
