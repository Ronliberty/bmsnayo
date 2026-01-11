"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

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
  const [sellerStatus, setSellerStatus] = useState<"loading" | "none" | "pending" |"rejected" | "approved">("loading");
  const [listings, setListings] = useState<Listing[]>([]);
  const [earnings, setEarnings] = useState<Earnings>({ in_escrow: 0, released: 0 });
  const [loadingData, setLoadingData] = useState(false);

  // Form states
  const [brand, setBrand] = useState("");
  const [desc, setDesc] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"service" | "app" | "website">("service");

  // 1. Fetch seller application status
  useEffect(() => {
    if (!access) {
      setSellerStatus("none");
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/applications/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
          cache: "no-store", // ← important during development
        });

        if (!res.ok) {
          throw new Error(`Status fetch failed: ${res.status}`);
        }

        const data = await res.json();
        const applications = data.results ?? []; // ← the fix is here!

        if (applications.length === 0) {
          setSellerStatus("none");
        } else {
          const statusRaw = applications[0]?.status?.toLowerCase() || "";
          if (statusRaw === "approved") {
            setSellerStatus("approved");
          } else if (statusRaw === "pending") {
            setSellerStatus("pending");
            } else if (statusRaw === "rejected") {
            setSellerStatus("rejected");
          } else {
            setSellerStatus("none");
          }
        }
      } catch (err) {
        console.error("Error fetching seller status:", err);
        setSellerStatus("none");
      }
    };

    fetchStatus();
  }, [access]);

  // 2. Load listings + earnings only when approved
  useEffect(() => {
    if (sellerStatus !== "approved" || !access) return;

    const fetchSellerData = async () => {
      setLoadingData(true);
      try {
        const [listingsRes, earningsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/my-items/`, {
            headers: { Authorization: `Bearer ${access}` },
            cache: "no-store",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/escrows/`, {
            headers: { Authorization: `Bearer ${access}` },
            cache: "no-store",
          }),
        ]);

        if (listingsRes.ok) {
          const items = await listingsRes.json();
          setListings(Array.isArray(items) ? items : items.results || []);
        }

        if (earningsRes.ok) {
          setEarnings(await earningsRes.json());
        }
      } catch (err) {
        console.error("Error loading seller data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchSellerData();
  }, [access, sellerStatus]);

  // Apply for seller program
  const applySeller = async () => {
    if (!access || !brand.trim()) return;

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
        const errorText = await res.text();
        console.error("Application failed:", errorText);
        alert("Failed to submit application");
        return;
      }

      setSellerStatus("pending");
    } catch (err) {
      console.error("Apply error:", err);
      alert("Network error while applying");
    }
  };

  // Add new listing
  const addListing = async () => {
    if (!access || !newTitle.trim() || !newPrice) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          title: newTitle,
          price: Number(newPrice) || 0,
          currency: "USD",
          description: newDesc,
          item_type: newType,
          tags: ["general"],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Add listing error:", errorData);
        alert(`Failed: ${errorData.detail || "Unknown error"}`);
        return;
      }

      const newItem = await res.json();
      setListings((prev) => [...prev, newItem]);

      // Reset form
      setNewTitle("");
      setNewPrice("");
      setNewDesc("");
      setNewType("service");
    } catch (err) {
      console.error("Add listing network error:", err);
      alert("Failed to add listing");
    }
  };

  // ── RENDERING ───────────────────────────────────────────────────────

  if (sellerStatus === "loading") {
    return <div className="p-10 text-center">Loading seller status...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* No application yet */}
      {sellerStatus === "none" && (
        <Card>
          <CardHeader>
            <CardTitle>Join Our Seller Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-muted-foreground">
              Become a seller and start listing your services, apps, or websites.
            </p>
            <div className="space-y-4">
              <div>
                <Label>Business / Brand Name *</Label>
                <Input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Emzy Digital"
                />
              </div>
              <div>
                <Label>Short Description / Experience</Label>
                <Input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Tell us about your experience..."
                />
              </div>
              <Button onClick={applySeller} disabled={!brand.trim()}>
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending review */}
      {sellerStatus === "pending" && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle>Application Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800">
              Thank you for applying! Your application is currently being reviewed.
              <br />
              You will be notified once a decision has been made.
            </p>
          </CardContent>
        </Card>
      )}
      {sellerStatus === "rejected" && (
  <Card className="bg-red-50 border-red-200">
    <CardHeader>
      <CardTitle>Application Rejected</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-red-800">
        Unfortunately, your previous seller application was not approved.
      </p>
      
      {/* Optional: show reason if API provides it */}
      {/* {application?.rejection_reason && (
        <p className="text-sm text-red-700 mt-2">
          Reason: {application.rejection_reason}
        </p>
      )} */}

      <p className="text-muted-foreground">
        You can submit a new application with updated information.
      </p>

      {/* Re-application form - same as "none" but with different title */}
      <div className="space-y-4 mt-6">
        <div>
          <Label>Business / Brand Name *</Label>
          <Input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Emzy Digital"
          />
        </div>
        <div>
          <Label>Short Description / Experience</Label>
          <Input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Tell us about your experience... (you may want to improve this)"
          />
        </div>
        <Button 
          onClick={applySeller} 
          disabled={!brand.trim()}
          variant="destructive" // makes it stand out
        >
          Submit New Application
        </Button>
      </div>
    </CardContent>
  </Card>
)}

      {/* Approved → full dashboard */}
      {sellerStatus === "approved" && (
        <Card>
          <CardHeader>
            <CardTitle>Seller Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <p className="text-center py-8">Loading your data...</p>
            ) : (
              <Tabs defaultValue="listings" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="add">Add New Item</TabsTrigger>
                </TabsList>

                <TabsContent value="listings" className="space-y-4">
                  {listings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      You don't have any listings yet. Add your first one!
                    </p>
                  ) : (
                    listings.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.currency} {item.price} • {item.status}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="earnings" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">In Escrow</p>
                      <p className="text-3xl font-bold">${earnings.in_escrow}</p>
                    </div>
                    <div className="p-6 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Released</p>
                      <p className="text-3xl font-bold">${earnings.released}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="add" className="space-y-5 pt-4">
                  {/* Your add listing form here - same as before */}
                  {/* ... paste your existing form fields ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* title, price, type, desc */}
                  </div>
                  <Button onClick={addListing} className="mt-4">
                    Create Listing
                  </Button>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}