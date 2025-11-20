// app/finance/page.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { AnalyticsSummary } from "@/components/analytics/AnalyticsSummary";
import { Charts } from "@/components/analytics/Charts";
import DepositWidget from "@/components/finance/DepositWidget";
import WithdrawWidget from "@/components/finance/WithdrawWidget";
import TransactionsTable from "@/components/finance/TransactionsTable";
import { useAccountBalance } from "@/app/hooks/useAccountBalance";

export default function FinancePage() {
  const [tab, setTab] = useState<"overview" | "deposit" | "withdraw" | "transactions">("overview");
  const { account, loading, error } = useAccountBalance();

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "deposit", label: "Deposit" },
    { key: "withdraw", label: "Withdraw" },
    { key: "transactions", label: "Transactions" },
  ];

  return (
  <div className="p-4 md:p-6 space-y-6">
  {/* Page header */}
  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Finance</h1>

  {/* Account balance */}
  <Card className="p-4 md:p-6 shadow-md">
    {loading && <p>Loading balance...</p>}
    {error && <p className="text-red-500">Error: {error}</p>}

    {account && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg md:text-xl font-semibold">Account Balance</h2>
        <p className="text-xl md:text-2xl font-bold break-words text-right sm:text-left">
          {account.currency} {parseFloat(account.balance).toFixed(2)}
        </p>
      </div>
    )}
  </Card>

  {/* Local navigation */}
  <div className="flex overflow-x-auto no-scrollbar space-x-2 border-b border-border pb-1">
    {tabs.map((t) => (
      <button
        key={t.key}
        onClick={() => setTab(t.key as any)}
        className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium rounded-t-md whitespace-nowrap transition-colors ${
          tab === t.key
            ? "bg-primary text-primary-foreground shadow"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        {t.label}
      </button>
    ))}
  </div>

  {/* Tabs content */}
  <div>
    {tab === "overview" && (
      <div className="space-y-6">
        <Card className="p-4 md:p-6 shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Financial Overview</h2>
          <AnalyticsSummary />
        </Card>

        <Card className="p-4 md:p-6 shadow-md">
          <Charts />
        </Card>
      </div>
    )}

    {tab === "deposit" && (
      <Card className="p-4 md:p-6 shadow-md">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Deposit Funds</h2>
        <DepositWidget />
      </Card>
    )}

    {tab === "withdraw" && (
      <Card className="p-4 md:p-6 shadow-md">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Withdraw Funds</h2>
        <WithdrawWidget />
      </Card>
    )}

    {tab === "transactions" && (
      <Card className="p-4 md:p-6 shadow-md">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Transaction History</h2>
        <TransactionsTable />
      </Card>
    )}
  </div>
</div>

  );
}
