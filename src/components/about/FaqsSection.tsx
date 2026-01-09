// src/components/about/FaqsSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Faq {
  question: string;
  answer: string;
}

const faqs: Faq[] = [
  {
    question: "What is Nayo?",
    answer:
      "Nayo is an all-in-one platform for freelancers, creators, and entrepreneurs to buy/sell services, access digital products, form partnerships, and learn new skills safely.",
  },
  {
    question: "How does the escrow system work?",
    answer:
      "Payments are held in escrow until the work is approved by the buyer, ensuring secure transactions and reducing risk for both parties.",
  },
  {
    question: "Can I collaborate with other users?",
    answer:
      "Yes! The Partnership Hub allows you to create collaborative projects with clear roles, timelines, and profit-sharing agreements.",
  },
  {
    question: "Is there a community for learning?",
    answer:
      "Absolutely. Nayo offers chat rooms, webinars, and skill-building resources so users can share knowledge and grow professionally.",
  },
];

export default function FaqsSection() {
  const [loading, setLoading] = useState(true);

  // simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <FaqsSkeleton />;

  return (
    <section id="faqs" className="relative py-24 bg-background">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Find answers to the most common questions about Nayo.
        </p>

        <motion.div
          className="mt-10 flex flex-col gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
              className="border border-border rounded-lg p-4 bg-card text-left"
            >
              <FaqItem faq={faq} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* Single FAQ Accordion Item */
function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left text-sm font-medium text-foreground"
      >
        {faq.question}
        <span className="ml-2">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 text-muted-foreground text-sm"
        >
          {faq.answer}
        </motion.div>
      )}
    </div>
  );
}

/* Skeleton Loader */
function FaqsSkeleton() {
  return (
    <section className="relative py-24 bg-background animate-pulse">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Header Skeleton */}
        <div className="h-6 w-56 rounded bg-muted mx-auto" />
        <div className="mt-3 h-4 w-80 rounded bg-muted mx-auto" />

        {/* FAQ Skeleton Items */}
        <div className="mt-10 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border border-border rounded-lg p-4 bg-card"
            >
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-4 w-full rounded bg-muted" />
              <div className="mt-1 h-4 w-5/6 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
