"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

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
};

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/nayo/articles/`,
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Latest News</h1>
      <p className="text-muted-foreground">
        Stay updated on AI, jobs, and market opportunities.
      </p>

      {/* Loading / Error */}
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {/* Featured */}
      {featured && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              🌟 Featured: {featured.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
    </div>
  );
}
