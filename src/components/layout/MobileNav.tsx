"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Store,
  BarChart2,
  Users,
} from "lucide-react";

type MobileNavProps = {
  isSubscribed?: boolean;
  isPartner?: boolean;
};

export function MobileNav({
  isSubscribed = false,
  isPartner = false,
}: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Jobs",
      href: "/dashboard/jobs",
      icon: Briefcase,
    },
    {
      name: "Marketplace",
      href: "/dashboard/marketplace",
      icon: Store,
    },
    {
      name: "Analytics",
      href: "/dashboard/finance",
      icon: BarChart2,
      restricted: !isSubscribed,
    },
    {
      name: "Partnerships",
      href: "/dashboard/partnerships",
      icon: Users,
      restricted: !isPartner,
    },
  ];

  return (
    <nav className="footer-solid fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border py-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center text-xs transition-colors ${
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
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
