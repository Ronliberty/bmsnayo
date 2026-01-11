// components/about/FaqsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is secure escrow and how does it work on Nayo?",
    answer: "Secure escrow holds buyer funds until the seller completes the work to your satisfaction. Funds are released automatically upon approval or held for dispute resolution. This protects both parties and ensures trust in every transaction.",
    category: "Security",
  },
  {
    question: "What's the difference between Membership ($10) and Pro ($20)?",
    answer: "Membership gives you full buyer access, partnerships, and networking. Pro unlocks vendor selling, unlimited listings, priority visibility, and partnership ownership. Both include secure escrow.",
    category: "Pricing",
  },
  {
    question: "Do I need a credit card for the 21-day free trial?",
    answer: "No! Start your 21-day trial instantly without any payment details. Upgrade to Membership or Pro anytime during or after the trial with flexible monthly billing.",
    category: "Pricing",
  },
  {
    question: "Can I create private partnerships on the Free Trial?",
    answer: "Yes! The 21-day trial gives you full access to create and join public/private partnerships, networking, and collaboration tools. Only vendor selling requires Pro.",
    category: "Partnerships",
  },
  {
    question: "What types of services can I sell on Nayo?",
    answer: "Pro users can sell freelance services (design, development, writing), digital products (templates, courses, eBooks), consulting, and more. All backed by secure escrow protection.",
    category: "Marketplace",
  },
  {
    question: "How do partnerships work on Nayo?",
    answer: "Create projects with clear roles, milestones, responsibilities, and shared goals. Invite collaborators, track progress, and use built-in communication. Perfect for teams and joint ventures.",
    category: "Partnerships",
  },
  {
    question: "What happens if there's a dispute in a transaction?",
    answer: "Our resolution team reviews work, communication, and milestones. Funds are released, returned, or split fairly. Less than 1% of transactions need disputes thanks to our escrow system.",
    category: "Security",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! Cancel anytime from your account settings. No long-term contracts. Membership and Pro are month-to-month with prorated refunds for unused time.",
    category: "Pricing",
  },
  {
    question: "Are there any transaction fees?",
    answer: "Nayo charges a 5-8% service fee on completed transactions (industry standard). This covers escrow processing, platform maintenance, and support. No fees on trial or canceled work.",
    category: "Pricing",
  },
  {
    question: "How do I get job insights and market trends?",
    answer: "All plans include real-time data on in-demand skills, pricing trends, and market demand. Pro users get advanced analytics and priority search visibility.",
    category: "Features",
  },
];

const FaqsSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['All', 'Pricing', 'Security', 'Partnerships', 'Marketplace', 'Features'];

  const filteredFaqs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  if (isLoading) {
    return <FaqsSkeleton />;
  }

  return (
    <section id="faqs" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about pricing, security, partnerships, and getting started on Nayo
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-card text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 bg-card rounded-xl shadow-md border border-border hover:shadow-lg transition-all group-hover:bg-accent/5"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
                  <div>
                    <h4 className="font-semibold text-foreground text-left">{faq.question}</h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mt-1 inline-block">
                      {faq.category}
                    </span>
                  </div>
                </div>
                <AnimatePresence>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-primary transition-transform" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </AnimatePresence>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-muted-foreground leading-relaxed text-sm md:text-base bg-card/50 border-t border-border/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Still have questions? We're here to help.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all text-lg shadow-lg hover:shadow-xl"
          >
            Contact Support
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const FaqsSkeleton: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-12 bg-muted animate-pulse rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-muted animate-pulse rounded w-2/3 mx-auto"></div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded-full w-20"></div>
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-muted animate-pulse rounded-full"></div>
                  <div>
                    <div className="h-6 bg-muted animate-pulse rounded w-64 mb-2"></div>
                    <div className="h-5 bg-muted animate-pulse rounded w-20"></div>
                  </div>
                </div>
                <div className="w-5 h-5 bg-muted animate-pulse rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqsSection;