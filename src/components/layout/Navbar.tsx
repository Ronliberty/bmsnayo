"use client";

import { Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 ml-4">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full hover:bg-muted"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
          U
        </div>
      </div>
    </header>
  );
}
