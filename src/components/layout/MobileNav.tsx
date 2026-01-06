"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Briefcase,
  Store,
  BarChart2,
  Users,
  User,
  Settings,
  Menu,
  X,
  BadgeDollarSign,
  Handshake,
} from "lucide-react";

type MobileNavProps = {
  isSubscribed?: boolean;
  isPartner?: boolean;
};

export function MobileNav({ isSubscribed = false, isPartner = false }: MobileNavProps) {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: Store },
    { name: "Sell", href: "/dashboard/seller", icon: BadgeDollarSign },
    { name: "Analytics", href: "/dashboard/finance", icon: BarChart2, restricted: !isSubscribed, tooltip: "Subscribe to access Analytics" },
    { name: "Partnerships", href: "/dashboard/partnerships", icon: Handshake, restricted: !isPartner, tooltip: "Become a Partner to unlock" },
    { name: "Groups", href: "/dashboard/groups", icon: Users, restricted: !isPartner, tooltip: "Coming soon" },
    { name: "Learn", href: "/dashboard/tutor", icon: User },
    { name: "Subscription", href: "/dashboard/subscription", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const mainNav = navItems.slice(0, 4); // first 4 always visible
  const overflowNav = navItems.slice(4); // rest go in the "More" sheet

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav
        className="footer-solid fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 border-t z-50"
        style={{
          backgroundColor: "rgb(var(--background))",
          borderColor: "rgb(var(--border))",
          color: "rgb(var(--foreground))",
        }}
      >
        {mainNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const isDisabled = item.restricted;

          return (
            <Link
              key={item.name}
              href={isDisabled ? "#" : item.href}
              title={item.tooltip}
              className={`flex flex-col items-center text-xs ${
                active ? "text-primary" : "text-muted-foreground"
              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex flex-col items-center text-xs text-muted-foreground"
        >
          {showMore ? <X className="h-5 w-5 mb-1" /> : <Menu className="h-5 w-5 mb-1" />}
          More
        </button>
      </nav>

      {/* Animated Bottom Sheet */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl p-4 border-t shadow-xl overflow-y-auto max-h-96"
            style={{
              backgroundColor: "rgb(var(--background))",
              borderColor: "rgb(var(--border))",
              color: "rgb(var(--foreground))",
            }}
          >
            {overflowNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              const isDisabled = item.restricted;

              return (
                <Link
                  key={item.name}
                  href={isDisabled ? "#" : item.href}
                  title={item.tooltip}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 text-sm py-2 ${
                    active ? "text-primary font-semibold" : "text-muted-foreground"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{
                    color: active
                      ? "rgb(var(--primary))"
                      : "rgb(var(--foreground))",
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
