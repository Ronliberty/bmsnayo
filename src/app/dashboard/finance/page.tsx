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
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="pb-24"> {/* for mobile footer */}

      {/* ====================== Desktop Version ====================== */}
      <div className="hidden md:block p-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground">Manage your balance and transactions</p>

        <Card className="p-6 flex justify-between items-center shadow-sm">
          {loading ? (
            <Skeleton className="h-6 w-48 rounded-md" />
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <>
              <h2 className="text-lg font-medium text-muted-foreground">Account Balance</h2>
              <p className="text-3xl font-bold">
                {account?.currency ?? "USD"} {account ? parseFloat(account.balance).toFixed(2) : "0.00"}
              </p>
            </>
          )}
        </Card>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {loading ? (
            <>
              <Card className="p-6 shadow-sm">
                <Skeleton className="h-6 w-32 mb-4 rounded-md" />
                <Skeleton className="h-48 rounded-md" />
              </Card>
              <Card className="p-6 shadow-sm">
                <Skeleton className="h-6 w-32 mb-4 rounded-md" />
                <Skeleton className="h-48 rounded-md" />
              </Card>
            </>
          ) : tab === "overview" ? (
            <>
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
                <AnalyticsSummary />
              </Card>
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Charts</h2>
                <Charts />
              </Card>
            </>
          ) : tab === "deposit" ? (
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Deposit Funds</h2>
              <DepositWidget />
            </Card>
          ) : tab === "withdraw" ? (
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Withdraw Funds</h2>
              <WithdrawWidget />
            </Card>
          ) : tab === "transactions" ? (
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
              <TransactionsTable />
            </Card>
          ) : null}
        </div>
      </div>

      {/* ====================== Mobile Version ====================== */}
      <div className="block md:hidden p-4 space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
        <p className="text-sm text-muted-foreground">Manage your balance and transactions</p>

        <Card className="p-4 shadow-sm flex flex-col gap-2">
          {loading ? (
            <Skeleton className="h-6 w-32 rounded-md" />
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <>
              <h2 className="text-base font-medium text-muted-foreground">Account Balance</h2>
              <p className="text-2xl font-bold break-words">
                {account?.currency ?? "USD"} {account ? parseFloat(account.balance).toFixed(2) : "0.00"}
              </p>
            </>
          )}
        </Card>

        {/* Mobile Tabs (scrollable) */}
        <div className="overflow-x-auto no-scrollbar mb-2">
          <div className="flex gap-2 w-max">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as any)}
                className={`shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
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
                <h2 className="text-base font-semibold mb-2">Financial Overview</h2>
                <AnalyticsSummary />
              </Card>
              <Card className="p-4 shadow-sm">
                <h2 className="text-base font-semibold mb-2">Charts</h2>
                <Charts />
              </Card>
            </>
          ) : tab === "deposit" ? (
            <Card className="p-4 shadow-sm">
              <h2 className="text-base font-semibold mb-2">Deposit Funds</h2>
              <DepositWidget />
            </Card>
          ) : tab === "withdraw" ? (
            <Card className="p-4 shadow-sm">
              <h2 className="text-base font-semibold mb-2">Withdraw Funds</h2>
              <WithdrawWidget />
            </Card>
          ) : tab === "transactions" ? (
            <Card className="p-4 shadow-sm">
              <h2 className="text-base font-semibold mb-2">Transaction History</h2>
              <TransactionsTable />
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
