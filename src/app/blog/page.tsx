// app/blog/page.tsx
// Updated with Home button in the header

import Link from 'next/link';
import { Calendar, Clock, User, Home } from 'lucide-react';

export const metadata = {
  title: 'Nayo Blog - Insights, Tips & Success Stories',
  description: 'Latest articles on freelancing, digital products, secure collaborations, and growing your skills on Nayo.',
};

const blogPosts = [
  {
    id: 1,
    title: "How Secure Escrow Protects Buyers and Sellers in 2026",
    excerpt: "Discover why escrow has become the gold standard for digital transactions and how Nayo makes it seamless and trustworthy.",
    author: "Nayo Team",
    date: "January 5, 2026",
    readTime: "6 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1563986768609-620da13593e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    slug: "secure-escrow-2026",
  },
  {
    id: 2,
    title: "Top 10 In-Demand Skills for Freelancers This Year",
    excerpt: "Stay competitive in 2026 with the skills that clients are actively searching for on Nayo and beyond.",
    author: "Jane Muthoni",
    date: "December 28, 2025",
    readTime: "8 min read",
    category: "Skills & Learning",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
    slug: "top-skills-2026",
  },
  {
    id: 3,
    title: "Building Successful Partnerships: A Complete Guide",
    excerpt: "Learn how to create, manage, and scale collaborative projects using Nayo's powerful partnership tools.",
    author: "Michael Kariuki",
    date: "December 15, 2025",
    readTime: "7 min read",
    category: "Collaboration",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    slug: "building-partnerships-guide",
  },
  {
    id: 4,
    title: "From Side Hustle to Full-Time: Real Nayo Success Stories",
    excerpt: "Inspiring real journeys of freelancers who turned their passion into sustainable businesses on our platform.",
    author: "Nayo Team",
    date: "November 30, 2025",
    readTime: "9 min read",
    category: "Success Stories",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80",
    slug: "success-stories-2025",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Home Button */}
      
<header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
    {/* Left: Home */}
    <Link
      href="/"
      className="flex items-center gap-2.5 text-lg font-semibold text-primary hover:text-primary/90 transition-colors"
    >
      <Home className="h-5 w-5" />
      <span>Home</span>
    </Link>

    {/* Center: Page Title */}
    <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-bold text-foreground pointer-events-none">
      Nayo Blog
    </h1>

    {/* Right: Learn More / About */}
    <Link
      href="/about"  // ← use lowercase /about (consistent with your existing route)
      className="flex items-center gap-2.5 text-lg font-semibold text-primary hover:text-primary/90 transition-colors"
    >
      <span>Learn More</span>
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </Link>
  </div>
</header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-primary font-medium mb-4">
            Insights & Knowledge
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Latest from Nayo
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover expert tips, success stories, security insights, and the latest trends in freelancing and collaboration.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link 
                key={post.id}
                href={`/blog/${post.slug}`}
                className='group block'>
              <article
                key={post.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                   
                      {post.title}
              
                  </h2>

                  <p className="text-muted-foreground mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </article>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition">
              Load More Articles
            </button>
          </div>
        </div>
        
      </section>
    </div>
  );
}