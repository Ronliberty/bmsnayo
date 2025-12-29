"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Media = {
  id: string;
  file: string;
  media_type: "image" | "video" | "file";
};

type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  availability_quantity: number | null;
  media: Media[];
};

type Order = {
  id: string;
  status: string;
  buyer_name: string;
  created_at: string;
  item: MarketplaceItem;
};

export default function SellerOrdersPage() {
  const { access } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!access) return;

    async function fetchOrders() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/orders/?role=seller`,
          {
            headers: { Authorization: `Bearer ${access}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch seller orders");

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.results ?? []);
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
  if (orders.length === 0) return <p className="p-6">No orders found</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">My Sales</h2>

      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/dashboard/marketplace/sales/${order.id}`}
        >
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{order.item.title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                Buyer: {order.buyer_name} • Status: {order.status}
              </p>
            </CardHeader>

            <CardContent className="space-y-2">
              {order.item.media?.[0] && (
                <img
                  src={order.item.media[0].file}
                  alt={order.item.title}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}

              <p className="text-sm line-clamp-2">
                {order.item.description}
              </p>

              <p className="font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: order.item.currency,
                }).format(Number(order.item.price))}
              </p>

              {order.item.availability_quantity !== null && (
                <p className="text-xs text-muted-foreground">
                  Remaining stock: {order.item.availability_quantity}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
