"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AvailablePartnerships from "@/components/partnership/AvailablePartnerships";
import MyPartnerships from "@/components/partnership/MyPartnerships";

export default function PartnershipsPage() {
  const [activeTab, setActiveTab] = useState<"available" | "joined">("available");

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Partnership Programs
      </h1>

      {/* Tab Buttons */}
      <div className="flex gap-3">
        <Button
          variant={activeTab === "available" ? "default" : "outline"}
          size="lg"
          onClick={() => setActiveTab("available")}
        >
          Available Partnerships
        </Button>
        <Button
          variant={activeTab === "joined" ? "default" : "outline"}
          size="lg"
          onClick={() => setActiveTab("joined")}
        >
          My Partnerships
        </Button>
      </div>

      {/* Tab Content */}
      <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        {activeTab === "available" && <AvailablePartnerships />}
        {activeTab === "joined" && <MyPartnerships />}
      </div>
    </div>
  );
}
