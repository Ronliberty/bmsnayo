"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Transaction {
  id: number; 
  type:
    | "deposit"
    | "purchase"
    | "fee"
    | "payout"
    | "refund"
    | "reserve"
    | "release"
    | "adjustment";
  amount: number | string; // backend may return string
  status?: "completed" | "pending" | "failed"; 
  provider?: string | null;
  provider_event_id?: string | null;
  related_object_type?: string | null;
  related_object_id?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { access } = useAuth();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/transactions/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!res.ok) {
          let errorMessage = "Failed to fetch transactions";
          try {
            const errorData = await res.json();
            errorMessage = errorData.detail || errorMessage;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(errorMessage);
        }

        const data = await res.json();
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

  const getStatusClass = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-4 text-center text-muted-foreground"
              >
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((tx, i) => (
              <tr
                key={tx.id}
                className={`transition-colors ${
                  i % 2 === 0 ? "bg-muted/30" : "bg-background"
                } hover:bg-muted/50`}
              >
                <td className="p-3 font-mono text-xs text-muted-foreground">
                  {tx.id}
                </td>
                <td className="p-3 capitalize">{tx.type}</td>
                <td className="p-3 font-medium">
                  ${Number(tx.amount).toFixed(2)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      tx.status
                    )}`}
                  >
                    {tx.status ?? "—"}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(tx.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
