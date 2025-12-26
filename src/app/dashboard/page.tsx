"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Filter, X } from "lucide-react";

/* ---------------- Types ---------------- */
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

/* ---------------- Filter Panel ---------------- */
function FilterPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-background border-l z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Filters</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6 text-sm">
          {/* Region */}
          <div>
            <p className="font-medium mb-2">Region</p>
            <select className="w-full border rounded-md p-2">
              <option>All</option>
              <option>Africa</option>
              <option>Global</option>
              <option>USA</option>
              <option>Europe</option>
            </select>
          </div>

          {/* Topics */}
          <div>
            <p className="font-medium mb-2">Topics</p>
            <div className="space-y-2">
              <label className="flex gap-2 items-center">
                <input type="checkbox" /> AI
              </label>
              <label className="flex gap-2 items-center">
                <input type="checkbox" /> Jobs
              </label>
              <label className="flex gap-2 items-center">
                <input type="checkbox" /> Markets
              </label>
            </div>
          </div>

          {/* Language */}
          <div>
            <p className="font-medium mb-2">Language</p>
            <select className="w-full border rounded-md p-2">
              <option>Any</option>
              <option>English</option>
              <option>French</option>
            </select>
          </div>

          <Button disabled className="w-full">
            Apply Filters (Coming Soon)
          </Button>
        </div>
      </aside>
    </>
  );
}

/* ---------------- Page ---------------- */
export default function DashboardPage() {
  const { access } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      if (!access) return;

      setLoading(true);
      setErr(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/nayo/articles/`, {
          headers: { Authorization: `Bearer ${access}` },
        });

        const data = await res.json();
        setArticles(Array.isArray(data.results) ? data.results : []);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [access]);

  const featured = articles.find((a) => a.is_featured);

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function isImage(url: string) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  function isVideo(url: string) {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  }

  const renderMedia = (media?: Media[]) => {
    if (!media?.length) return null;

    return media.map((m, i) => {
      const url = m.file.startsWith("http")
        ? m.file
        : `${API_BASE_URL}${m.file.startsWith("/") ? "" : "/"}${m.file}`;

      if (isImage(url)) {
        return (
          <div key={i} className="mb-4">
            <img
              src={url}
              alt={m.alt || m.caption || "Article media"}
              className="w-full rounded-md"
            />
            {m.caption && (
              <p className="text-sm text-muted-foreground mt-2">
                {m.caption}
              </p>
            )}
          </div>
        );
      }

      if (isVideo(url)) {
        return (
          <div key={i} className="mb-4">
            <video src={url} controls className="w-full rounded-md" />
            {m.caption && (
              <p className="text-sm text-muted-foreground mt-2">
                {m.caption}
              </p>
            )}
          </div>
        );
      }

      return null;
    });
  };

  return (
    <>
      <FilterPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />

      <div className="max-w-5xl mx-auto px-6 py-10 pb-28 sm:pb-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Latest News</h1>
            <p className="text-muted-foreground">
              Stay updated on AI, jobs, and market opportunities.
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {loading && <Skeleton className="h-40 w-full" />}
        {err && <p className="text-sm text-red-600">{err}</p>}

        {/* Featured */}
        {featured && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>🌟 Featured: {featured.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderMedia(featured.media)}
              <p className="text-sm text-muted-foreground mb-2">
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
          {articles.map((article) => {
            const isOpen = expanded[article.id];

            return (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {renderMedia(article.media)}

                  <p className="text-sm text-muted-foreground">
                    {isOpen ? article.summary : article.summary.slice(0, 300)}
                    {!isOpen && "..."}
                  </p>

                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>
                      {article.source.name} •{" "}
                      {article.source_reliability_at_fetch}%
                    </span>
                    <span>{formatDate(article.published_at)}</span>
                  </div>

                  <button
                    onClick={() => toggleExpand(article.id)}
                    className="text-primary text-sm font-medium hover:underline mt-2"
                  >
                    {isOpen ? "Show less" : "Read more"}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
