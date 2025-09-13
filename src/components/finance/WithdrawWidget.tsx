"use client";

import React, { useState } from "react";

export default function WithdrawWidget() {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState("paypal");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleWithdraw() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payouts/request/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, method, details }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to request payout");

      setMessage("✅ Payout request submitted.");
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

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="w-48 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm
                   focus:border-primary focus:ring focus:ring-primary/30"
      >
        <option value="paypal">PayPal</option>
        <option value="crypto">Crypto</option>
      </select>

      <input
        type="text"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm
                   focus:border-primary focus:ring focus:ring-primary/30"
        placeholder="PayPal email or Crypto address"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      <button
        onClick={handleWithdraw}
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Request Payout"}
      </button>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
