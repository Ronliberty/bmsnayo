// src/components/layout/DashboardWrapper.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSearch } from "@/context/SearchContext";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setSearchQuery } = useSearch();

  useEffect(() => {
    setSearchQuery(""); // Reset search on page change
  }, [pathname, setSearchQuery]);

  return <>{children}</>;
}