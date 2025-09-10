"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function BuyerOrdersPage() {
  const { access } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      if (!access) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/orders/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [access]);

  const handleCheckout = (orderId: number) => {
    router.push(`/dashboard/checkout/${orderId}`);
  };
 const handleDelete = async (orderId: number) => {
  if (!access) return;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to delete order");
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  } catch (error) {
    console.error(error);
  }
};



  return (
<div className="p-6 space-y-4">
  <h2 className="text-2xl font-bold">My Orders</h2>
  {loading && <p>Loading...</p>}
  {orders.map((order) => (
    <Card key={order.id}>
      <CardHeader>
        <CardTitle>{order.item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {order.status}</p>
        <p>Seller: {order.item.seller_name}</p>

        {order.status === "pending" && (
          <div className="flex gap-2 mt-2">
            <Button onClick={() => handleCheckout(order.id)}>
              Proceed to Checkout
            </Button>
            <Button
            variant="destructive"
            className="mt-2"
            onClick={() => handleDelete(order.id)}
          >
            Delete Order
          </Button>
          </div>
        )}
      </CardContent>
    </Card>
  ))}
</div>

  );
}
