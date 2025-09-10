"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

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
  price: string;
  currency: string;
  seller_name: string;
  media: Media[];
};

export default function WishlistPage() {
  const { access } = useAuth();
  const [wishlist, setWishlist] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWishlist() {
      if (!access) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });

        const text = await res.text();
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const data = JSON.parse(text);
        // WishlistSerializer returns item under "item"
        setWishlist(data.map((w: any) => w.item));
      } catch (error: any) {
        console.error("Error fetching wishlist:", error);
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [access]);

  const removeFromWishlist = async (itemId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/${itemId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${access}` },
      });

      if (!res.ok) throw new Error("Failed to remove item");

      setWishlist((prev) => prev.filter((i) => i.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Wishlist</h2>

      {loading && <p className="text-sm text-muted-foreground">Loading wishlist...</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {wishlist.length === 0 && !loading ? (
        <p className="text-muted-foreground">Your wishlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {wishlist.map((item) => (
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
                <p className="mt-2 font-semibold">
                  {item.currency} {item.price}
                </p>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="outline" onClick={() => removeFromWishlist(item.id)}>
                  Remove
                </Button>
                <Link href={`/dashboard/marketplace/${item.id}`}>
                  <Button>
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
