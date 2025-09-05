"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";

// Mock marketplace data
const mockMarketplaceItems = [
  {
    id: "1",
    seller: { name: "Alice Dev", trust: 92 },
    type: "service",
    title: "Custom Website Development",
    description: "I will build you a modern, responsive website.",
    price: 500,
    currency: "USD",
  },
  {
    id: "2",
    seller: { name: "CodeGuru Apps", trust: 85 },
    type: "app",
    title: "AI Note-Taking App",
    description: "A lightweight AI-powered note-taking app.",
    price: 20,
    currency: "USD",
  },
  {
    id: "3",
    seller: { name: "WebSmiths", trust: 78 },
    type: "website",
    title: "Pre-built E-commerce Template",
    description: "Launch your shop instantly with this template.",
    price: 99,
    currency: "USD",
  },
];

export default function P2pPage() {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const categories = ["all", "service", "app", "website"];
  const filteredItems = (type: string) =>
    type === "all" ? mockMarketplaceItems : mockMarketplaceItems.filter((item) => item.type === type);

  return (
    <div className="p-6 space-y-6">
        <Link href="/dashboard/p2p/seller" className="text-sm text-blue-500 mb-4 inline-block">Sell</Link>
     <Link href="/dashboard/marketplace" className="text-sm text-blue-500 mb-4 inline-block">Market</Link>
      <h1 className="text-2xl font-bold">Marketplace</h1>
      <p className="text-muted-foreground">Browse and purchase items securely with escrow protection.</p>

      <Tabs defaultValue="all">
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems(cat).map((item) => (
                <Card key={item.id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Seller: {item.seller.name} (Trust {item.seller.trust}%)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{item.description}</p>
                    <p className="font-semibold">
                      {item.price} {item.currency}
                    </p>
                    <Button className="mt-3" onClick={() => setSelectedItem(item)}>
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Escrow Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy {selectedItem?.title}</DialogTitle>
            <DialogDescription>
              Your payment will be held in escrow until the seller delivers the product/service.
            </DialogDescription>
          </DialogHeader>
          <p className="mt-2 text-sm">Price: {selectedItem?.price} {selectedItem?.currency}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>Cancel</Button>
            <Button>Proceed to Pay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
