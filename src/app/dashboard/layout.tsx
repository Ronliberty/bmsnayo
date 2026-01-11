"use client";

import { useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { MobileNav } from "../../components/layout/MobileNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { SearchProvider } from "@/context/SearchContext";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper"; // ← new

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <SearchProvider>
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
          {/* MOBILE OVERLAY */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
            />
          )}

          {/* SIDEBAR */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border
              transform transition-transform duration-300 ease-in-out
              md:static md:translate-x-0 md:flex
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <Sidebar />
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex flex-1 flex-col">
            <Navbar
              isSidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen((v) => !v)}
            />

            <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 md:px-6">
              <DashboardWrapper>{children}</DashboardWrapper>
            </main>
          </div>

          {/* Mobile footer navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background">
            <MobileNav />
          </div>
        </div>
      </SearchProvider>
    </ProtectedRoute>
  );
}

