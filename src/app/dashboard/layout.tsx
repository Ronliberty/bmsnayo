"use client";

import { ReactNode } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { MobileNav } from "../../components/layout/MobileNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
     <ProtectedRoute>
      <div className="flex h-screen bg-background text-foreground">
        {/* Sidebar - visible only on desktop */}
        <aside className="hidden md:flex md:w-64 border-r border-border">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <div className="flex flex-col flex-1">
          {/* Top navbar */}
          <Navbar />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>

        {/* Mobile footer navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background">
          <MobileNav />
        </div>
      </div>
     </ProtectedRoute>
  );
}
