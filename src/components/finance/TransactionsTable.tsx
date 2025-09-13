"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Transaction {
  id: string;
  type: string; // deposit | payout
  amount: number;
  status: string;
  created_at: string;
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { access } = useAuth(); // ✅ get token from context

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/transactions/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`, // ✅ add token
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to fetch transactions");
        }

        const data = await res.json();

        // ✅ Ensure it's an array
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err: any) {
        console.error("Error fetching transactions:", err.message);
        setError(err.message);
      }
    }

    if (access) {
      fetchTransactions();
    }
  }, [access]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr
              key={tx.id}
              className={`transition-colors ${
                i % 2 === 0 ? "bg-muted/30" : "bg-background"
              } hover:bg-muted/50`}
            >
              <td className="p-3 font-mono text-xs text-muted-foreground">{tx.id}</td>
              <td className="p-3 capitalize">{tx.type}</td>
              <td className="p-3 font-medium">${tx.amount.toFixed(2)}</td>
              <td className="p-3">{tx.status}</td>
              <td className="p-3">{new Date(tx.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
