"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Store, Bell, User, BarChart2, Users } from "lucide-react";

type MobilenavProps = {
  isSubscribed?: boolean;
  isPartner?: boolean;
};



// ✅ MobileNav now reuses navItems
export function MobileNav({
  isSubscribed = false,
  isPartner = false,
}: MobilenavProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: Store },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart2,
      restricted: !isSubscribed,
      tooltip: "Subscribe to access Analytics",
    },
    {
      name: "Partnerships",
      href: "/dashboard/partnerships",
      icon: Users,
      restricted: !isPartner,
      tooltip: "Become a Partner to unlock",
    },
  ];

  return (
    <nav className=" footer-solid fixed bottom-0 left-0 right-0 flex justify-around items-center py-2  border-t border-border z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center text-xs ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5 mb-1" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
