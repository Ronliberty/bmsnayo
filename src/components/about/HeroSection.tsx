// components/about/HeroSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  return (
    <section id="hero" className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Earn, Learn, and Collaborate in One Place
          </h1>
          <p className="text-lg sm:text-xl mb-8">
            Nayo is an all-in-one platform for buying and selling services, accessing digital products, forming partnerships, and growing your skills — backed by secure escrow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/auth/register"
              className="bg-background text-foreground px-6 py-3 rounded-md font-medium hover:bg-background/90 transition"
            >
              Get Started
            </Link>
            <Link
              href="#hows"
          onClick={(e) => handleSmoothScroll(e, '#hows')}
              className="bg-accent text-accent-foreground px-6 py-3 rounded-md font-medium hover:bg-accent/90 transition"
            >
              How it Works
            </Link>
          </div>
        </motion.div>

        {/* Image or Illustration - Using selected online image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <img
            src="https://thumbs.dreamstime.com/z/digital-business-team-collaboration-web-development-flat-design-illustration-showcases-diverse-team-professionals-417190923.jpg"
            alt="Diverse professionals collaborating on a digital platform"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </motion.div>
      </div>

      {/* Optional decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="50" cy="50" r="50" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
};

const HeroSkeleton: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary to-secondary py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <div className="h-12 sm:h-16 bg-muted animate-pulse rounded mb-4 w-3/4 mx-auto md:mx-0"></div>
          <div className="h-6 bg-muted animate-pulse rounded mb-8 w-1/2 mx-auto md:mx-0"></div>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
            <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
          </div>
        </div>
        <div className="w-full h-64 md:h-96 bg-muted animate-pulse rounded-lg"></div>
      </div>
    </section>
  );
};

export default HeroSection;