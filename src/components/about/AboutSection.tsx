// components/about/AboutSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AboutSkeleton />;
  }

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            About Nayo
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nayo helps individuals and businesses earn, learn, and collaborate safely in one secure digital ecosystem.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card p-8 rounded-lg shadow-md border border-border"
          >
            <h3 className="text-2xl font-semibold text-primary mb-4">Our Mission</h3>
            <p className="text-muted-foreground">
              Empowering individuals and businesses to earn, learn, and collaborate safely through a secure, transparent, and community-driven platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card p-8 rounded-lg shadow-md border border-border"
          >
            <h3 className="text-2xl font-semibold text-primary mb-4">Our Vision</h3>
            <p className="text-muted-foreground">
              To become the leading global platform for freelance services, digital products, and collaborative partnerships—where trust, learning, and growth come together.
            </p>
          </motion.div>
        </div>

        {/* What Nayo Does - Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-foreground mb-8">What Nayo Does</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Marketplace with Escrow",
              description: "Buy and sell services or digital products confidently using secure escrow payments.",
              icon: "🛒"
            },
            {
              title: "Partnerships & Collaboration",
              description: "Create and manage projects with clear roles, shared goals, and accountability.",
              icon: "🤝"
            },
            {
              title: "Community & Learning",
              description: "Join discussions, webinars, and skill-building sessions with like-minded professionals.",
              icon: "📚"
            },
            {
              title: "Job Insights",
              description: "Access real-time trends and market data to make smarter decisions.",
              icon: "📊"
            },
            {
              title: "Trust & Transparency",
              description: "Secure transactions, clear processes, and built-in data protection.",
              icon: "🔒"
            },
            {
              title: "All-in-One Platform",
              description: "Everything you need to earn, learn, and collaborate in one place.",
              icon: "🌐"
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center max-w-4xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-foreground mb-6">Our Story</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Nayo was founded by tech enthusiasts and entrepreneurs who saw the need for a safer, more collaborative digital services platform.
          </p>
          <p className="text-lg text-muted-foreground">
            Since 2023, Nayo has grown into a platform supporting freelancers, creators, and businesses worldwide—built on trust, learning, and collaboration.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const AboutSkeleton: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-12 bg-muted animate-pulse rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-muted animate-pulse rounded w-2/3 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-card p-8 rounded-lg shadow-md border border-border">
              <div className="h-8 bg-muted animate-pulse rounded w-1/2 mb-4"></div>
              <div className="h-24 bg-muted animate-pulse rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="w-12 h-12 bg-muted animate-pulse rounded-full mb-4"></div>
              <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-3"></div>
              <div className="h-20 bg-muted animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;