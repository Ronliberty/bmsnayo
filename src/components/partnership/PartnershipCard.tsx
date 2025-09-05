// components/partnerships/PartnershipCard.tsx
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type PartnershipProgram = {
  id: string;
  title: string;
  description?: string;
  commission_type: "fixed" | "percentage" | "none";
  commission_value: number;
  referral_enabled: boolean;
  referral_commission_rate: number;
  eligibility?: string;
  status?: "active" | "inactive";
  tags?: string[];
};

type Props = {
  program: PartnershipProgram;
  joined?: boolean;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
};

export function PartnershipCard({ program, joined = false, onJoin, onLeave }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{program.title}</span>
          {program.referral_enabled ? (
            <Badge variant="success" className="text-xs">Referral</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">No referral</Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-3">
          {program.description || "No description provided."}
        </p>

        <div className="flex gap-3 flex-wrap">
          <div className="text-xs text-muted-foreground">
            Commission:
            {" "}
            {program.commission_type === "percentage"
              ? `${program.commission_value}%`
              : program.commission_type === "fixed"
              ? `$${program.commission_value.toFixed(2)}`
              : "None"}
          </div>

          <div className="text-xs text-muted-foreground">
            Eligibility: {program.eligibility ?? "Open to all"}
          </div>

          {program.tags?.map((t) => (
            <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        {joined ? (
          <>
            <Button variant="outline" onClick={() => onLeave?.(program.id)}>Leave</Button>
            <Button onClick={() => window.location.hash = `analytics-${program.id}`}>
              View Analytics
            </Button>
          </>
        ) : (
          <Button onClick={() => onJoin?.(program.id)}>Join Program</Button>
        )}
      </CardFooter>
    </Card>
  );
}
