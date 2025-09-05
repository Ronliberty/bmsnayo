// components/analytics/Charts.tsx
"use client";

import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  earningsSeries: { date: string; earnings: number }[];
  referralsSeries: { label: string; referrals: number; conversions: number }[];
};

export function Charts({ earningsSeries, referralsSeries }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Earnings (Last 30 days)</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earningsSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referrals & Conversions</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={referralsSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="referrals" fill="#06b6d4" />
              <Bar dataKey="conversions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
