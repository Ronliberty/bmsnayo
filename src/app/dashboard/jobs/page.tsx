"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Maximize2, Minimize2, Filter, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function mediaUrl(path: string) {
  return new URL(path, API_BASE_URL).toString();
}

/* ---------------- Types ---------------- */
type Media = {
  id: string;
  media_type: "image" | "video" | "file";
  file: string;
  caption?: string | null;
};

type RemoteType = "remote" | "hybrid" | "onsite";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  currency: string;
  salary_min: number | null;
  salary_max: number | null;
  remote_type: RemoteType;
  posted_at: string;
  url: string;
  media?: Media[];
};

/* ---------------- Helpers ---------------- */
const getPrimaryMedia = (media?: Media[]) => media?.[0] || null;

const REMOTE_LABELS: Record<RemoteType, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

/* ---------------- Modal Media ---------------- */
function RenderModalMedia({
  media,
  expanded,
}: {
  media: Media;
  expanded: boolean;
}) {
  const url = mediaUrl(media.file);

  if (media.media_type === "image") {
    return (
      <img
        src={url}
        alt={media.caption || "How to apply"}
        className={`w-full rounded-xl object-contain ${
          expanded ? "max-h-[75vh]" : "max-h-[60vh]"
        }`}
      />
    );
  }

  if (media.media_type === "video") {
    return (
      <video
        src={url}
        controls
        autoPlay
        className={`w-full rounded-xl ${
          expanded ? "h-[75vh]" : "aspect-video"
        }`}
      />
    );
  }

  return (
    <div className="p-6 text-center">
      <a href={url} target="_blank" className="underline text-sm">
        Download attachment
      </a>
    </div>
  );
}

/* ---------------- Filter Panel ---------------- */
function FilterPanel({
  open,
  onClose,
  filters,
  setFilters,
  locations,
}: any) {
  const hourlyRates = [
    { label: "Any" },
    { label: "Below $10/hr", max: 10 },
    { label: "$10 – $25/hr", min: 10, max: 25 },
    { label: "$25 – $50/hr", min: 25, max: 50 },
    { label: "$50+/hr", min: 50 },
  ];

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
          {/* Location */}
          <div>
            <p className="font-medium mb-2">Location</p>
            <select
              className="w-full border rounded-md p-2"
              value={filters.location}
              onChange={(e) =>
                setFilters((f: any) => ({ ...f, location: e.target.value }))
              }
            >
              <option value="all">All</option>
              {locations.map((loc: string) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Remote Type */}
          <div>
            <p className="font-medium mb-2">Work Mode</p>
            {(["remote", "hybrid", "onsite"] as RemoteType[]).map((mode) => (
              <label key={mode} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={filters.remote.includes(mode)}
                  onChange={() =>
                    setFilters((f: any) => ({
                      ...f,
                      remote: f.remote.includes(mode)
                        ? f.remote.filter((m: RemoteType) => m !== mode)
                        : [...f.remote, mode],
                    }))
                  }
                />
                {REMOTE_LABELS[mode]}
              </label>
            ))}
          </div>

          {/* Hourly Rate */}
          <div>
            <p className="font-medium mb-2">Hourly Rate</p>
            <select
              className="w-full border rounded-md p-2"
              value={filters.rate}
              onChange={(e) =>
                setFilters((f: any) => ({ ...f, rate: e.target.value }))
              }
            >
              {hourlyRates.map((r) => (
                <option key={r.label} value={r.label}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              setFilters({
                location: "all",
                remote: [],
                rate: "Any",
              })
            }
          >
            Clear Filters
          </Button>
        </div>
      </aside>
    </>
  );
}

/* ---------------- Page ---------------- */
export default function JobsPage() {
  const { access } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [openJob, setOpenJob] = useState<Job | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<{
    location: string;
    remote: RemoteType[];
    rate: string;
  }>({
    location: "all",
    remote: [],
    rate: "Any",
  });

  useEffect(() => {
    if (!access) return;

    fetch(`${API_BASE_URL}/api/nayo/jobs/`, {
      headers: { Authorization: `Bearer ${access}` },
    })
      .then((r) => r.json())
      .then((d) => setJobs(d.results || []));
  }, [access]);

  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))).sort(),
    [jobs]
  );

  /* ---------------- Filtering Logic ---------------- */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filters.location !== "all" && job.location !== filters.location)
        return false;

      if (filters.remote.length && !filters.remote.includes(job.remote_type))
        return false;

      if (filters.rate !== "Any") {
        const min = job.salary_min ?? 0;
        const max = job.salary_max ?? Infinity;

        if (filters.rate === "Below $10/hr" && min >= 10) return false;
        if (filters.rate === "$10 – $25/hr" && (max < 10 || min > 25))
          return false;
        if (filters.rate === "$25 – $50/hr" && (max < 25 || min > 50))
          return false;
        if (filters.rate === "$50+/hr" && max < 50) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  return (
    <>
      <FilterPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        locations={locations}
      />

      <div className="max-w-5xl mx-auto px-6 py-10 pb-28">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Job Opportunities</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const media = getPrimaryMedia(job.media);

            return (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {job.company} — {job.location}
                  </p>
                </CardHeader>

                <CardContent>
                  <p className="text-sm">{job.description}</p>
                  <p className="text-xs mt-2">
                    {REMOTE_LABELS[job.remote_type]} • {job.currency}{" "}
                    {job.salary_min ?? "?"}–{job.salary_max ?? "?"}/hr
                  </p>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button asChild className="flex-1">
                    <a href={job.url} target="_blank">
                      Apply Now
                    </a>
                  </Button>

                  {media && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setOpenJob(job);
                        setExpanded(false);
                      }}
                    >
                      How to Apply
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {openJob && getPrimaryMedia(openJob.media) && (
        <Dialog open onOpenChange={() => setOpenJob(null)}>
          <DialogContent
            className={expanded ? "max-w-[95vw] h-[90vh]" : "max-w-3xl"}
          >
            <DialogHeader>
              <div className="flex justify-between">
                <DialogTitle>How to Apply</DialogTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <Minimize2 /> : <Maximize2 />}
                </Button>
              </div>
            </DialogHeader>

            <RenderModalMedia
              media={getPrimaryMedia(openJob.media)!}
              expanded={expanded}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
