"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

export function Charts() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const e = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/earnings/`).then((r) => r.json());
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/referrals/`).then((r) => r.json());
      setEarnings(e);
      setReferrals(r);
    }
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div>
        <h3 className="font-semibold mb-2">Earnings Trend</h3>
        <LineChart width={400} height={250} data={earnings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
        </LineChart>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Referrals</h3>
        <PieChart width={400} height={250}>
          <Pie data={referrals} dataKey="referrals" nameKey="label" outerRadius={100} fill="#82ca9d" label>
            {referrals.map((_, i) => (
              <Cell key={i} fill={["#8884d8", "#82ca9d", "#ffc658"][i % 3]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
