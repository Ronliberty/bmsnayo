// hooks/useSellerStatus.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type SellerStatus = "loading" | "none" | "pending" | "approved";

export function useSellerStatus(redirectIfNotApproved = true) {
  const { access } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<SellerStatus>("loading");

  useEffect(() => {
    if (!access) {
      router.replace("/login");
      return;
    }

    async function check() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/applications/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
          // Optional: prevent caching issues during dev
          cache: "no-store",
        });

        if (!res.ok) {
          console.log("Applications fetch failed:", res.status);
          setStatus("none");
          return;
        }

        const data = await res.json();

        // ── This is the key fix ───────────────────────────────
        const applications = data.results || []; // ← safe access

        if (applications.length > 0) {
          const firstApp = applications[0];
          const appStatus = firstApp.status?.toLowerCase();

          if (appStatus === "approved") {
            setStatus("approved");
          } else if (appStatus === "pending") {
            setStatus("pending");
          } else {
            setStatus("none");
          }
        } else {
          setStatus("none");
        }
      } catch (err) {
        console.error("Error checking seller status:", err);
        setStatus("none");
      }
    }

    check();
  }, [access, router]);

  // Auto-redirect if not approved
  useEffect(() => {
    if (status === "loading") return;
    if (status !== "approved" && redirectIfNotApproved) {
      router.replace("/dashboard/seller/application"); // or /dashboard/seller
    }
  }, [status, router, redirectIfNotApproved]);

  return { status, isApproved: status === "approved" };
}