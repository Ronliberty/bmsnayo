"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Clock, CheckCircle, XCircle, Truck, AlertCircle } from "lucide-react";

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
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/?role=seller`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.results ?? []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }

  async function orderAction(orderId: number, action: "approve" | "reject" | "deliver") {
    if (!access) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/${action}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.detail || "Action failed");
        return;
      }
      fetchOrders(); // Refresh list
    } catch (err) {
      console.error("Action error:", err);
      alert("Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [access]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { variant: "warning" as const, label: "Pending", icon: <Clock className="h-3.5 w-3.5" /> };
      case "approved":
        return { variant: "success" as const, label: "Approved", icon: <CheckCircle className="h-3.5 w-3.5" /> };
      case "delivered":
        return { variant: "outline" as const, label: "Delivered", icon: <Truck className="h-3.5 w-3.5" /> };
      case "completed":
        return { variant: "default" as const, label: "Completed", icon: <CheckCircle className="h-3.5 w-3.5" /> };
      case "rejected":
      case "cancelled":
        return { variant: "destructive" as const, label: status === "rejected" ? "Rejected" : "Cancelled", icon: <XCircle className="h-3.5 w-3.5" /> };
      case "disputed":
        return { variant: "destructive" as const, label: "Disputed", icon: <AlertCircle className="h-3.5 w-3.5" /> };
      default:
        return { variant: "secondary" as const, label: status.toUpperCase(), icon: null };
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading your orders...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => router.back()}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-2xl font-bold">My Seller Orders</h1>
        </div>
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            You don't have any orders yet.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5">
        {orders.map((order) => {
          const { variant, label, icon } = getStatusBadge(order.status);

          return (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center flex-wrap gap-3">
                  <span className="text-lg">{order.item.title}</span>
                  <Badge variant={variant} className="flex items-center gap-1 px-3 py-1">
                    {icon}
                    {label}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Type</span>
                    <p className="font-medium capitalize">{order.item.item_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price</span>
                    <p className="font-medium">
                      {order.item.currency} {order.item.price.toLocaleString()}
                      {order.quantity > 1 && ` × ${order.quantity}`}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Order ID: #{order.id} • Created: {new Date(order.created_at).toLocaleDateString()}
                </div>

                {/* Actions - only shown for actionable states */}
                {order.status === "pending" && (
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => orderAction(order.id, "approve")}
                    >
                      Approve Order
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to reject/cancel this order?")) {
                          orderAction(order.id, "reject");
                        }
                      }}
                    >
                      Reject / Cancel
                    </Button>
                  </div>
                )}

                {order.status === "approved" && (
                  <div className="pt-4 border-t">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => orderAction(order.id, "deliver")}
                      className="w-full sm:w-auto"
                    >
                      Submit Delivery
                    </Button>
                  </div>
                )}

                {(order.status === "delivered" || order.status === "disputed") && (
                  <div className="pt-3 text-sm text-muted-foreground italic border-t">
                    {order.status === "delivered"
                      ? "Waiting for buyer review..."
                      : "In dispute – awaiting resolution"}
                  </div>
                )}

                {["completed", "rejected", "cancelled"].includes(order.status) && (
                  <div className="pt-3 text-sm text-muted-foreground italic border-t">
                    This order is now closed.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}