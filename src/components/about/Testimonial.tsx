// components/about/Testimonial.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Kimani",
    role: "Freelance Graphic Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    content: "Nayo changed how I run my freelance business. The secure escrow gives me peace of mind when working with new clients, and the partnership tools helped me collaborate on bigger projects. Best decision I made this year!",
    rating: 5,
  },
  {
    name: "James Mwangi",
    role: "Digital Product Creator",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    content: "As a vendor, the Pro plan is worth every penny. I can now sell my courses and templates directly with full visibility, and the built-in escrow protects both me and my buyers. The community learning sessions are a bonus!",
    rating: 5,
  },
  {
    name: "Aisha Otieno",
    role: "Small Business Owner",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80",
    content: "I started with the 21-day trial and immediately saw the value. The ability to create private partnerships with clear roles and accountability has helped my team deliver projects faster and more professionally.",
    rating: 4,
  },
  {
    name: "David Omondi",
    role: "Web Developer & Consultant",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    content: "The networking features alone are incredible. I've connected with amazing collaborators through Nayo and closed deals I wouldn't have found anywhere else. Secure payments make it stress-free.",
    rating: 5,
  },
];

const Testimonial: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return <TestimonialSkeleton />;
  }

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hear from freelancers, creators, and businesses who are thriving on Nayo
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  position: activeIndex === index ? 'relative' : 'absolute',
                }}
                transition={{ duration: 0.7 }}
                className="bg-card p-8 md:p-12 rounded-2xl shadow-xl border border-border"
                style={{ display: activeIndex === index ? 'block' : 'none' }}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex-shrink-0">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-2xl ${i < testimonial.rating ? 'text-yellow-400' : 'text-muted'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <blockquote className="text-lg md:text-xl italic text-foreground mb-6">
                      "{testimonial.content}"
                    </blockquote>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index
                    ? 'bg-primary w-8'
                    : 'bg-muted hover:bg-primary/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialSkeleton: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-12 bg-muted animate-pulse rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-muted animate-pulse rounded w-2/3 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto bg-card p-12 rounded-2xl shadow-xl border border-border">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-24 h-24 bg-muted animate-pulse rounded-full"></div>
            <div className="flex-1">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-muted animate-pulse rounded-full mx-1"></div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-muted animate-pulse rounded w-full"></div>
                <div className="h-6 bg-muted animate-pulse rounded w-full"></div>
                <div className="h-6 bg-muted animate-pulse rounded w-3/4"></div>
              </div>
              <div className="mt-6">
                <div className="h-5 bg-muted animate-pulse rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;