"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/app/hooks/useAccountBalance";
import { ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";

/* =======================
   TYPES
   ======================= */
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
  media?: Media[];
};

/* =======================
   SKELETON CARD
   ======================= */
function WishlistSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/3 mt-2" />
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="h-40 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-1/4" />
      </CardContent>

      <CardFooter className="flex gap-2">
        <div className="h-9 bg-muted rounded w-24" />
        <div className="h-9 bg-muted rounded w-24" />
      </CardFooter>
    </Card>
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const { access } = useAuth();
  const { account, refresh: refreshAccount } = useAccountBalance();

  const [wishlist, setWishlist] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState<{
    visible: boolean;
    item?: MarketplaceItem;
  }>({ visible: false });

  /* =======================
     FETCH WISHLIST
     ======================= */
  useEffect(() => {
    async function fetchWishlist() {
      if (!access) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/`,
          { headers: { Authorization: `Bearer ${access}` } }
        );

        if (!res.ok) throw new Error("Failed to load wishlist");

        const data = await res.json();
        const raw = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : [];

        setWishlist(raw.map((w: any) => w.item ?? w));
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [access]);

  /* =======================
     TOGGLE WISHLIST (POST)
     ======================= */
  async function toggleWishlist(itemId: string) {
    if (!access) return;

    const exists = wishlist.some((i) => i.id === itemId);
    const previous = wishlist;

    // optimistic update
    setWishlist((prev) =>
      exists ? prev.filter((i) => i.id !== itemId) : prev
    );
    setProcessing(itemId);

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

      if (!res.ok) throw new Error("Wishlist toggle failed");
    } catch (e) {
      console.error(e);
      setWishlist(previous); // rollback
    } finally {
      setProcessing(null);
    }
  }

  /* =======================
     BUY NOW
     ======================= */
  async function handleBuyNow(item: MarketplaceItem) {
    try {
      setProcessing(item.id);

      const price = Number(item.price);
      const balance = account ? Number(account.balance) : 0;

      if (balance < price) {
        setShowDepositModal({ visible: true, item });
        return;
      }

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
      if (!res.ok) throw new Error(data.detail || "Order failed");

      await toggleWishlist(item.id);
      router.push(`/dashboard/marketplace/orders/${data.id}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setProcessing(null);
      refreshAccount();
    }
  }

  /* =======================
     UI
     ======================= */
  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Wishlist</h2>
        <Link href="/dashboard/marketplace">
          <Button variant="secondary">Continue Shopping</Button>
        </Link>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <WishlistSkeleton key={i} />
          ))}

        {!loading && wishlist.length === 0 && (
          <p className="text-muted-foreground">Your wishlist is empty.</p>
        )}

        {!loading &&
          wishlist.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {item.seller_name}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                {item.media?.length ? (
                  <img
                    src={item.media[0].file || item.media[0].link}
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="h-40 bg-muted rounded" />
                )}

                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>

                <p className="font-semibold">
                  {item.currency} {item.price}
                </p>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => toggleWishlist(item.id)}
                  disabled={processing === item.id}
                >
                  <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                  Remove
                </Button>

                <Button
                  onClick={() => handleBuyNow(item)}
                  disabled={processing === item.id}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {processing === item.id ? "Processing…" : "Buy Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* Deposit Modal */}
      {showDepositModal.visible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-lg font-semibold">Insufficient Balance</h3>
            <p className="text-sm text-muted-foreground">
              Your balance is not enough. Deposit funds now?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDepositModal({ visible: false })}
              >
                No
              </Button>
              <Button
                onClick={() => {
                  setShowDepositModal({ visible: false });
                  router.push("/dashboard/finance?tab=deposit");
                }}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
