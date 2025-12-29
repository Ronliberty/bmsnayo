"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export default function SellerUploadPage() {
  const { access } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [itemType, setItemType] = useState<"service" | "app" | "website">("service");
  const [active, setActive] = useState(true);

  async function submitItem() {
    if (!access) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/market/items/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          title,
          description,
          item_type: itemType,
          price: Number(price),
          currency: "USD",
          tags: ["seller"],
          active,
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to create item");
      return;
    }

    alert("Item created successfully!");
    setTitle("");
    setDescription("");
    setPrice("");
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Marketplace Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <Label>Item Type</Label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value as any)}
              className="border rounded p-2 w-full"
            >
              <option value="service">Service</option>
              <option value="app">App</option>
              <option value="website">Website</option>
            </select>
          </div>

          <Button onClick={submitItem}>Create Item</Button>
        </CardContent>
      </Card>
    </div>
  );
}
