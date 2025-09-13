"use client";

import React, { useState } from "react";

export default function DepositWidget() {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDeposit() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deposits/stripe-intent/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create deposit");

      setMessage("✅ Deposit initiated. Complete payment via Stripe.");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="number"
        className="w-48 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm
                   focus:border-primary focus:ring focus:ring-primary/30"
        placeholder="Amount (USD)"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button
        onClick={handleDeposit}
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Deposit"}
      </button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
