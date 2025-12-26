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
  const [tab, setTab] = useState<
    "overview" | "deposit" | "withdraw" | "transactions"
  >("overview");

  const { account, loading, error } = useAccountBalance();

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "deposit", label: "Deposit" },
    { key: "withdraw", label: "Withdraw" },
    { key: "transactions", label: "Transactions" },
  ];

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-hidden
        touch-pan-y
        p-3 sm:p-4 md:p-6
        space-y-5
        pb-[calc(env(safe-area-inset-bottom)+5.5rem)]
      "
    >
      {/* Header */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
        Finance
      </h1>

      {/* Balance */}
      <Card className="p-4 sm:p-5 md:p-6">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {account && (
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <span className="text-sm text-muted-foreground">
              Account Balance
            </span>
            <span className="text-2xl font-bold">
              {account.currency} {parseFloat(account.balance).toFixed(2)}
            </span>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 text-sm rounded-full shrink-0 transition ${
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-5">
        {tab === "overview" && (
          <>
            <Card className="p-4 sm:p-5 md:p-6">
              <AnalyticsSummary />
            </Card>

            {/* 🔒 CHART OVERFLOW FIX */}
            <Card className="p-4 sm:p-5 md:p-6 overflow-hidden">
              <div className="w-full max-w-full overflow-hidden">
                <Charts />
              </div>
            </Card>
          </>
        )}

        {tab === "deposit" && (
          <Card className="p-4 sm:p-5 md:p-6">
            <DepositWidget />
          </Card>
        )}

        {tab === "withdraw" && (
          <Card className="p-4 sm:p-5 md:p-6">
            <WithdrawWidget />
          </Card>
        )}

        {tab === "transactions" && (
          <Card className="p-4 sm:p-5 md:p-6 overflow-x-auto">
            <TransactionsTable />
          </Card>
        )}
      </div>
    </div>
  );
}
