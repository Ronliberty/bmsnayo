// src/components/about/TestimonialSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  name: string;
  title: string;
  company?: string;
  photo: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    title: "Freelance Designer",
    company: "Creative Co.",
    photo: "/images/testimonials/sarah.jpg",
    quote:
      "Nayo transformed the way I manage clients and collaborations. The escrow system makes every transaction worry-free!",
  },
  {
    name: "David Kim",
    title: "Entrepreneur",
    company: "TechStart",
    photo: "/images/testimonials/david.jpg",
    quote:
      "The partnership hub allowed my team to scale projects efficiently. We can track milestones and profits without confusion.",
  },
  {
    name: "Aisha Mbogo",
    title: "Digital Creator",
    company: "ContentPro",
    photo: "/images/testimonials/aisha.jpg",
    quote:
      "I love the community learning and insights feed. Staying updated with trends has never been easier!",
  },
];

export default function Testimonial() {
  const [loading, setLoading] = useState(true);

  // simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <TestimonialSkeleton />;

  return (
    <section id="testimonials" className="relative pt-24 pb-20 bg-background">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          What Our Users Say
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Nayo helps freelancers, creators, and entrepreneurs earn, learn, and collaborate with confidence.
        </p>

        {/* Testimonials Grid */}
        <motion.div
          className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            show: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="rounded-lg border border-border p-6 bg-card text-left flex flex-col items-center"
            >
              <img
                src={t.photo}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <p className="mt-4 text-sm text-muted-foreground">"{t.quote}"</p>
              <h4 className="mt-4 font-medium">{t.name}</h4>
              <p className="text-xs text-muted-foreground">
                {t.title} {t.company ? `@ ${t.company}` : ""}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* Skeleton Loader Component */
function TestimonialSkeleton() {
  return (
    <section className="relative pt-24 pb-20 bg-background animate-pulse">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Header Skeleton */}
        <div className="h-6 w-48 rounded bg-muted mx-auto" />
        <div className="mt-3 h-4 w-80 rounded bg-muted mx-auto" />

        {/* Testimonials Grid Skeleton */}
        <div className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-6 flex flex-col items-center"
            >
              {/* Circle photo */}
              <div className="w-16 h-16 rounded-full bg-muted" />

              {/* Quote */}
              <div className="mt-4 h-12 w-5/6 rounded bg-muted" />

              {/* Name */}
              <div className="mt-4 h-4 w-32 rounded bg-muted" />

              {/* Title/Company */}
              <div className="mt-2 h-3 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
