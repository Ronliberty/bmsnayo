"use client";

import React, { useState, useEffect } from "react";

export default function WithdrawWidget() {
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<"paypal" | "crypto">("paypal");
  const [details, setDetails] = useState("");
  const [confirmDetails, setConfirmDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");
  const [isEmailMatch, setIsEmailMatch] = useState<boolean | null>(null);

  // simple email validation
  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // live check for PayPal confirm email
  useEffect(() => {
    if (method === "paypal" && confirmDetails.length > 0) {
      setIsEmailMatch(details === confirmDetails);
    } else {
      setIsEmailMatch(null);
    }
  }, [details, confirmDetails, method]);

  async function handleWithdraw() {
    setLoading(true);
    setMessage("");
    setStatus("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage("Please enter a valid withdrawal amount.");
      setStatus("error");
      setLoading(false);
      return;
    }

    if (method === "paypal") {
      if (!isValidEmail(details)) {
        setMessage("Please enter a valid PayPal email address.");
        setStatus("error");
        setLoading(false);
        return;
      }
      if (!isEmailMatch) {
        setMessage("Emails do not match. Please confirm correctly.");
        setStatus("error");
        setLoading(false);
        return;
      }
    } else if (method === "crypto") {
      if (!details.trim()) {
        setMessage("Please enter a crypto wallet address.");
        setStatus("error");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payouts/request/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: parsedAmount, method, details }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to request payout");

      setMessage("✅ Payout request submitted.");
      setStatus("success");
      setAmount("");
      setDetails("");
      setConfirmDetails("");
      setIsEmailMatch(null);
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  const isSubmitDisabled =
    loading ||
    !amount ||
    parseFloat(amount) <= 0 ||
    (method === "paypal" &&
      (!isValidEmail(details) || !isEmailMatch || !confirmDetails));

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
        <label className="block text-sm font-medium">Withdrawal Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as "paypal" | "crypto")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm
                     focus:border-primary focus:ring focus:ring-primary/30"
        >
          <option value="paypal">PayPal</option>
          <option value="crypto">Crypto</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {method === "paypal" ? "PayPal Email" : "Crypto Address"}
        </label>
        <input
          type={method === "paypal" ? "email" : "text"}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm
                     focus:border-primary focus:ring focus:ring-primary/30"
          placeholder={method === "paypal" ? "Enter PayPal email" : "Enter crypto wallet address"}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      {method === "paypal" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Confirm PayPal Email</label>
          <input
            type="email"
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm
              ${isEmailMatch === false ? "border-red-500" : ""}
              ${isEmailMatch === true ? "border-green-500" : "border-input"}
              focus:border-primary focus:ring focus:ring-primary/30`}
            placeholder="Re-enter PayPal email"
            value={confirmDetails}
            onChange={(e) => setConfirmDetails(e.target.value)}
          />
          {isEmailMatch === false && (
            <p className="text-xs text-red-500">Emails do not match.</p>
          )}
          {isEmailMatch === true && (
            <p className="text-xs text-green-600">Emails match ✅</p>
          )}
        </div>
      )}

      <button
        onClick={handleWithdraw}
        disabled={isSubmitDisabled}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Request Payout"}
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
