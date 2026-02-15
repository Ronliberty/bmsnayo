// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Home,
//   Briefcase,
//   Store,
//   Bell,
//   User,
//   BarChart2,
//   Settings,
//   Users,
//   DollarSign,
//   Lock,
//   Handshake,
//   Package,
//   BadgeDollarSign,  
// } from "lucide-react";

// type SidebarProps = {
//   isSubscribed?: boolean;
//   isPartner?: boolean;
//   isSeller?: boolean;
// };

// export function Sidebar({
//   isSubscribed = false,
//   isPartner = false,
//   isSeller = false,
// }: SidebarProps) {
//   const pathname = usePathname();

//   const sidebarItems = [
//     { name: "News", href: "/dashboard", icon: Home, restricted: false },
//     { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase, restricted: false },
//     { name: "Marketplace", href: "/dashboard/marketplace", icon: Store, restricted: false },
    
//     { name: "Analytics", href: "/dashboard/finance", icon: BarChart2, restricted: false },
//     { name: "Partnerships", href: "/dashboard/partnerships", icon: Handshake, restricted: false },
//     { name: "sell", href: "/dashboard/seller", icon: BadgeDollarSign, restricted: false },
 

//     // Restricted items
  
//     {
//       name: "Groups",
//       href: "/dashboard/partnerships",
//       icon: Users,
//       restricted: !isPartner,
//       tooltip: "coming soon",
//     },
        
//     { name: "Learn", href: "/dashboard/tutor", icon: User, restricted: false },
//     { name: "Subscription", href: "/dashboard/subscription", icon: User, restricted: false },

//     { name: "Settings", href: "/dashboard/settings", icon: Settings, restricted: false },
//   ];

//   return (
//     <nav className="flex flex-col w-full h-full bg-background p-4 space-y-2">
//       <h1 className="text-xl font-bold mb-6">Nayo</h1>
//       {sidebarItems.map((item) => {
//         const Icon = item.icon;
//         const active = pathname === item.href;

//         if (item.restricted) {
//           return (
//             <div
//               key={item.name}
//               className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground opacity-50 relative group cursor-not-allowed"
//             >
//               <Icon className="mr-2 h-5 w-5" />
//               {item.name}
//               <Lock className="ml-auto h-4 w-4" />
//               {/* Tooltip on hover */}
//               <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
//                 {item.tooltip}
//               </span>
//             </div>
//           );
//         }

//         return (
//           <Link
//             key={item.name}
//             href={item.href}
//             className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//               active
//                 ? "bg-primary text-primary-foreground"
//                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
//             }`}
//           >
//             <Icon className="mr-2 h-5 w-5" />
//             {item.name}
//           </Link>
//         );
//       })}
//     </nav>
//   );
// }



"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Store,
  BarChart2,
  Settings,
  Users,
  Lock,
  Handshake,
  BadgeDollarSign,
  User,
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

  /** ✅ Items already present in mobile bottom navbar */
  const mobileNavRoutes = [
    "/dashboard",
    "/dashboard/jobs",
    "/dashboard/marketplace",
    
    "/dashboard/partnerships",
  ];

  const sidebarItems = [
    { name: "News", href: "/dashboard", icon: Home },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: Store,
      // restricted: !isPartner,
      tooltip: "Coming soon",
     },
    { name: "Analytics", href: "/dashboard/finance", icon: BarChart2, 
      // restricted: !isPartner,
      tooltip: "Coming soon",
    },
    { name: "Partnerships", href: "/dashboard/partnerships", icon: Handshake,
      restricted: !isPartner,
      tooltip: "Coming soon",
     },

    { name: "Sell", href: "/dashboard/seller",
       icon: BadgeDollarSign,

      // restricted: !isPartner,
      tooltip: "Coming soon",
     },

    {
      name: "Groups",
      href: "/dashboard/partnerships",
      icon: Users,
      // restricted: !isPartner,
      tooltip: "Coming soon",
    },

    { name: "Learn", href: "/dashboard/tutor", icon: User,
      restricted: !isPartner,
      tooltip: "Coming soon",
     },
    { name: "Subscription", href: "/dashboard/subscription", icon: User,
      restricted: !isPartner,
      tooltip: "Coming soon",
    },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <nav className="flex flex-col h-full w-full bg-background p-4 space-y-2">
      <h1 className="text-xl font-bold mb-6">Nayo</h1>

      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        /** ✅ Hide items already in mobile navbar */
        const hideOnMobile = mobileNavRoutes.includes(item.href);

        if (item.restricted) {
          return (
            <div
              key={item.name}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed relative group
                ${hideOnMobile ? "hidden md:flex" : ""}
              `}
            >
              <Icon className="mr-2 h-5 w-5" />
              {item.name}
              <Lock className="ml-auto h-4 w-4" />

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
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${hideOnMobile ? "hidden md:flex" : ""}
              ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            <Icon className="mr-2 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
