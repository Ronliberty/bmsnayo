"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Store,
  Bell,
  User,
  BarChart2,
  Settings,
  Users,
  DollarSign,
  Lock,
} from "lucide-react";

type SidebarProps = {
  isSubscribed?: boolean;
  isPartner?: boolean;
  isSeller?: boolean;
};

export function Sidebar({
  isSubscribed = false,
  isPartner = false,
  isSeller = false,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarItems = [
    { name: "News", href: "/dashboard", icon: Home, restricted: false },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase, restricted: false },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: Store, restricted: false },
    { name: "sellers", href: "/dashboard/seller", icon: Store, restricted: false },
    
    
 

    // Restricted items
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart2,
      restricted: !isSubscribed,
      tooltip: "Subscribe",
    },
    {
      name: "Partnerships",
      href: "/dashboard/partnerships",
      icon: Users,
      restricted: !isPartner,
      tooltip: "Subscribe",
    },
    {
      name: "Seller Program",
      href: "/seller",
      icon: DollarSign,
      restricted: !isSeller,
      tooltip: "Subscribe",
    },
    { name: "Subscription", href: "/dashboard/subscription", icon: User, restricted: false },

    { name: "Settings", href: "/dashboard/settings", icon: Settings, restricted: false },
  ];

  return (
    <nav className="flex flex-col w-full h-full bg-background p-4 space-y-2">
      <h1 className="text-xl font-bold mb-6">Nayo</h1>
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        if (item.restricted) {
          return (
            <div
              key={item.name}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground opacity-50 relative group cursor-not-allowed"
            >
              <Icon className="mr-2 h-5 w-5" />
              {item.name}
              <Lock className="ml-auto h-4 w-4" />
              {/* Tooltip on hover */}
              <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                {item.tooltip}
              </span>
            </div>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="mr-2 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
