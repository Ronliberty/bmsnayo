// components/analytics/AnalyticsSummary.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  totalEarnings: number;
  activePrograms: number;
  totalReferrals: number;
  totalTransactions: number;
};

export function AnalyticsSummary({ totalEarnings, activePrograms, totalReferrals, totalTransactions }: Props) {
  const items = [
    { label: "Total Earnings", value: `$${totalEarnings.toFixed(2)}` },
    { label: "Active Programs", value: `${activePrograms}` },
    { label: "Referrals", value: `${totalReferrals}` },
    { label: "Transactions", value: `${totalTransactions}` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <Card key={it.label}>
          <CardHeader>
            <CardTitle className="text-sm">{it.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
