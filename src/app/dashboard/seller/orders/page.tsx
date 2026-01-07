"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

interface Item {
  id: string;
  title: string;
  item_type: "service" | "app" | "website";
  price: number;
  currency: string;
}

interface Order {
  id: number;
  buyer: number;
  seller: number;
  item: Item;
  quantity: number;
  status: string;
  created_at: string;
}

export default function SellerOrdersPage() {
  const { access } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    if (!access) return;

    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/market/orders/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    const data = await res.json();
    setOrders(Array.isArray(data) ? data : data.results ?? []);
    setLoading(false);
  }

  async function orderAction(orderId: number, action: "approve" | "reject" | "deliver") {
    if (!access) return;

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/${action}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    fetchOrders(); // refresh list
  }

  useEffect(() => {
    fetchOrders();
  }, [access]);

  if (loading) {
    return <p className="p-6">Loading orders…</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No orders yet.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{order.item.title}</span>
                <Badge
                  variant={
                    order.status === "approved"
                      ? "success"
                      : order.status === "rejected"
                      ? "destructive"
                      : order.status === "delivered"
                      ? "outline"
                      : "warning"
                  }
                >
                  {order.status.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Type</span>
                <span className="font-medium">{order.item.item_type}</span>
              </div>

              <div className="flex justify-between">
                <span>Price</span>
                <span className="font-medium">
                  {order.item.currency} {order.item.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Quantity</span>
                <span className="font-medium">{order.quantity}</span>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Order ID</span>
                <span>#{order.id}</span>
              </div>

              {/* Actions */}
              {order.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => orderAction(order.id, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => orderAction(order.id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              )}

              {order.status === "approved" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => orderAction(order.id, "deliver")}
                >
                  Mark as Delivered
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
