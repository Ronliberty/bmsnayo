// app/(dashboard)/analytics/page.tsx
"use client";

import React from "react";
import { AnalyticsSummary } from "@/components/analytics/AnalyticsSummary";
import { Charts } from "@/components/analytics/Charts";
import { Card } from "@/components/ui/card";


const mockEarningsSeries = [
  { date: "2025-08-07", earnings: 10 },
  { date: "2025-08-10", earnings: 30 },
  { date: "2025-08-13", earnings: 55 },
  { date: "2025-08-16", earnings: 25 },
  { date: "2025-08-19", earnings: 90 },
  { date: "2025-08-22", earnings: 70 },
  { date: "2025-08-25", earnings: 120 },
  { date: "2025-08-28", earnings: 85 },
  { date: "2025-08-31", earnings: 140 },
];

const mockReferralsSeries = [
  { label: "Affiliate", referrals: 40, conversions: 12 },
  { label: "Seller", referrals: 12, conversions: 3 },
  { label: "Growth", referrals: 8, conversions: 1 },
];

const mockPartnershipsTable = [
  { id: "p1", title: "Affiliate Basic", joined: "2025-01-12", revenue: 240.0, referrals: 12, status: "active" },
  { id: "p2", title: "Seller Partnership", joined: "2025-04-03", revenue: 150.0, referrals: 4, status: "active" },
  { id: "p3", title: "Growth Partner", joined: "2025-05-19", revenue: 90.0, referrals: 2, status: "pending" },
];

export default function AnalyticsPage() {
  const totalEarnings = mockPartnershipsTable.reduce((s, r) => s + r.revenue, 0);
  const activePrograms = mockPartnershipsTable.filter((p) => p.status === "active").length;
  const totalReferrals = mockPartnershipsTable.reduce((s, r) => s + r.referrals, 0);
  const totalTransactions = mockPartnershipsTable.length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">Track earnings, referrals, and partnership performance.</p>

      <AnalyticsSummary
        totalEarnings={totalEarnings}
        activePrograms={activePrograms}
        totalReferrals={totalReferrals}
        totalTransactions={totalTransactions}
      />

      <Charts earningsSeries={mockEarningsSeries} referralsSeries={mockReferralsSeries} />

      <Card>
        <div className="p-4">
          <h3 className="font-semibold">Partnerships Breakdown</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="p-2">Partnership</th>
                  <th className="p-2">Joined</th>
                  <th className="p-2">Revenue</th>
                  <th className="p-2">Referrals</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockPartnershipsTable.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.title}</td>
                    <td className="p-2">{r.joined}</td>
                    <td className="p-2">${r.revenue.toFixed(2)}</td>
                    <td className="p-2">{r.referrals}</td>
                    <td className="p-2 capitalize">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
