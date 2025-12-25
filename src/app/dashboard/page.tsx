
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

type Media = {
  file: string;
  alt?: string | null;
  caption?: string | null;
};

type Article = {
  id: string;
  title: string;
  url: string;
  summary: string;
  source: {
    id: number;
    name: string;
    url: string;
    reliability_score: number;
  };
  source_reliability_at_fetch: number;
  topics: string[];
  language: string;
  region: string;
  published_at: string;
  is_featured: boolean;
  media?: Media[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function DashboardPage() {
  const { access } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [region, setRegion] = useState("all");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchArticles() {
      if (!access) return;

      setLoading(true);
      setErr(null);

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/nayo/articles/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to fetch articles");
        }

        const data = await res.json();

        // ✅ DRF pagination-safe
        setArticles(Array.isArray(data.results) ? data.results : []);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [access]);

  // ✅ SAFE: articles is always an array
  const featured = articles.find((a) => a.is_featured);
  const filteredArticles = articles.filter(
    (a) => region === "all" || a.region === region
  );

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function getPreview(text: string, wordLimit = 100) {
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) {
      return { preview: text, remaining: "" };
    }

    return {
      preview: words.slice(0, wordLimit).join(" "),
      remaining: words.slice(wordLimit).join(" "),
    };
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(url);
  }

  function isVideo(url: string): boolean {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  }

  const renderMedia = (media?: Media[]) => {
    if (!media || media.length === 0) return null;

    return media.map((m, index) => {
      const mediaUrl = m.file.startsWith('http') ? m.file : `${API_BASE_URL}${m.file.startsWith('/') ? '' : '/'}${m.file}`;

      if (isImage(mediaUrl)) {
        return (
          <div key={index} className="mb-4">
            <img
              src={mediaUrl}
              alt={m.alt || m.caption || "Article media"}
              className="w-full h-auto rounded-md object-cover"
              loading="lazy"
            />
            {m.caption && <p className="text-sm text-muted-foreground mt-2">{m.caption}</p>}
          </div>
        );
      } else if (isVideo(mediaUrl)) {
        return (
          <div key={index} className="mb-4">
            <video
              src={mediaUrl}
              controls
              className="w-full h-auto rounded-md"
            />
            {m.caption && <p className="text-sm text-muted-foreground mt-2">{m.caption}</p>}
          </div>
        );
      }

      return null;
    });
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      {/* Featured Skeleton */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full mb-4" /> {/* Media placeholder */}
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-3 w-1/4" />
        </CardContent>
      </Card>

      {/* Articles Skeletons */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full mb-4" /> {/* Media placeholder */}
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-3 w-1/4 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Latest News</h1>
      <p className="text-muted-foreground">
        Stay updated on AI, jobs, and market opportunities.
      </p>

      {loading ? (
        renderSkeleton()
      ) : err ? (
        <p className="text-sm text-red-600">{err}</p>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  🌟 Featured: {featured.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderMedia(featured.media)}
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  {featured.summary}
                </p>
                <a
                  href={featured.url}
                  target="_blank"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Read more →
                </a>
              </CardContent>
            </Card>
          )}

          {/* Articles */}
          <div className="space-y-4">
            {filteredArticles.map((article) => {
              const { preview, remaining } = getPreview(article.summary);
              const isExpanded = expanded[article.id];

              return (
                <Card key={article.id}>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      {article.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {renderMedia(article.media)}
                    <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {preview}
                      {!isExpanded && remaining && "..."}
                      {isExpanded && remaining && <span> {remaining}</span>}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {article.source.name} • Reliability{" "}
                        {article.source_reliability_at_fetch}%
                      </span>
                      <span>{formatDate(article.published_at)}</span>
                    </div>

                    {!isExpanded && remaining && (
                      <button
                        onClick={() => toggleExpand(article.id)}
                        className="text-primary text-sm font-medium hover:underline mt-2"
                      >
                        Read more
                      </button>
                    )}

                    {isExpanded && (
                      <div className="flex gap-4 mt-2">
                        <button
                          onClick={() => toggleExpand(article.id)}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          Show less
                        </button>
                        <a
                          href={article.url}
                          target="_blank"
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          Explore →
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
