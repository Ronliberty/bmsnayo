// components/about/PartnersSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const partners = [
  
  {
    name: "Elante",
    logo: "https://via.placeholder.com/180x90/000000/FFFFFF?text=FreelancePro",
    description: "Global platform for professional freelancers and service providers",
  },
  {
    name: "Bitlymindsystem",
    logo: "https://via.placeholder.com/180x90/000000/FFFFFF?text=SkillForge",
    description: "Premier online learning partner for skill development and certification",
  },
  
];

const PartnersSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PartnersSkeleton />;
  }

  return (
    <section id="partners" className="py-16 md:py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Our Trusted Partners
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We collaborate with industry leaders to provide the best tools, security, and opportunities for our community
          </p>
        </motion.div>

        {/* Hero-style partnership visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border"
        >
          <img
            src="https://thumbs.dreamstime.com/b/digital-handshake-symbolizing-partnership-image-depicts-formed-two-hands-outlined-wireframe-style-connected-423919786.jpg"
            alt="Digital handshake symbolizing strong business partnerships"
            className="w-full h-auto object-cover max-h-96"
          />
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-4 p-4 bg-card rounded-xl shadow-md border border-border transition-transform group-hover:scale-105">
                {/* In production, replace with actual partner logos */}
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{partner.name}</h4>
              <p className="text-sm text-muted-foreground">{partner.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-foreground mb-6">
            Interested in partnering with Nayo?
          </p>
          <a
            href="#contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition text-lg"
          >
            Become a Partner
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const PartnersSkeleton: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-12 bg-muted animate-pulse rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-muted animate-pulse rounded w-2/3 mx-auto"></div>
        </div>

        <div className="mb-16 h-96 bg-muted animate-pulse rounded-2xl"></div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="mb-4 p-4 bg-card rounded-xl shadow-md border border-border h-24 w-full animate-pulse"></div>
              <div className="h-5 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;