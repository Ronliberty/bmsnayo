"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AvailablePartnerships from "@/components/partnership/AvailablePartnerships";
import MyPartnerships from "@/components/partnership/MyPartnerships";
import ChatLauncher from "@/components/Chat/ChatLauncher";
import ChatModal from "@/components/Chat/ChatModal";

export default function PartnershipsPage() {
  const [activeTab, setActiveTab] = useState<"available" | "joined">("available");
  const [isOpen, setIsOpen] = useState(false);

  return (
 
<>
    <div className="p-4 md:p-6 space-y-6">
  {/* Page Title */}
  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
    Partnership Programs
  </h1>

  {/* Tab Buttons */}
  <div className="flex flex-col sm:flex-row gap-3">
    <Button
      variant={activeTab === "available" ? "default" : "outline"}
      size="lg"
      className="w-full sm:w-auto"
      onClick={() => setActiveTab("available")}
    >
      Available Partnerships
    </Button>

    <Button
      variant={activeTab === "joined" ? "default" : "outline"}
      size="lg"
      className="w-full sm:w-auto"
      onClick={() => setActiveTab("joined")}
    >
      My Partnerships
    </Button>
  </div>

  {/* Tab Content */}
  <div className="mt-4 md:mt-6 rounded-lg border border-border bg-card p-4 md:p-6 shadow-sm">
    {activeTab === "available" && <AvailablePartnerships />}
    {activeTab === "joined" && <MyPartnerships />}
  </div>
</div>

<ChatLauncher onOpen={() => setIsOpen(true)} />
<ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
</>

  );
}
