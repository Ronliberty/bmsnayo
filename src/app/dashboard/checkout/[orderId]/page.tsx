"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type Order = {
  id: number;
  status: string;
  item: {
    id: number;
    title: string;
    price: string;
    currency: string;
    seller_name: string;
  };
  escrow?: {
    id: number;
    status: string;
    amount: string;
    currency: string;
  };
};

export default function CheckoutPage() {
  const { orderId } = useParams();
  const { access } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Fetch order + escrow
  useEffect(() => {
    async function fetchOrder() {
      if (!access || !orderId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (error: any) {
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [access, orderId]);

  // Stubbed payment handlers
  const handleCardPayment = async () => {
    if (!order) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ order_id: order.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe checkout
      }
    } catch (err) {
      console.error("Card payment error:", err);
    }
  };

  const handleCryptoPayment = async () => {
    if (!order) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/crypto/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ order_id: order.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to crypto provider
      }
    } catch (err) {
      console.error("Crypto payment error:", err);
    }
  };

  if (loading) return <p className="p-6">Loading order...</p>;
  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Checkout for Order #{order.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Item:</strong> {order.item.title}</p>
          <p><strong>Seller:</strong> {order.item.seller_name}</p>
          <p><strong>Price:</strong> {order.item.currency} {order.item.price}</p>
          <p><strong>Escrow Status:</strong> {order.escrow?.status || "pending"}</p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button onClick={handleCardPayment} className="bg-blue-600 text-white hover:bg-blue-700">
            Pay with Card
          </Button>
          <Button onClick={handleCryptoPayment} className="bg-purple-600 text-white hover:bg-purple-700">
            Pay with Crypto
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
