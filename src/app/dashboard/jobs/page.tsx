"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "AI Data Annotator",
    company: "OpenAI",
    location: "Remote",
    remoteType: "remote",
    salaryMin: 45000,
    salaryMax: 60000,
    currency: "USD",
    description: "Work on labeling datasets for cutting-edge AI models.",
    postedAt: "2025-09-01",
    url: "https://jobs.openai.com/ai-data-annotator",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "New York, USA",
    remoteType: "hybrid",
    salaryMin: 70000,
    salaryMax: 90000,
    currency: "USD",
    description: "Build React applications for enterprise clients.",
    postedAt: "2025-08-29",
    url: "https://techcorp.com/careers/frontend-developer",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "DataFlow",
    location: "Berlin, Germany",
    remoteType: "onsite",
    salaryMin: 80000,
    salaryMax: 100000,
    currency: "EUR",
    description: "Maintain and optimize distributed backend systems.",
    postedAt: "2025-08-25",
    url: "https://dataflow.de/jobs/backend-engineer",
  },
];

export default function Jobs() {
  const [filter, setFilter] = useState("all");

  const filteredJobs =
    filter === "all" ? mockJobs : mockJobs.filter((job) => job.remoteType === filter);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Job Opportunities</h2>

      {/* Tabs for job type */}
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="remote">Remote</TabsTrigger>
          <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
          <TabsTrigger value="onsite">On-site</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="grid gap-4 md:grid-cols-2">
          {filteredJobs.length === 0 ? (
            <p className="text-muted-foreground">No jobs found.</p>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition flex flex-col">
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {job.company} — {job.location}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="mb-2 text-sm">{job.description}</p>
                  <p className="text-sm font-semibold">
                    {job.currency} {job.salaryMin.toLocaleString()} -{" "}
                    {job.salaryMax.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Posted: {job.postedAt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      Apply Now
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Optional dropdown filter */}
      <div className="flex justify-end">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="highest">Highest Salary</SelectItem>
            <SelectItem value="lowest">Lowest Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
