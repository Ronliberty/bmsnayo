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
    <div className="p-3 sm:p-4 md:p-6 space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Finance
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your balance and transactions
        </p>
      </div>

      {/* Account balance */}
      <Card className="p-4 sm:p-5 md:p-6 shadow-sm">
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading balance…
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive">
            Error: {error}
          </p>
        )}

        {account && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base sm:text-lg font-medium text-muted-foreground">
              Account Balance
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">
              {account.currency}{" "}
              {parseFloat(account.balance).toFixed(2)}
            </p>
          </div>
        )}
      </Card>

      {/* Tabs (mobile-friendly) */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors shrink-0 ${
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="space-y-5">
        {tab === "overview" && (
          <>
            <Card className="p-4 sm:p-5 md:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Financial Overview
              </h2>
              <AnalyticsSummary />
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 shadow-sm">
              <Charts />
            </Card>
          </>
        )}

        {tab === "deposit" && (
          <Card className="p-4 sm:p-5 md:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Deposit Funds
            </h2>
            <DepositWidget />
          </Card>
        )}

        {tab === "withdraw" && (
          <Card className="p-4 sm:p-5 md:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Withdraw Funds
            </h2>
            <WithdrawWidget />
          </Card>
        )}

        {tab === "transactions" && (
          <Card className="p-4 sm:p-5 md:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Transaction History
            </h2>
            <TransactionsTable />
          </Card>
        )}
      </div>
    </div>
  );
}
