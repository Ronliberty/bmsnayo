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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [access]);

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (orders.length === 0) return <p className="p-6">No orders found.</p>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Orders</h2>
        <Button
          className="bg-primary text-primary-foreground"
          onClick={() => router.push("/dashboard/marketplace")}
        >
          Continue Shopping
        </Button>
      </div>

      <div className="space-y-2">
        {orders.map(order => (
          <Card
            key={order.id}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            onClick={() => router.push(`/dashboard/marketplace/orders/${order.id}`)}
          >
            <CardContent className="flex justify-between items-center px-4 py-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
                <p className="font-semibold truncate">#{order.id}</p>
                <p className="truncate">{order.item.title}</p>
                <p className="text-sm text-muted-foreground truncate">{order.item.seller_name}</p>
                <p className={`capitalize font-medium ${order.status === "completed" ? "text-green-600" : order.status === "pending" ? "text-yellow-600" : "text-red-600"}`}>
                  {order.status}
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
