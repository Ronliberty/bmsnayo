"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";

type Listing = {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: string;
};

type Earnings = {
  in_escrow: number;
  released: number;
};

export default function SellerProgramPage() {
  const { access } = useAuth();
  const [sellerStatus, setSellerStatus] = useState<"none" | "pending" | "approved">("none");
  const [listings, setListings] = useState<Listing[]>([]);
  const [earnings, setEarnings] = useState<Earnings>({ in_escrow: 0, released: 0 });
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  // Form state for application
  const [brand, setBrand] = useState("");
  const [desc, setDesc] = useState("");

  // Form state for new listing
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState<string>(""); // ✅ keep string
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"service" | "app" | "website">("service");

  // ✅ Check seller application status
  useEffect(() => {
    if (!access) return;
    async function fetchStatus() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/applications/`, {
          headers: { Authorization: `Bearer ${access}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.length === 0) {
            setSellerStatus("none");
          } else {
            const app = data[0];
            setSellerStatus(app.status === "approved" ? "approved" : "pending");
          }
        } else {
          setSellerStatus("none");
        }
      } catch (e) {
        console.error("Error fetching seller status:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [access]);

  // ✅ Fetch listings + earnings if approved
  useEffect(() => {
    if (!access || sellerStatus !== "approved") return;

    async function fetchData() {
      try {
        const [listingsRes, earningsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/my-items/`, {
            headers: { Authorization: `Bearer ${access}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/escrows/`, {
            headers: { Authorization: `Bearer ${access}` },
          }),
        ]);

        if (listingsRes.ok) setListings(await listingsRes.json());
        if (earningsRes.ok) setEarnings(await earningsRes.json());
      } catch (e) {
        console.error("Error fetching seller data:", e);
      }
    }
    fetchData();
  }, [access, sellerStatus]);

  // ✅ Apply for seller program
  async function applySeller() {
    if (!access) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/applications/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          business_name: brand,
          experience: desc,
          portfolio_link: "https://example.com",
        }),
      });

      if (!res.ok) {
        console.error("❌ Error creating application:", await res.text());
        return;
      }

      setSellerStatus("pending");
    } catch (e) {
      console.error("Error applying:", e);
    }
  }

  // ✅ Add a new listing
  async function addListing() {
    if (!access) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          title: newTitle,
          price: Number(newPrice) || 0, // ✅ convert safely
          currency: "USD",
          description: newDesc,
          item_type: newType, // ✅ dynamic type
          tags: ["general"],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Add Listing error:", data);
        alert(`Add Listing failed: ${JSON.stringify(data)}`);
        return;
      }

      setListings((prev) => [...prev, data]);

      // reset form
      setNewTitle("");
      setNewPrice("");
      setNewDesc("");
      setNewType("service");
    } catch (e) {
      console.error("🔥 Network/Other error:", e);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {sellerStatus === "none" && (
        <Card>
          <CardHeader>
            <CardTitle>Join Our Seller Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Fill out the application to become a seller.</p>
            <div>
              <Label htmlFor="brand">Business / Brand Name</Label>
              <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Short Description</Label>
              <Input id="description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <Button onClick={applySeller}>Apply</Button>
          </CardContent>
        </Card>
      )}

      {sellerStatus === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Application Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your application is pending. You’ll be notified once approved.</p>
          </CardContent>
        </Card>
      )}

      {sellerStatus === "approved" && (
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
                    <p>
                      {item.currency} {item.price} — {item.status}
                    </p>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="earnings" className="space-y-2 mt-4">
                <p>
                  In Escrow: <strong>${earnings.in_escrow}</strong>
                </p>
                <p>
                  Released: <strong>${earnings.released}</strong>
                </p>
              </TabsContent>

              <TabsContent value="add" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Item Title</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Product or Service name"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="99"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Item Type</Label>
                  <select
                    id="type"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "service" | "app" | "website")}
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="service">Service</option>
                    <option value="app">App</option>
                    <option value="website">Website</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="desc">Description</Label>
                  <Input
                    id="desc"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe your item"
                  />
                </div>

                <Button onClick={addListing}>Add Listing</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
