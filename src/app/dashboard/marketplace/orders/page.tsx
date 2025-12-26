"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MarketplaceItem = {
  id: string;
  title: string;
  seller_name: string;
};

type Order = {
  id: string;
  status: string;
  item: MarketplaceItem;
  created_at: string;
};

type OrdersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
};

export default function OrdersListPage() {
  const { access } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!access) return;

    async function fetchOrders() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/orders/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data: OrdersResponse = await res.json();

        // ✅ FIX: use paginated results
        setOrders(Array.isArray(data.results) ? data.results : []);
      } catch (e: any) {
        setErr(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [access]);

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading orders...</p>;
  }

  if (err) {
    return <p className="p-6 text-red-600">{err}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <p>No orders found.</p>
        <Button onClick={() => router.push("/dashboard/marketplace")}>
          Browse Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold">Your Orders</h2>
        <Button
          onClick={() => router.push("/dashboard/marketplace")}
          className="bg-primary text-primary-foreground"
        >
          Continue Shopping
        </Button>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() =>
              router.push(`/dashboard/marketplace/orders/${order.id}`)
            }
          >
            <CardContent className="px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-1">
                  <p className="font-semibold truncate">#{order.id}</p>
                  <p className="truncate">{order.item.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.item.seller_name}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  <p
                    className={`capitalize font-medium ${
                      order.status === "completed"
                        ? "text-green-600"
                        : order.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
