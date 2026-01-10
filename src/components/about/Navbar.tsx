// components/about/Navbar.tsx
'use client'; // Enable client-side rendering for interactivity

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Assuming framer-motion is installed

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demonstration; in real app, tie to actual loading logic
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    if (isOpen) {
      setIsOpen(false);
    }
  };

  if (isLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <nav className="bg-background shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Nayo
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="#about"
              onClick={(e) => handleSmoothScroll(e, '#about')}
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
            <Link
              href="#pricing"
              onClick={(e) => handleSmoothScroll(e, '#pricing')}
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              onClick={(e) => handleSmoothScroll(e, '#testimonials')}
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Testimonials
            </Link>
            <Link
              href="#partners"
              onClick={(e) => handleSmoothScroll(e, '#partners')}
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Partners
            </Link>
            <Link
              href="#blog"
              onClick={(e) => handleSmoothScroll(e, '#blog')}
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              href="#faqs"
              onClick={(e) => handleSmoothScroll(e, '#faqs')}
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              FAQs
            </Link>
            <Link
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </Link>
            <Link
              href="/auth/login"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="#about"
              onClick={(e) => handleSmoothScroll(e, '#about')}
              className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              href="#pricing"
              onClick={(e) => handleSmoothScroll(e, '#pricing')}
              className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              onClick={(e) => handleSmoothScroll(e, '#testimonials')}
              className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            >
              Testimonials
            </Link>
            <Link
              href="#partners"
              onClick={(e) => handleSmoothScroll(e, '#partners')}
              className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            >
              Partners
            </Link>
            <Link
              href="#blog"
              onClick={(e) => handleSmoothScroll(e, '#blog')}
              className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            >
              Blog
            </Link>
            <Link
              href="#faqs"
              onClick={(e) => handleSmoothScroll(e, '#faqs')}
              className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            >
              FAQs
            </Link>
            <Link
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
              className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
            <Link
              href="/auth/login"
              className="block bg-primary text-primary-foreground px-3 py-2 rounded-md text-base font-medium hover:bg-primary/90"
            >
              Login
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavbarSkeleton: React.FC = () => {
  return (
    <nav className="bg-background shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="w-24 h-8 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-20 h-4 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;