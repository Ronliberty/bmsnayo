"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"; // get access token

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  currency: string;
  salary_min: number;
  salary_max: number;
  posted_at: string;
  url: string;
};

export default function Jobs() {
  const { access } = useAuth(); // ✅ get token
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Fetch jobs from API
  useEffect(() => {
    async function fetchJobs() {
      if (!access) return; // wait until logged in
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`, // ✅ add bearer token
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to fetch jobs");
        }

        const data = await res.json();
        setJobs(data);
      } catch (error: any) {
        console.error("Error fetching jobs:", error);
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [access]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold">Job Opportunities</h2>
      <p className="text-muted-foreground">
        Explore the latest openings and apply directly.
      </p>

      {/* Show errors / loading */}
      {loading && <p className="text-sm text-muted-foreground">Loading jobs...</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {/* Job List */}
      <div className="space-y-4">
        {!loading && !err && (
          jobs.length === 0 ? (
            <p className="text-muted-foreground">No jobs found.</p>
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {job.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {job.company} — {job.location}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {job.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {job.currency} {job.salary_min?.toLocaleString()} -{" "}
                      {job.salary_max?.toLocaleString()}
                    </span>
                    <span>Posted: {job.posted_at}</span>
                  </div>
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
          )
        )}
      </div>
    </div>
  );
}
