"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, DollarSign, Heart } from "lucide-react";
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
  item_type: string;
  price: string;
  currency: string;
  tags: string[];
  created_at: string;
  seller: number;
  seller_name: string;
  media: Media[];
};

export default function MarketplacePage() {
  const { access, user } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showP2POptions, setShowP2POptions] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [userOrders, setUserOrders] = useState<number[]>([]);
  const [buyerCount, setBuyerCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);

  // Fetch items
  useEffect(() => {
    async function fetchItems() {
      if (!access) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/items/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const data = await res.json();
        setItems(data);
      } catch (error: any) {
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [access]);

  // Fetch buyer & seller orders
  useEffect(() => {
    if (!access) return;

    async function fetchOrders() {
      try {
        // Buyer orders
        const buyerRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/orders/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        if (buyerRes.ok) {
          const buyerData = await buyerRes.json();
          const activeBuyerOrders = buyerData.filter(
            (o: any) => o.status !== "completed" && o.status !== "cancelled"
          );
          setUserOrders(activeBuyerOrders.map((o: any) => o.item.id));
          setBuyerCount(activeBuyerOrders.length);
        }

        // Seller orders
        const sellerRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/orders/?role=seller`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        if (sellerRes.ok) {
          const sellerData = await sellerRes.json();
          const activeSellerOrders = sellerData.filter(
            (o: any) => o.status !== "completed" && o.status !== "cancelled"
          );
          setSellerCount(activeSellerOrders.length);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchOrders();
  }, [access]);

  // Add to wishlist
  const handleWishlist = async (itemId: string) => {
    if (!access) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ item_id: itemId }),
        }
      );

      if (!res.ok) throw new Error("Failed to add to wishlist");
      setWishlistItems((prev) => [...prev, parseInt(itemId)]);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  // Place order
  const handleBuy = async (itemId: string) => {
    if (!access) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ item_id: itemId }),
        }
      );

      if (!res.ok) throw new Error("Failed to place order");
      setUserOrders((prev) => [...prev, parseInt(itemId)]);
      setBuyerCount((prev) => prev + 1);
    } catch (error) {
      console.error("Order error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Marketplace</h2>

      {/* Go to P2P Button */}
      <Button
        onClick={() => setShowP2POptions((prev) => !prev)}
        className="px-4 py-2 rounded-full bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
      >
        Go to P2P ({buyerCount} buys / {sellerCount} sells)
      </Button>

      {/* P2P mode navigation */}
      {showP2POptions && (
        <div className="flex gap-4 mt-4 mb-4">
          <Link
            href="/dashboard/p2p/seller"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--primary))] text-white"
          >
            <DollarSign className="w-4 h-4" /> Sell ({sellerCount})
          </Link>
          <Link
            href="/dashboard/p2p"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--secondary))] text-white"
          >
            <ShoppingCart className="w-4 h-4" /> Buy ({buyerCount})
          </Link>
        </div>
      )}

      {loading && <p>Loading items...</p>}
      {err && <p className="text-red-600">{err}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => {
          const isOwner = user?.id === item.seller;

          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {item.seller_name}
                </p>
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

                <p className="text-sm">{item.description}</p>
                <p className="mt-2 font-semibold">
                  {item.currency} {item.price}
                </p>
              </CardContent>

              <CardFooter className="flex gap-2">
                {isOwner ? (
                  <p className="text-sm text-muted-foreground italic">
                    This is your item
                  </p>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleWishlist(item.id)}
                      disabled={wishlistItems.includes(parseInt(item.id))}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {wishlistItems.includes(parseInt(item.id))
                        ? "Added"
                        : "Wishlist"}
                    </Button>

                    <Button
                      onClick={() => handleBuy(item.id)}
                      disabled={userOrders.includes(parseInt(item.id))}
                    >
                      {userOrders.includes(parseInt(item.id))
                        ? "Ordered"
                        : "Buy Now"}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
