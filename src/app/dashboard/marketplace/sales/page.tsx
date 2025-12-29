"use client";

import { useState, useEffect } from "react";
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
  const [itemType, setItemType] = useState<"service" | "app" | "website">(
    "service"
  );
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitItem() {
    if (!access) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
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
        const data = await res.json();
        setError(
          data?.detail || "Failed to create item. Please check your input."
        );
        return;
      }

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setItemType("service");

      setSuccess(true);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-hide success message
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Marketplace Item</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SUCCESS UI */}
          {success && (
            <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-green-800">
              <p className="font-medium">✅ Item created successfully</p>
              <p className="text-sm">
                Your listing is now available in the marketplace.
              </p>
            </div>
          )}

          {/* ERROR UI */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product or service name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you are offering"
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="99"
            />
          </div>

          <div>
            <Label htmlFor="type">Item Type</Label>
            <select
              id="type"
              value={itemType}
              onChange={(e) =>
                setItemType(e.target.value as "service" | "app" | "website")
              }
              className="border rounded-md p-2 w-full"
            >
              <option value="service">Service</option>
              <option value="app">App</option>
              <option value="website">Website</option>
            </select>
          </div>

          <Button
            onClick={submitItem}
            disabled={loading || !title || !price}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Item"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
