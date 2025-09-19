"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import PostDeliveryForm, { DeliveryData } from "@/components/marketplace/PostDeliveryForm";

type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  buyer_name: string;
};

type Order = {
  id: string;
  status: string;
  item: MarketplaceItem;
  created_at: string;
  delivery?: DeliveryData;
};

export default function SellerOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { access } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!access || !orderId) return;

    async function fetchOrder() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/?role=seller`,
          {
            headers: { Authorization: `Bearer ${access}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [access, orderId]);

  if (!orderId) return <p className="p-6 text-red-600">Invalid order ID</p>;
  if (loading) return <p className="p-6">Loading order...</p>;
  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  const { item, status, delivery } = order;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Order #{order.id}</h2>
      <p className="text-sm text-muted-foreground">Status: {status}</p>

      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <p className="text-xs text-muted-foreground">Buyer: {item.buyer_name}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>{item.description}</p>
          <p className="font-semibold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: item.currency,
            }).format(Number(item.price))}
          </p>
        </CardContent>
      </Card>

      {/* Delivery Form */}
      {(status === "in_escrow" || status === "rejected") && !delivery && access && (
        <PostDeliveryForm
          orderId={order.id}
          accessToken={access}
          onSuccess={(deliveryData: DeliveryData) => {
            setOrder({
              ...order,
              status: "delivered",
              delivery: deliveryData,
            });
          }}
        />
      )}

      {/* Delivery Submitted */}
      {delivery && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Submitted (Waiting for Buyer Approval)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{delivery.message}</p>
            {delivery.repo_url && (
              <p>
                Repo:{" "}
                <a href={delivery.repo_url} className="text-blue-600">
                  {delivery.repo_url}
                </a>
              </p>
            )}
            {delivery.login_details && <p>Login: {delivery.login_details}</p>}
            {delivery.file && (
              <a href={delivery.file} target="_blank" className="text-blue-600">
                Download File
              </a>
            )}
            <p className="text-sm text-muted-foreground">
              Approved: {delivery.approved ? "Yes ✅" : "No ⏳"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
