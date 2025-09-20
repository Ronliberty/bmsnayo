"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type Earning = { date: string; earnings: number };

export function Charts() {
  const [earnings, setEarnings] = useState<Earning[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const e: Earning[] = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/earnings/`,
          { credentials: "include" }
        ).then((r) => r.json());
        setEarnings(e || []);
      } catch (err) {
        console.error("Failed to load charts", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Earnings Trend</h3>
      {earnings.length > 0 ? (
        <LineChart width={400} height={250} data={earnings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
        </LineChart>
      ) : (
        <p className="text-gray-500">No earnings data available</p>
      )}
    </div>
  );
}
