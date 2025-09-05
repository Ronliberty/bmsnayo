// components/partnerships/ReferralWidget.tsx
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  referralLink: string;
  stats: { total_refs: number; active_refs: number; earned: number };
};

export function ReferralWidget({ referralLink, stats }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("copy failed", e);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Program</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Share your referral link — earn commission when referrals join & convert.
        </p>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 rounded-md border px-3 py-2 bg-muted text-sm"
            />
            <Button size="sm" onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
          </div>
        </div>

        <div className="flex gap-3">
          <div>
            <div className="text-sm font-semibold">{stats.total_refs}</div>
            <div className="text-xs text-muted-foreground">Total refs</div>
          </div>
          <div>
            <div className="text-sm font-semibold">{stats.active_refs}</div>
            <div className="text-xs text-muted-foreground">Active refs</div>
          </div>
          <div>
            <div className="text-sm font-semibold">${stats.earned.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Earned</div>
          </div>
        </div>

        <div className="mt-3">
          <Badge variant="default">Share & Earn</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
