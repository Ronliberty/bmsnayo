// components/about/BlogSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const blogPosts = [
  {
    title: "How Secure Escrow Protects Buyers and Sellers in 2026",
    excerpt: "Explore why escrow is the gold standard for digital transactions and how Nayo implements it for maximum trust.",
    author: "Nayo Team",
    date: "January 5, 2026",
    image: "https://a.storyblok.com/f/99519/2200x1240/2e549ab276/blog-20455670-freelancers-10-07-2022_2x.png/m/1600x900/filters:format(png)",
    category: "Security",
  },
  {
    title: "Top 10 Skills in Demand for Freelancers This Year",
    excerpt: "Stay ahead of the curve with the most sought-after skills in the freelance marketplace right now.",
    author: "Jane Muthoni",
    date: "December 28, 2025",
    image: "https://verpex.com/assets/uploads/images/blog/How-to-Become-a-Freelance-Illustrator.webp?v=1719403150",
    category: "Skills & Learning",
  },
  {
    title: "Building Successful Partnerships: A Guide for Nayo Users",
    excerpt: "Learn how to create, manage, and scale collaborative projects using Nayo's powerful partnership tools.",
    author: "Michael Kariuki",
    date: "December 15, 2025",
    image: "https://a.storyblok.com/f/99519/1100x620/7390e4b4eb/freelancer_project_management.png/m/1600x900/filters:format(png)",
    category: "Collaboration",
  },
  {
    title: "From Side Hustle to Full-Time: Real Nayo Success Stories",
    excerpt: "Inspiring journeys of freelancers who turned their passion into sustainable businesses on our platform.",
    author: "Nayo Team",
    date: "November 30, 2025",
    image: "https://a.storyblok.com/f/99519/1100x620/56c47132a8/blog-wfh.png/m/1600x900/filters:format(png)",
    category: "Success Stories",
  },
];

const BlogsSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <BlogsSkeleton />;
  }

  return (
    <section id="blog" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Latest Insights & Updates
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay informed with expert tips, success stories, and the latest trends in freelancing, collaboration, and digital services
          </p>
        </motion.div>

        {/* Featured Blog Post */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-2xl overflow-hidden shadow-xl border border-border">
            <div className="relative h-64 md:h-full">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                  {blogPosts[0].category}
                </span>
                <span className="text-sm text-muted-foreground">{blogPosts[0].date}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {blogPosts[0].title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">By {blogPosts[0].author}</span>
                <Link href="/blog" className="text-primary font-medium hover:underline">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl overflow-hidden shadow-md border border-border hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">By {post.author}</span>
                  <Link href="/blog" className="text-primary hover:underline">
                    Read →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/blog"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition text-lg"
          >
            View All Blog Posts
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const BlogsSkeleton: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-12 bg-muted animate-pulse rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-muted animate-pulse rounded w-2/3 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="h-80 bg-muted animate-pulse rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded w-1/4"></div>
            <div className="h-10 bg-muted animate-pulse rounded w-3/4"></div>
            <div className="h-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
              <div className="h-48 bg-muted animate-pulse"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                <div className="h-6 bg-muted animate-pulse rounded w-4/5"></div>
                <div className="h-20 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;