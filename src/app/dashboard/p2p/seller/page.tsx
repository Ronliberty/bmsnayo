"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function SellerOrdersPage() {
  const { access, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!access || !user) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/?role=seller`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        const data = await res.json();

        // only orders where logged-in user is the seller
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [access, user]);

  async function handleDelete(orderId: number) {
    if (!access) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      // update UI
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Orders Placed by Buyers</h2>
      {loading && <p>Loading...</p>}
      {!loading && orders.length === 0 && <p>No buyers have ordered your items yet.</p>}

      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>{order.item.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Buyer:</strong> {order.buyer.email}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Total:</strong> ${order.item.price * order.quantity}</p>

            
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
