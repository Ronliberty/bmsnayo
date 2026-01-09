// src/components/about/BlogsSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Blog {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image?: string;
  link: string;
}

const blogs: Blog[] = [
  {
    title: "Maximizing Productivity with Nayo",
    excerpt:
      "Learn how freelancers and entrepreneurs can streamline their workflows using Nayo’s all-in-one platform.",
    author: "Elaina Cohen",
    date: "Jan 10, 2026",
    image: "/images/blogs/productivity.jpg",
    link: "/blog/maximizing-productivity",
  },
  {
    title: "Safe Transactions with Escrow",
    excerpt:
      "Discover how Nayo’s escrow system protects both buyers and sellers, making freelancing more secure.",
    author: "Elaina Cohen",
    date: "Jan 5, 2026",
    image: "/images/blogs/escrow.jpg",
    link: "/blog/safe-transactions",
  },
  {
    title: "Building Partnerships that Scale",
    excerpt:
      "Tips and strategies for forming collaborative projects on Nayo and growing your business safely.",
    author: "Elaina Cohen",
    date: "Dec 28, 2025",
    image: "/images/blogs/partnerships.jpg",
    link: "/blog/building-partnerships",
  },
];

export default function BlogsSection() {
  const [loading, setLoading] = useState(true);

  // Simulate async loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <BlogsSkeleton />;

  return (
    <section id="blogs" className="relative py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          From Our Blog
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Insights, tips, and updates to help freelancers, entrepreneurs, and creators succeed.
        </p>

        <motion.div
          className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            show: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {blogs.map((blog, i) => (
            <motion.a
              key={i}
              href={blog.link}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-6 text-left flex flex-col flex-1">
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{blog.excerpt}</p>
                <div className="mt-4 text-xs text-muted-foreground">
                  By {blog.author} • {blog.date}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* Skeleton Loader Component */
function BlogsSkeleton() {
  return (
    <section className="relative py-24 bg-background animate-pulse">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Header Skeleton */}
        <div className="h-6 w-48 rounded bg-muted mx-auto" />
        <div className="mt-3 h-4 w-80 rounded bg-muted mx-auto" />

        {/* Blog Cards Skeleton */}
        <div className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-lg border border-border bg-card overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="h-48 w-full bg-muted" />

              <div className="p-6 flex flex-col flex-1">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-5/6 rounded bg-muted" />
                <div className="mt-4 h-3 w-32 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
