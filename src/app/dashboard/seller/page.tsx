"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SellerProgramPage() {
  // Mock user status: "none" | "pending" | "approved"
  const [sellerStatus, setSellerStatus] = useState("none");

  // Mock listings & earnings (for approved sellers)
  const listings = [
    { id: 1, title: "AI Chatbot Service", price: "$199", orders: 12 },
    { id: 2, title: "Portfolio Website Template", price: "$49", orders: 34 },
  ];

  const earnings = {
    total: "$3,420",
    month: "$820",
    pending: "$120",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {sellerStatus === "none" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Join Our Seller Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Become a trusted seller on our platform. Reach thousands of buyers, 
                get access to analytics, and grow your business.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Access to trusted buyers and companies</li>
                <li>Analytics & insights for your products</li>
                <li>Low seller fees and secure payments</li>
                <li>Partnership and referral opportunities</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Program Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>No scams, illegal, or misleading content</li>
                <li>Be honest about your product/service</li>
                <li>Respect buyer privacy and terms</li>
                <li>Comply with transaction & refund rules</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apply to Become a Seller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brand">Business / Brand Name</Label>
                <Input id="brand" placeholder="Your brand name" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="Web Apps, Services, Consulting..." />
              </div>
              <div>
                <Label htmlFor="description">Short Description</Label>
                <Input id="description" placeholder="What do you sell?" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" />
                <Label htmlFor="terms">
                  I agree to the Seller Program Terms.
                </Label>
              </div>
              <Button onClick={() => setSellerStatus("pending")}>Apply</Button>
            </CardContent>
          </Card>
        </>
      )}

      {sellerStatus === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Application Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your seller application is currently <strong>pending</strong>. Our team will review 
              your request and notify you once approved.
            </p>
            <Button variant="secondary" className="mt-4" onClick={() => setSellerStatus("approved")}>Mock Approve</Button>
          </CardContent>
        </Card>
      )}

      {sellerStatus === "approved" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Seller Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="listings">
                <TabsList>
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="add">Add New</TabsTrigger>
                </TabsList>

                <TabsContent value="listings" className="space-y-3 mt-4">
                  {listings.map((item) => (
                    <Card key={item.id} className="p-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p>{item.price} — {item.orders} orders</p>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="earnings" className="space-y-2 mt-4">
                  <p>Total Earnings: <strong>{earnings.total}</strong></p>
                  <p>This Month: <strong>{earnings.month}</strong></p>
                  <p>Pending: <strong>{earnings.pending}</strong></p>
                </TabsContent>

                <TabsContent value="add" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title">Item Title</Label>
                    <Input id="title" placeholder="Product or Service name" />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" placeholder="$99" />
                  </div>
                  <div>
                    <Label htmlFor="desc">Description</Label>
                    <Input id="desc" placeholder="Describe your item" />
                  </div>
                  <Button>Add Listing</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
