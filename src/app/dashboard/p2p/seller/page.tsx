"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock seller data
const mockSellerItems = [
  { id: "1", title: "Custom Website Development", price: 500, currency: "USD", status: "Active" },
  { id: "2", title: "Mobile App Design", price: 250, currency: "USD", status: "Active" },
];

const mockOrders = [
  { id: "101", item: "Custom Website Development", buyer: "John Doe", status: "In Escrow" },
  { id: "102", item: "Mobile App Design", buyer: "Jane Smith", status: "Completed" },
];

export default function SellerDashboard() {
  return (
    <div className="p-6 space-y-6">
        <Link href="/dashboard/p2p" className="text-sm text-blue-500 mb-4 inline-block">Buy</Link>
        <Link href="/dashboard/marketplace" className="text-sm text-blue-500 mb-4 inline-block">Market</Link>
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      <p className="text-muted-foreground">Manage your listings and track escrow earnings.</p>

      {/* Earnings Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">In Escrow: $500</p>
          <p className="text-lg font-semibold">Released: $1,200</p>
        </CardContent>
      </Card>

      {/* Listings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSellerItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.price} {item.currency} - {item.status}</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
            ))}
          </div>
          <Button className="mt-4">+ Add New Listing</Button>
        </CardContent>
      </Card>

      {/* Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-medium">{order.item}</p>
                  <p className="text-sm text-muted-foreground">Buyer: {order.buyer}</p>
                </div>
                <span className="text-sm font-semibold">{order.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
