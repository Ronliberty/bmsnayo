
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccountBalance } from "@/app/hooks/useAccountBalance";
import { OrdersCart } from "@/components/marketplace/OrdersCart";

type Media = { id: string; media_type: string; file?: string; link?: string };
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
  const [actionLoading, setActionLoading] = useState<{ [k: string]: boolean }>({});
  const [showDepositModal, setShowDepositModal] = useState<{ visible: boolean; item?: MarketplaceItem }>({ visible: false });

  // Fetch marketplace items
  useEffect(() => {
    if (!access) return;
    async function fetchItems() {
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/items/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        if (!r.ok) throw new Error("Failed to load items");
        setItems(await r.json());
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [access]);

  // Fetch user orders
  useEffect(() => {
    if (!access) return;
    async function fetchOrders() {
      try {
        const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        if (!ordersRes.ok) return;
        const orders = await ordersRes.json();
        const active = orders.filter((o: any) => o.status !== "completed" && o.status !== "cancelled");
        setUserOrders(active.map((o: any) => o.item.id));
      } catch (e) {
        console.error(e);
      }
    }
    fetchOrders();
  }, [access]);

  async function handleWishlist(itemId: string, sellerId: number) {
    if (!access || sellerId === user?.id) return;
    try {
      setActionLoading(s => ({ ...s, [itemId]: true }));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
        body: JSON.stringify({ item_id: itemId }),
      });
      if (!res.ok) throw new Error("Failed to add wishlist");
      setWishlistItems(prev => [...prev, Number(itemId)]);
      router.push("/dashboard/marketplace/wishlist");
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(s => ({ ...s, [itemId]: false }));
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
      setActionLoading(s => ({ ...s, [item.id]: true }));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
        body: JSON.stringify({ item_id: item.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to place order");
      router.push(`/dashboard/marketplace/orders/${data.id}`);
    } catch (e: any) {
      console.error(e);
    } finally {
      setActionLoading(s => ({ ...s, [item.id]: false }));
      refreshAccount();
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Orders Cart */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Marketplace</h2>
        <OrdersCart count={userOrders.length} />
      </div>

      {loading && <p>Loading items...</p>}
      {err && <p className="text-red-600">{err}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(item => {
          const isOwner = user?.id === item.seller;
          const soldOut = item.item_type !== "service" && item.availability_quantity <= 0;

          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{item.seller_name}</p>
              </CardHeader>

              <CardContent className="space-y-2">
                {item.media && item.media.length > 0 ? (
                  <img
                    src={item.media[0].file || item.media[0].link}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded"
                    onError={e => (e.currentTarget.src = "/placeholder.png")}
                  />
                ) : (
                  <div className="h-40 bg-muted rounded flex items-center justify-center text-sm">
                    No preview
                  </div>
                )}
                <p className="text-sm">{item.description}</p>
                <p className="mt-2 font-semibold">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: item.currency }).format(Number(item.price))}
                </p>
                <p className="text-xs text-muted-foreground">Delivery: {item.delivery_type ?? "manual"}</p>

                {/* Sold Out Message */}
                {soldOut && <p className="text-red-600 font-semibold text-sm">Sold Out</p>}
              </CardContent>

              <CardFooter className="flex gap-2">
                {isOwner ? (
                  <p className="text-sm text-muted-foreground italic">This is your item</p>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleWishlist(item.id, item.seller)}
                      disabled={wishlistItems.includes(Number(item.id)) || actionLoading[item.id]}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {wishlistItems.includes(Number(item.id)) ? "Added" : "Wishlist"}
                    </Button>

                    <Button
                      onClick={() => handleBuy(item)}
                      disabled={soldOut || actionLoading[item.id]}
                      className="bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {soldOut ? "Sold Out" : "Buy Now"}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {showDepositModal.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-background dark:bg-card p-6 rounded-xl shadow-lg w-96 space-y-4 border border-border">
            <h3 className="text-lg font-semibold text-foreground dark:text-card-foreground">
              Insufficient Balance
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              Your account balance is not enough to buy this item. Would you like to deposit funds now?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="bg-background dark:bg-card dark:text-card-foreground"
                onClick={() => setShowDepositModal({ visible: false })}
              >
                No
              </Button>
              <Button
                className="bg-primary text-primary-foreground"
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
