"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type Media = {
  id: string;
  media_type: string;
  file?: string;
  link?: string;
};

type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  item_type: string;
  price: string;
  currency: string;
  tags: string[];
  created_at: string;
  seller_id: string;
  seller_name: string;
  media: Media[];
};

export default function MarketplacePage() {
  const { access } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      if (!access) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/market/items/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Raw Response:", text);

        if (!res.ok) throw new Error(`Failed with status ${res.status}`);

        const data = JSON.parse(text);
        setItems(data);
      } catch (error: any) {
        console.error("Error fetching marketplace items:", error);
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [access]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Marketplace</h2>
      <p className="text-muted-foreground">
        Browse services, apps, and websites from freelancers and companies.
      </p>

      {loading && <p className="text-sm text-muted-foreground">Loading items...</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{item.seller_name}</p>
            </CardHeader>

            <CardContent className="space-y-2">
              {item.media.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {item.media.map((m) => (
                    <img
                      key={m.id}
                      src={m.file || m.link || ""}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground">{item.description}</p>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 rounded">{tag}</span>
                  ))}
                </div>
              )}

              <p className="mt-2 font-semibold">
                {item.currency} {item.price}
              </p>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button variant="outline">Wishlist</Button>
              <Button>Buy Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
