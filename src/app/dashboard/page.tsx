"use client";

import { useEffect, useMemo, useState } from "react";
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

type Topic = {
  id: number;
  name: string;
  slug: string;
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
  topics: Topic[];
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
  topics,
  selectedTopics,
  onToggleTopic,
  region,
  onRegionChange,
}: {
  open: boolean;
  onClose: () => void;
  topics: Topic[];
  selectedTopics: string[]; // slugs
  onToggleTopic: (slug: string) => void;
  region: string;
  onRegionChange: (val: string) => void;
}) {
  return (
    <>
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
            <select
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="all">All</option>
              <option value="Africa">Africa</option>
              <option value="USA">USA</option>
              <option value="Europe">Europe</option>
              <option value="Global">Global</option>
            </select>
          </div>

          {/* Topics */}
          <div>
            <p className="font-medium mb-2">Topics</p>
            <div className="space-y-2 max-h-60 overflow-auto pr-1">
              {topics.map((topic) => (
                <label
                  key={topic.slug}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic.slug)}
                    onChange={() => onToggleTopic(topic.slug)}
                  />
                  {topic.name}
                </label>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onRegionChange("all");
              selectedTopics.forEach(onToggleTopic);
            }}
          >
            Clear filters
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

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("all");

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

  /* -------- Derived Data -------- */
  const allTopics = useMemo(() => {
    const map = new Map<string, Topic>();

    articles.forEach((article) => {
      article.topics?.forEach((topic) => {
        map.set(topic.slug, topic);
      });
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const regionMatch =
        selectedRegion === "all" || a.region === selectedRegion;

      const topicMatch =
        selectedTopics.length === 0 ||
        a.topics?.some((t) => selectedTopics.includes(t.slug));

      return regionMatch && topicMatch;
    });
  }, [articles, selectedTopics, selectedRegion]);

  const featured = filteredArticles.find((a) => a.is_featured);

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
          <img
            key={i}
            src={url}
            alt={m.alt || "media"}
            className="w-full rounded-md mb-4"
          />
        );
      }

      if (isVideo(url)) {
        return (
          <video
            key={i}
            src={url}
            controls
            className="w-full rounded-md mb-4"
          />
        );
      }

      return null;
    });
  };

  return (
    <>
      <FilterPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        topics={allTopics}
        selectedTopics={selectedTopics}
        onToggleTopic={(slug) =>
          setSelectedTopics((prev) =>
            prev.includes(slug)
              ? prev.filter((t) => t !== slug)
              : [...prev, slug]
          )
        }
        region={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      <div className="max-w-5xl mx-auto px-6 py-10 pb-28 space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Latest News</h1>
            <p className="text-muted-foreground">
              Filter by topic and region
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

        {featured && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>🌟 Featured: {featured.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderMedia(featured.media)}
              <p className="text-sm">{featured.summary}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderMedia(article.media)}

                <p className="text-sm text-muted-foreground">
                  {expanded[article.id]
                    ? article.summary
                    : article.summary.slice(0, 300) + "..."}
                </p>

                <div className="flex justify-between text-xs mt-2">
                  <span>{article.source.name}</span>
                  <span>{formatDate(article.published_at)}</span>
                </div>

                <button
                  onClick={() => toggleExpand(article.id)}
                  className="text-primary text-sm mt-2"
                >
                  {expanded[article.id] ? "Show less" : "Read more"}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
