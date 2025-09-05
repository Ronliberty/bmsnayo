// app/(dashboard)/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

// Mock Data (imitates NewsArticle model)
const mockArticles = [
  {
    id: "1",
    title: "AI Training Jobs Surge in 2025 Market",
    url: "#",
    summary: "Companies worldwide are hiring data annotators to fuel AI model development...",
    source: { name: "TechCrunch", reliability_score: 85 },
    topics: ["AI", "Jobs"],
    language: "en",
    region: "US",
    published_at: "2025-09-04",
    is_featured: true,
  },
  {
    id: "2",
    title: "New Opportunities in Remote Freelance Platforms",
    url: "#",
    summary: "Freelancers are finding more stable income through curated marketplaces...",
    source: { name: "Forbes", reliability_score: 90 },
    topics: ["Market", "Jobs"],
    language: "en",
    region: "Global",
    published_at: "2025-09-03",
    is_featured: false,
  },
  {
    id: "3",
    title: "Tech Regulations Shift AI Hiring Trends",
    url: "#",
    summary: "Policy changes in Europe could influence where AI jobs are located...",
    source: { name: "BBC", reliability_score: 88 },
    topics: ["AI", "Policy"],
    language: "en",
    region: "EU",
    published_at: "2025-09-02",
    is_featured: false,
  },
];

export default function DashboardPage() {
  const [region, setRegion] = useState("all");

  const featured = mockArticles.find((a) => a.is_featured);
  const filteredArticles = mockArticles.filter(
    (a) => region === "all" || a.region === region
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Latest News</h1>
      <p className="text-muted-foreground">
        Stay updated on AI, jobs, and market opportunities.
      </p>

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
