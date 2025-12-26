"use client";

import { useState, useEffect } from "react";
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
import {
  Maximize2,
  Minimize2,
  Filter,
  X,
} from "lucide-react";
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
  media?: Media[];
};

/* ---------------- Helpers ---------------- */
const getPrimaryMedia = (media?: Media[]) => media?.[0] || null;

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
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-sm"
      >
        Download attachment
      </a>
    </div>
  );
}

/* ---------------- Filter Panel ---------------- */
function FilterPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile Overlay */}
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
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6 text-sm">
          {/* Category */}
          <div>
            <p className="font-medium mb-2">Category</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Remote
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Office
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Hybrid
              </label>
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="font-medium mb-2">Location</p>
            <select className="w-full border rounded-md p-2">
              <option>Any</option>
              <option>Nairobi</option>
              <option>Mombasa</option>
              <option>Remote</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <p className="font-medium mb-2">Job Type</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Full-time
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Part-time
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Contract
              </label>
            </div>
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
export default function JobsPage() {
  const { access } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openJob, setOpenJob] = useState<Job | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      if (!access) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/nayo/jobs/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        const data = await res.json();
        setJobs(Array.isArray(data.results) ? data.results : []);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [access]);

  return (
    <>
      {/* Filter Panel */}
      <FilterPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />

      <div className="max-w-5xl mx-auto px-6 py-10 pb-28 sm:pb-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Job Opportunities</h2>
            <p className="text-muted-foreground">
              Explore the latest openings and apply directly.
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

        {/* Content */}
        {loading && <p className="text-sm">Loading jobs…</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}

        <div className="space-y-4">
          {jobs.map((job) => {
            const media = getPrimaryMedia(job.media);

            return (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle className="text-base">
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

      {/* Media Modal */}
      {openJob && getPrimaryMedia(openJob.media) && (
        <Dialog open onOpenChange={() => setOpenJob(null)}>
          <DialogContent
            className={`transition-all ${
              expanded ? "max-w-[95vw] h-[90vh]" : "max-w-3xl"
            }`}
          >
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>
                  How to Apply for {openJob.title}
                </DialogTitle>
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
