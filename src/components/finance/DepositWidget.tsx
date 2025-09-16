"use client";

import React, { useState } from "react";

export default function DepositWidget() {
  const [amount, setAmount] = useState<string>("");
  const [provider, setProvider] = useState<"stripe" | "paypal" | "crypto">("stripe");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  async function handleDeposit() {
    setLoading(true);
    setMessage("");
    setStatus("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage("Please enter a valid deposit amount.");
      setStatus("error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/deposit/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parsedAmount,
            provider,
            currency: "USD", // optional, backend defaults to USD
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create deposit");

      if (provider === "stripe") {
        setMessage("Deposit initiated. Complete payment via Stripe Checkout.");
      } else if (provider === "paypal") {
        setMessage("Deposit created. Redirecting to PayPal...");
        // TODO: handle redirect with PayPal link once backend returns it
      } else if (provider === "crypto") {
        setMessage("Deposit created. Follow instructions for crypto transfer.");
      }

      setStatus("success");
      setAmount(""); // reset
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-md shadow-sm">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Amount (USD)</label>
        <input
          type="number"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm
                     focus:border-primary focus:ring focus:ring-primary/30"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Payment Method</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as any)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm
                     focus:border-primary focus:ring focus:ring-primary/30"
        >
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
          <option value="crypto">Crypto</option>
        </select>
      </div>

      <button
        onClick={handleDeposit}
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Deposit"}
      </button>

      {message && (
        <p
          className={`text-sm font-medium ${
            status === "success"
              ? "text-green-600"
              : status === "error"
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
