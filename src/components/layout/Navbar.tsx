// "use client";

// import { Bell, Search, Sun, Moon } from "lucide-react";
// import { useTheme } from "next-themes";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";

// type Notification = {
//   id: number;
//   is_read: boolean;
// };

// export function Navbar() {
//   const { theme, setTheme } = useTheme();
//   const [search, setSearch] = useState("");
//   const { user } = useAuth();

//   const [hasUnread, setHasUnread] = useState(false);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!user) return;

//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/notify/notifications/`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access")}`,
//             },
//           }
//         );

//         // ❗ Never throw inside Navbar
//         if (!res.ok) return;

//         const data = await res.json();

//         // ✅ Handle paginated & non-paginated responses
//         const notifications: Notification[] = Array.isArray(data)
//           ? data
//           : data?.results ?? [];

//         const unreadExists = notifications.some((n) => !n.is_read);
//         setHasUnread(unreadExists);
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       }
//     };

//     fetchNotifications();
//   }, [user]);

//   const getInitial = () => {
//     if (!user) return "U";
//     if (user.username) return user.username.charAt(0).toUpperCase();
//     if (user.email) return user.email.charAt(0).toUpperCase();
//     return "U";
//   };

//   return (
//     <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-20">
//       {/* Search */}
//       <div className="flex-1 max-w-md">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm focus:outline-none"
//         />
//       </div>

//       {/* Actions */}
//       <div className="flex items-center space-x-4 ml-4">
//         {/* Theme toggle */}
//         <button
//           onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//           className="p-2 rounded-full hover:bg-muted"
//         >
//           {theme === "light" ? (
//             <Moon className="h-5 w-5" />
//           ) : (
//             <Sun className="h-5 w-5" />
//           )}
//         </button>

//         {/* Notifications */}
//         <Link
//           href="/dashboard/notifications"
//           className="relative p-2 rounded-full hover:bg-muted"
//         >
//           <Bell className="h-5 w-5" />
//           {hasUnread && (
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
//           )}
//         </Link>

//         {/* Profile */}
//         <Link href="/dashboard/profile">
//           <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs hover:bg-accent">
//             {getInitial()}
//           </div>
//         </Link>
//       </div>
//     </header>
//   );
// }


"use client";

import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type Notification = {
  id: number;
  is_read: boolean;
};

type NavbarProps = {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
};

export function Navbar({
  onToggleSidebar,
  isSidebarOpen = false,
}: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notify/notifications/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        const notifications: Notification[] = Array.isArray(data)
          ? data
          : data?.results ?? [];

        setHasUnread(notifications.some((n) => !n.is_read));
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [user]);

  const getInitial = () => {
    if (!user) return "U";
    if (user.username) return user.username[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "U";
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        {/* LEFT: Sidebar toggle (mobile only) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Desktop search */}
          <div className="hidden md:block w-64">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center space-x-3">
          {/* Mobile search toggle */}
          <button
            onClick={() => setShowMobileSearch((v) => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full hover:bg-muted"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className="relative p-2 rounded-full hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Link>

          {/* Profile */}
          <Link href="/dashboard/profile">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {getInitial()}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile search input (slide-down) */}
      {showMobileSearch && (
        <div className="mt-3 md:hidden">
          <input
            autoFocus
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm focus:outline-none"
          />
        </div>
      )}
    </header>
  );
}

