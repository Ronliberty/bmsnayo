"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // get access token

type Article = {
  id: string;
  title: string;
  url: string;
  summary: string;
  source: { name: string; reliability_score: number };
  topics: string[];
  language: string;
  region: string;
  published_at: string;
  is_featured: boolean;
};

export default function DashboardPage() {
  const { access } = useAuth(); // access token from AuthContext
  const [articles, setArticles] = useState<Article[]>([]);
  const [region, setRegion] = useState("all");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      if (!access) return; // wait until logged in
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`, // 🔑 JWT token
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to fetch articles");
        }

        const data = await res.json();
        setArticles(data); // assuming API returns a list
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [access]);

  const featured = articles.find((a) => a.is_featured);
  const filteredArticles = articles.filter(
    (a) => region === "all" || a.region === region
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Latest News</h1>
      <p className="text-muted-foreground">
        Stay updated on AI, jobs, and market opportunities.
      </p>

      {/* Show errors / loading */}
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {/* Featured Article */}
      {featured && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              🌟 Featured: {featured.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {featured.summary}
            </p>
            <a
              href={featured.url}
              className="text-primary text-sm font-medium hover:underline"
              target="_blank"
            >
              Read more →
            </a>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="AI">AI</TabsTrigger>
            <TabsTrigger value="Jobs">Jobs</TabsTrigger>
            <TabsTrigger value="Market">Market</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select onValueChange={(val) => setRegion(val)}>
          <SelectTrigger className="w-[160px]">
            <Globe className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌍 All Regions</SelectItem>
            <SelectItem value="US">🇺🇸 United States</SelectItem>
            <SelectItem value="EU">🇪🇺 Europe</SelectItem>
            <SelectItem value="Global">🌐 Global</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {article.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {article.source.name} • Reliability:{" "}
                  {article.source.reliability_score}%
                </span>
                <span>{article.published_at}</span>
              </div>
              <a
                href={article.url}
                className="text-primary text-sm font-medium hover:underline mt-2 inline-block"
                target="_blank"
              >
                Read more →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
