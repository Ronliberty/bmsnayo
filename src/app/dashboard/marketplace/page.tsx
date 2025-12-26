
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccountBalance } from "@/app/hooks/useAccountBalance";
import { OrdersCart } from "@/components/marketplace/OrdersCart";

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
  seller: number;
  seller_name: string;
  delivery_type?: "instant" | "manual";
  media?: Media[];
  availability_quantity: number;
  item_type: "service" | "app" | "website";
};

export default function MarketplacePage() {
  const { access, user } = useAuth();
  const router = useRouter();
  const { account, refresh: refreshAccount } = useAccountBalance();

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [userOrders, setUserOrders] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [showDepositModal, setShowDepositModal] = useState<{
    visible: boolean;
    item?: MarketplaceItem;
  }>({ visible: false });

  /* =======================
     Fetch marketplace items
     ======================= */
  useEffect(() => {
    if (!access) return;

    async function fetchItems() {
      try {
        setLoading(true);
        setErr(null);

        const r = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/items/`,
          {
            headers: { Authorization: `Bearer ${access}` },
          }
        );

        if (!r.ok) throw new Error("Failed to load items");

        const data = await r.json();

        // ✅ DRF pagination-safe
        setItems(Array.isArray(data.results) ? data.results : []);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [access]);

  /* =======================
     Fetch user orders
     ======================= */
  useEffect(() => {
    if (!access) return;

    async function fetchOrders() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/orders/`,
          { headers: { Authorization: `Bearer ${access}` } }
        );

        if (!res.ok) return;

        const data = await res.json();
        const orders = Array.isArray(data.results)
          ? data.results
          : data;

        const active = orders.filter(
          (o: any) =>
            o.status !== "completed" && o.status !== "cancelled"
        );

        setUserOrders(active.map((o: any) => o.item.id));
      } catch (e) {
        console.error(e);
      }
    }

    fetchOrders();
  }, [access]);

  /* =======================
     Fetch wishlist
     ======================= */
  useEffect(() => {
    if (!access) return;

    async function fetchWishlist() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/`,
          { headers: { Authorization: `Bearer ${access}` } }
        );

        if (!res.ok) return;

        const data = await res.json();
        const wishlist = Array.isArray(data.results)
          ? data.results
          : data;

        setWishlistItems(wishlist.map((w: any) => w.item.id));
      } catch (e) {
        console.error(e);
      }
    }

    fetchWishlist();
  }, [access]);

  async function handleWishlist(itemId: string, sellerId: number) {
    if (!access || sellerId === user?.id) return;

    try {
      setActionLoading((s) => ({ ...s, [itemId]: true }));

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

      if (!res.ok) throw new Error("Failed to add wishlist");

      setWishlistItems((prev) => [...prev, Number(itemId)]);
      router.push("/dashboard/marketplace/wishlist");
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading((s) => ({ ...s, [itemId]: false }));
    }
  }

  async function handleBuy(item: MarketplaceItem) {
    if (!access) return;

    const price = Number(item.price);
    const currentBalance = account ? Number(account.balance) : 0;

    if (currentBalance < price) {
      setShowDepositModal({ visible: true, item });
      return;
    }

    try {
      setActionLoading((s) => ({ ...s, [item.id]: true }));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ item_id: item.id }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      router.push(`/dashboard/marketplace/orders/${data.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading((s) => ({ ...s, [item.id]: false }));
      refreshAccount();
    }
  }

  /* =======================
     UI
     ======================= */
  return (
    <div className="px-3 sm:px-6 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold">Marketplace</h2>
        <OrdersCart count={userOrders.length} />
      </div>

      {loading && <p className="text-sm">Loading items…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {!loading && !err && items.length === 0 && (
        <p className="text-muted-foreground">No items available.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isOwner = user?.id === item.seller;
          const soldOut =
            item.item_type !== "service" &&
            item.availability_quantity <= 0;

          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {item.seller_name}
                </p>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm line-clamp-3">
                  {item.description}
                </p>

                <p className="font-semibold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: item.currency,
                  }).format(Number(item.price))}
                </p>

                {soldOut && (
                  <p className="text-red-600 text-sm font-semibold">
                    Sold Out
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                {isOwner ? (
                  <p className="text-xs italic text-muted-foreground">
                    This is your item
                  </p>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleWishlist(item.id, item.seller)
                      }
                      disabled={
                        wishlistItems.includes(Number(item.id)) ||
                        actionLoading[item.id]
                      }
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Wishlist
                    </Button>

                    <Button
                      onClick={() => handleBuy(item)}
                      disabled={soldOut || actionLoading[item.id]}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Buy
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
