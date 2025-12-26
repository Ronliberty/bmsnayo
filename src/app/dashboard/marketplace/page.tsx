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
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

/* =======================
   TYPES
   ======================= */
type Media = {
  id: string;
  media_type: "image" | "video" | "file";
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
  media?: Media[];
  availability_quantity: number;
  item_type: "service" | "app" | "website";
};

function mediaUrl(path?: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

/* =======================
   Skeleton Card
   ======================= */
function ItemSkeleton() {
  return (
    <Card>
      <Skeleton className="h-40 w-full rounded-t-lg" />
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function MarketplacePage() {
  const { access, user } = useAuth();
  const router = useRouter();
  const { account, refresh: refreshAccount } = useAccountBalance();

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [orders, setOrders] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [pendingItem, setPendingItem] = useState<MarketplaceItem | null>(null);

  /* =======================
     Fetch Items
     ======================= */
  useEffect(() => {
    if (!access) return;

    fetch(`${API_BASE}/market/items/`, {
      headers: { Authorization: `Bearer ${access}` },
    })
      .then((r) => r.json())
      .then((d) => setItems(d.results || []))
      .finally(() => setLoading(false));
  }, [access]);

  /* =======================
     Fetch Wishlist
     ======================= */
  useEffect(() => {
    if (!access) return;

    fetch(`${API_BASE}/market/wishlist/`, {
      headers: { Authorization: `Bearer ${access}` },
    })
      .then((r) => r.json())
      .then((d) =>
        setWishlist((d.results || []).map((w: any) => w.item.id))
      );
  }, [access]);

  /* =======================
     Wishlist Toggle (POST)
     ======================= */
  async function toggleWishlist(itemId: string, sellerId: number) {
    if (!access || sellerId === user?.id) return;

    const numericId = Number(itemId);
    const isSaved = wishlist.includes(numericId);

    setWishlist((prev) =>
      isSaved ? prev.filter((id) => id !== numericId) : [...prev, numericId]
    );

    setActionLoading((s) => ({ ...s, [itemId]: true }));

    try {
      await fetch(`${API_BASE}/market/wishlist/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ item_id: itemId }),
      });
    } catch {
      setWishlist((prev) =>
        isSaved ? [...prev, numericId] : prev.filter((id) => id !== numericId)
      );
    } finally {
      setActionLoading((s) => ({ ...s, [itemId]: false }));
    }
  }

  /* =======================
     Buy with Balance Check
     ======================= */
  async function handleBuy(item: MarketplaceItem) {
    const price = Number(item.price);
    const balance = account ? Number(account.balance) : 0;

    if (balance < price) {
      setPendingItem(item);
      setShowDepositModal(true);
      return;
    }

    setActionLoading((s) => ({ ...s, [item.id]: true }));

    const res = await fetch(`${API_BASE}/market/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ item_id: item.id }),
    });

    const data = await res.json();
    router.push(`/dashboard/marketplace/orders/${data.id}`);
    refreshAccount();
  }

  /* =======================
     UI
     ======================= */
  return (
    <div className="px-3 sm:px-6 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold">Marketplace</h2>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push("/dashboard/marketplace/wishlist")}
            className="relative"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {wishlist.length}
              </span>
            )}
          </button>

          <OrdersCart count={orders.length} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <ItemSkeleton key={i} />)}

        {!loading &&
          items.map((item) => {
            const soldOut =
              item.item_type !== "service" &&
              item.availability_quantity <= 0;

            return (
              <Card key={item.id}>
                <div className="h-40 bg-muted">
                  {item.media?.length ? (
                    <img
                      src={mediaUrl(item.media[0].file)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      No preview
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {item.seller_name}
                  </p>
                </CardHeader>

                <CardContent>
                  <p className="text-sm line-clamp-3">{item.description}</p>
                  <p className="font-semibold mt-2">
                    {item.currency} {item.price}
                  </p>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    variant={
                      wishlist.includes(Number(item.id))
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleWishlist(item.id, item.seller)}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {wishlist.includes(Number(item.id))
                      ? "Saved"
                      : "Wishlist"}
                  </Button>

                  <Button
                    disabled={soldOut}
                    onClick={() => handleBuy(item)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
      </div>

      {/* =======================
         Deposit Modal
         ======================= */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-lg font-semibold">Insufficient Balance</h3>
            <p className="text-sm text-muted-foreground">
              You don’t have enough balance to buy{" "}
              <span className="font-medium">{pendingItem?.title}</span>.
              Would you like to deposit funds now?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDepositModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowDepositModal(false);
                  router.push("/dashboard/finance?tab=deposit");
                }}
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
