"use client";

import React, { useEffect, useState } from "react";

interface Summary {
  total_earnings: number;
  active_programs: number;
  total_referrals: number;
  total_transactions: number;
}

export function AnalyticsSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/summary/`);
      const data = await res.json();
      setSummary(data);
    }
    fetchSummary();
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 border rounded">Earnings: ${summary.total_earnings}</div>
      <div className="p-4 border rounded">Active Programs: {summary.active_programs}</div>
      <div className="p-4 border rounded">Referrals: {summary.total_referrals}</div>
      <div className="p-4 border rounded">Transactions: {summary.total_transactions}</div>
    </div>
  );
}
