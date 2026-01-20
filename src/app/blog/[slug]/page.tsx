// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  slug: string;
}

// This is a mock data source – in real app use CMS/database
const blogPosts: BlogPost[] = [
  {
    title: "How Secure Escrow Protects Buyers and Sellers in 2026",
    content: `
      <p>Escrow has evolved significantly in recent years...</p>
      <h2>What is Escrow?</h2>
      <p>Escrow is a financial arrangement...</p>
      <h2>How Nayo Implements Escrow</h2>
      <p>Our system is designed with...</p>
      <!-- Add full article content here -->
    `,
    author: "Nayo Team",
    date: "January 5, 2026",
    readTime: "6 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1563986768609-620da13593e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    slug: "secure-escrow-2026",
  },
  {
    title: "Top 10 In-Demand Skills for Freelancers This Year",
    content: `
      <p>Escrow has evolved significantly in recent years...</p>
      <h2>What is Escrow?</h2>
      <p>Escrow is a financial arrangement...</p>
      <h2>How Nayo Implements Escrow</h2>
      <p>Our system is designed with...</p>
      <!-- Add full article content here -->
    `,
    author: "Nayo Team",
    date: "January 5, 2026",
    readTime: "6 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1563986768609-620da13593e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    slug: "top-skills-2026",
  },

];

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back to Blog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 mb-12 rounded-2xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Optional: Share buttons, related posts, comments section */}
      </article>
    </div>
  );
}