// app/(dashboard)/partnerships/page.tsx
"use client";

import React, { useState } from "react";
import { PartnershipCard, PartnershipProgram } from "@/components/partnership/PartnershipCard";
import { ReferralWidget } from "@/components/partnership/ReferralWidget";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock programs (mirror your Django model fields)
const MOCK_PROGRAMS: PartnershipProgram[] = [
  {
    id: "p1",
    title: "Affiliate Basic — 10% commission",
    description: "Earn 10% on every sale from your referral.",
    commission_type: "percentage",
    commission_value: 10,
    referral_enabled: true,
    referral_commission_rate: 5,
    eligibility: "Open to all sellers",
    tags: ["affiliate", "sales"],
    status: "active",
  },
  {
    id: "p2",
    title: "Seller Partnership — fixed $50",
    description: "Get $50 per new verified seller you refer.",
    commission_type: "fixed",
    commission_value: 50,
    referral_enabled: false,
    referral_commission_rate: 0,
    eligibility: "Invite only",
    tags: ["seller", "invite"],
    status: "active",
  },
  {
    id: "p3",
    title: "Growth Partner Program",
    description: "Revenue share for enterprise referrals.",
    commission_type: "percentage",
    commission_value: 15,
    referral_enabled: true,
    referral_commission_rate: 7.5,
    eligibility: "Business accounts",
    tags: ["enterprise"],
    status: "inactive",
  },
];

export default function PartnershipsPage() {
  // Local state for joined programs for mock demo; in real app this comes from API
  const [joinedIds, setJoinedIds] = useState<string[]>(["p2"]); // pretend user joined p2
  const [query, setQuery] = useState("");

  function handleJoin(id: string) {
    if (!joinedIds.includes(id)) setJoinedIds((s) => [...s, id]);
  }
  function handleLeave(id: string) {
    setJoinedIds((s) => s.filter((x) => x !== id));
  }

  const filtered = MOCK_PROGRAMS.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    (p.tags || []).some((t) => t.includes(query.toLowerCase()))
  );

  // Mock referral widget data
  const referralData = {
    referralLink: "https://nayo.app/ref/john123",
    stats: { total_refs: 12, active_refs: 3, earned: 90 },
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Partnership Programs</h1>
      <p className="text-muted-foreground">Explore partnership programs and join those that fit you.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <input
              placeholder="Search programs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-md border px-3 py-2"
            />
            <Tabs defaultValue="all" className="hidden sm:block">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="referral">Referral</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <PartnershipCard
                key={p.id}
                program={p}
                joined={joinedIds.includes(p.id)}
                onJoin={handleJoin}
                onLeave={handleLeave}
              />
            ))}
          </div>

          <Card>
            <div className="p-4">
              <h3 className="font-semibold">My Partnerships</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {joinedIds.length === 0 ? (
                  <li className="text-muted-foreground">You haven't joined any programs yet.</li>
                ) : (
                  joinedIds.map((id) => {
                    const p = MOCK_PROGRAMS.find((x) => x.id === id)!;
                    return (
                      <li key={id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{p.title}</div>
                          <div className="text-xs text-muted-foreground">{p.eligibility}</div>
                        </div>
                        <div>
                          <a href={`#analytics-${id}`} className="text-primary text-sm">View Analytics</a>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <ReferralWidget referralLink={referralData.referralLink} stats={referralData.stats} />

          <Card>
            <div className="p-4">
              <h3 className="font-semibold">How it works</h3>
              <ol className="list-decimal list-inside text-sm mt-2 text-muted-foreground">
                <li>Join a program.</li>
                <li>Share your referral link or promote your services.</li>
                <li>Earnings and referrals are tracked in Analytics.</li>
              </ol>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
