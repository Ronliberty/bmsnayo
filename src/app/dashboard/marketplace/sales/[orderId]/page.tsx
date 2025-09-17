"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type OrderDelivery = {
  id: string;
  message?: string;
  repo_url?: string;
  login_details?: string;
  file?: string;
  approved: boolean;
};

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
  delivery?: OrderDelivery;
};

export default function SellerOrderPage() {
  const { orderId } = useParams<{ orderId: string }>(); // ✅ Correct param extraction
  const router = useRouter();
  const { access } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [loginDetails, setLoginDetails] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

  async function submitDelivery() {
    if (!order) return;
    const formData = new FormData();
    formData.append("message", message);
    if (repoUrl) formData.append("repo_url", repoUrl);
    if (loginDetails) formData.append("login_details", loginDetails);
    if (file) formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${order.id}/deliver`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${access}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to submit delivery");
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    }
  }

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

      {(status === "in_escrow" || status === "rejected") && !delivery && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full border rounded p-2"
              placeholder="Delivery message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              type="url"
              className="w-full border rounded p-2"
              placeholder="Repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <textarea
              className="w-full border rounded p-2"
              placeholder="Login details"
              value={loginDetails}
              onChange={(e) => setLoginDetails(e.target.value)}
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={submitDelivery}>Submit Delivery</Button>
          </CardFooter>
        </Card>
      )}

      {delivery && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Submitted</CardTitle>
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
              <a
                href={delivery.file}
                target="_blank"
                className="text-blue-600"
              >
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
