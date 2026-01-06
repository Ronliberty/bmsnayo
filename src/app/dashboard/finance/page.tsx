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
import { Skeleton } from "@/components/ui/skeleton"; // assuming you have a Skeleton component

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
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-5 pb-24"> 
      {/* pb-24 to account for mobile footer */}

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Finance
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your balance and transactions
        </p>
      </div>

      {/* Account Balance */}
      <Card className="p-4 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        {loading ? (
          <Skeleton className="h-6 w-32 sm:w-48 rounded-md" />
        ) : error ? (
          <p className="text-sm text-destructive">Error: {error}</p>
        ) : (
          <>
            <h2 className="text-base sm:text-lg font-medium text-muted-foreground">
              Account Balance
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
              {account.currency} {parseFloat(account.balance).toFixed(2)}
            </p>
          </>
        )}
      </Card>

      {/* Tabs */}
      <div className="overflow-x-auto no-scrollbar mb-2">
        <div className="flex gap-2 w-max">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`shrink-0 px-4 py-2 text-sm sm:text-base font-medium rounded-full transition-colors whitespace-nowrap ${
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {loading ? (
          // Skeleton for all tabs content
          <>
            <Card className="p-4 shadow-sm">
              <Skeleton className="h-6 w-32 mb-3 rounded-md" />
              <Skeleton className="h-40 rounded-md" />
            </Card>
            <Card className="p-4 shadow-sm">
              <Skeleton className="h-6 w-32 mb-3 rounded-md" />
              <Skeleton className="h-40 rounded-md" />
            </Card>
          </>
        ) : tab === "overview" ? (
          <>
            <Card className="p-4 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold mb-2">
                Financial Overview
              </h2>
              <AnalyticsSummary />
            </Card>

            <Card className="p-4 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold mb-2">Charts</h2>
              <Charts />
            </Card>
          </>
        ) : tab === "deposit" ? (
          <Card className="p-4 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Deposit Funds</h2>
            <DepositWidget />
          </Card>
        ) : tab === "withdraw" ? (
          <Card className="p-4 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Withdraw Funds</h2>
            <WithdrawWidget />
          </Card>
        ) : tab === "transactions" ? (
          <Card className="p-4 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold mb-2">
              Transaction History
            </h2>
            <TransactionsTable />
          </Card>
        ) : null}
      </div>
    </div>
  );
}
