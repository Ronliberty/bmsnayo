// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext"; // get access token
// import { Link } from "lucide-react";

// type Job = {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   description: string;
//   currency: string;
//   salary_min: number;
//   salary_max: number;
//   posted_at: string;
//   url: string;
// };

// export default function Jobs() {
//   const { access } = useAuth(); // ✅ get token
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   // Fetch jobs from API
//   useEffect(() => {
//     async function fetchJobs() {
//       if (!access) return; // wait until logged in
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${access}`, // ✅ add bearer token
//           },
//         });

//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.detail || "Failed to fetch jobs");
//         }

//         const data = await res.json();
//         setJobs(data);
//       } catch (error: any) {
//         console.error("Error fetching jobs:", error);
//         setErr(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchJobs();
//   }, [access]);

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <h2 className="text-2xl font-bold">Job Opportunities</h2>
//       <p className="text-muted-foreground">
//         Explore the latest openings and apply directly.
//       </p>

//       {/* Show errors / loading */}
//       {loading && <p className="text-sm text-muted-foreground">Loading jobs...</p>}
//       {err && <p className="text-sm text-red-600">{err}</p>}

//       {/* Job List */}
//       <div className="space-y-4">
//         {!loading && !err && (
//           jobs.length === 0 ? (
//             <p className="text-muted-foreground">No jobs found.</p>
//           ) : (
//             jobs.map((job) => (
//               <Card key={job.id}>
//                 <CardHeader>
//                   <CardTitle className="text-base font-semibold">
//                     {job.title}
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground">
//                     {job.company} — {job.location}
//                   </p>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-muted-foreground mb-2">
//                     {job.description}
//                   </p>
//                   <div className="flex items-center justify-between text-xs text-muted-foreground">
//                     <span>
//                       {job.currency} {job.salary_min?.toLocaleString()} -{" "}
//                       {job.salary_max?.toLocaleString()}
//                     </span>
//                     <span>Posted: {job.posted_at}</span>
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button asChild className="w-full">
//                     <a href={job.url} target="_blank" rel="noopener noreferrer">
//                       Apply Now
//                     </a>
//                   </Button>
//                   <Link>How to apply</Link>
//                 </CardFooter>
//               </Card>
//             ))
//           )
//         )}
//       </div>
//     </div>
//   );
// }






// "use client";

// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Maximize2, Minimize2 } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// type Job = {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   description: string;
//   currency: string;
//   salary_min: number;
//   salary_max: number;
//   posted_at: string;
//   url: string;
// };

// export default function Jobs() {
//   const { access } = useAuth();
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);
//   const [openJob, setOpenJob] = useState<Job | null>(null);
//   const [isExpanded, setIsExpanded] = useState(false);

//   // Fetch jobs from API
//   useEffect(() => {
//     async function fetchJobs() {
//       if (!access) return;
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${access}`,
//           },
//         });
//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.detail || "Failed to fetch jobs");
//         }
//         const data = await res.json();
//         setJobs(data);
//       } catch (error: any) {
//         console.error("Error fetching jobs:", error);
//         setErr(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchJobs();
//   }, [access]);

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Job Opportunities</h2>
//       <p className="text-muted-foreground">
//         Explore the latest openings and apply directly.
//       </p>

//       {loading && <p className="text-sm text-muted-foreground">Loading jobs...</p>}
//       {err && <p className="text-sm text-red-600">{err}</p>}

//       <div className="space-y-4">
//         {!loading && !err && (
//           jobs.length === 0 ? (
//             <p className="text-muted-foreground">No jobs found.</p>
//           ) : (
//             jobs.map((job) => (
//               <Card key={job.id} className="shadow-md hover:shadow-lg transition">
//                 <CardHeader>
//                   <CardTitle className="text-base font-semibold">
//                     {job.title}
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground">
//                     {job.company} — {job.location}
//                   </p>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-muted-foreground mb-2">
//                     {job.description}
//                   </p>
//                   <div className="flex items-center justify-between text-xs text-muted-foreground">
//                     <span>
//                       {job.currency} {job.salary_min?.toLocaleString()} -{" "}
//                       {job.salary_max?.toLocaleString()}
//                     </span>
//                     <span>Posted: {job.posted_at}</span>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-between gap-2">
//                   <Button asChild className="flex-1">
//                     <a href={job.url} target="_blank" rel="noopener noreferrer">
//                       Apply Now
//                     </a>
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => {
//                       setOpenJob(job);
//                       setIsExpanded(false);
//                     }}
//                   >
//                     How to Apply
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))
//           )
//         )}
//       </div>

//       {/* Video Modal */}
//       {openJob && (
//         <Dialog open={!!openJob} onOpenChange={() => setOpenJob(null)}>
//           <DialogContent
//             className={`transition-all duration-500 ease-in-out ${
//               isExpanded ? "max-w-[95vw] h-[90vh]" : "max-w-2xl"
//             }`}
//           >
//             <DialogHeader>
//               <div className="flex justify-between items-center">
//                 <DialogTitle>How to Apply for {openJob.title}</DialogTitle>
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   onClick={() => setIsExpanded(!isExpanded)}
//                 >
//                   {isExpanded ? <Minimize2 /> : <Maximize2 />}
//                 </Button>
//               </div>
//             </DialogHeader>

//             {/* Video area */}
//             <div
//               className={`w-full bg-black transition-all duration-500 ease-in-out rounded-xl overflow-hidden ${
//                 isExpanded ? "h-[75vh]" : "aspect-video"
//               }`}
//             >
//               <iframe
//                 className="w-full h-full"
//                 src="https://www.youtube.com/embed/dQw4w9WgXcQ"
//                 title={`How to Apply for ${openJob.title}`}
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               ></iframe>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// }




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
import { Maximize2, Minimize2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

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
  video_url?: string | null; // ✅ now supports video link
};

export default function Jobs() {
  const { access } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openJob, setOpenJob] = useState<Job | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch jobs
  useEffect(() => {
    async function fetchJobs() {
      if (!access) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
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
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Job Opportunities</h2>
        <p className="text-muted-foreground">
          Explore the latest openings and apply directly.
        </p>

        {loading && <p className="text-sm text-muted-foreground">Loading jobs...</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}

        <div className="space-y-4">
          {!loading && !err && (
            jobs.length === 0 ? (
              <p className="text-muted-foreground">No jobs found.</p>
            ) : (
              jobs.map((job) => (
                <Card key={job.id} className="shadow-md hover:shadow-lg transition">
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

                  <CardFooter className="flex justify-between gap-2">
                    <Button asChild className="flex-1">
                      <a href={job.url} target="_blank" rel="noopener noreferrer">
                        Apply Now
                      </a>
                    </Button>

                    {/* ✅ Conditional How to Apply button */}
                    {job.video_url ? (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setOpenJob(job);
                          setIsExpanded(false);
                        }}
                      >
                        How to Apply
                      </Button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            disabled
                            className="flex-1 flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
                          >
                            <Lock className="w-4 h-4" />
                            No video
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>No video available yet</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </CardFooter>
                </Card>
              ))
            )
          )}
        </div>

        {/* Video Modal */}
        {openJob && openJob.video_url && (
          <Dialog open={!!openJob} onOpenChange={() => setOpenJob(null)}>
            <DialogContent
              className={`transition-all duration-500 ease-in-out ${
                isExpanded ? "max-w-[95vw] h-[90vh]" : "max-w-2xl"
              }`}
            >
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>How to Apply for {openJob.title}</DialogTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <Minimize2 /> : <Maximize2 />}
                  </Button>
                </div>
              </DialogHeader>

              <div
                className={`w-full bg-black transition-all duration-500 ease-in-out rounded-xl overflow-hidden ${
                  isExpanded ? "h-[75vh]" : "aspect-video"
                }`}
              >
                <iframe
                  className="w-full h-full"
                  src={openJob.video_url!}
                  title={`How to Apply for ${openJob.title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TooltipProvider>
  );
}
