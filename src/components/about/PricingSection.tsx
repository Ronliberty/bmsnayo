// components/about/PricingSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: 'for 21 days',
    description: 'Try everything risk-free before deciding.',
    features: [
      'Full access to marketplace (browse & buy)',
      'Access to all partnerships & collaborations',
      'Networking opportunities',
      'Community & learning resources',
      'Job insights & market trends',
      'Secure escrow (limited to trial)',
      'No vendor selling privileges',
    ],
    buttonText: 'Start 21-Day Trial',
    buttonVariant: 'outline',
    popular: false,
  },
  {
    name: 'Membership',
    price: '$10',
    period: 'month',
    description: 'Affordable access to core features for ongoing use.',
    features: [
      'Unlimited marketplace access (buy & browse)',
      'Create & join public/private partnerships',
      'Networking & collaboration tools',
      'Community discussions & webinars',
      'Advanced job insights',
      'Secure escrow for transactions',
      'No vendor selling (buyer-only)',
    ],
    buttonText: 'Choose Membership',
    buttonVariant: 'default',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$20',
    period: 'month',
    description: 'Full vendor capabilities for serious sellers & creators.',
    features: [
      'All Membership features',
      'Sell services & digital products as vendor',
      'Create & manage partnerships as owner',
      'Priority visibility in marketplace',
      'Unlimited listings & advanced analytics',
      'Enhanced networking & collaboration tools',
      'Priority support',
    ],
    buttonText: 'Go Pro',
    buttonVariant: 'default',
    popular: false,
  },
];

const PricingSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PricingSkeleton />;
  }

  return (
    <section id="pricing" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Start with a 21-day free trial — no credit card required. Upgrade anytime to unlock full features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-card rounded-2xl shadow-xl border border-border overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary scale-105 z-10' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
                  Recommended
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-2">/{plan.period}</span>}
                </div>
                <p className="text-muted-foreground mb-8">{plan.description}</p>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary mr-3 text-xl">✓</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard/subscription"
                  className={`w-full block text-center py-3 px-6 rounded-md font-medium transition ${
                    plan.buttonVariant === 'default'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust & Escrow Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center max-w-3xl mx-auto"
        >
          <p className="text-lg text-muted-foreground">
            Every plan includes <span className="font-semibold text-foreground">secure escrow protection</span> — pay only when you're satisfied. 
            Upgrade or cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const PricingSkeleton: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-12 bg-muted animate-pulse rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-muted animate-pulse rounded w-2/3 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl shadow-xl border border-border p-8"
            >
              <div className="h-8 bg-muted animate-pulse rounded w-1/2 mb-2"></div>
              <div className="h-10 bg-muted animate-pulse rounded w-1/3 mb-6"></div>
              <div className="h-5 bg-muted animate-pulse rounded w-3/4 mb-8"></div>
              <div className="space-y-4 mb-10">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="h-5 bg-muted animate-pulse rounded w-full"></div>
                ))}
              </div>
              <div className="h-12 bg-muted animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;