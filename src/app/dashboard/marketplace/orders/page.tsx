"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ------------------ Types ------------------ */

type OrderStatus =
  | "pending"
  | "in_escrow"
  | "completed"
  | "cancelled"
  | string;

type MarketplaceItem = {
  id: string;
  title: string;
  seller_name: string;
};

type Order = {
  id: string;
  status: OrderStatus;
  item: MarketplaceItem;
  created_at: string;
};

type OrdersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
};

/* ------------------ Status → Badge Variant ------------------ */
/**
 * IMPORTANT:
 * These variants MUST exist in badgeVariants (cva)
 */
function getOrderBadgeVariant(
  status: OrderStatus
): React.ComponentProps<typeof Badge>["variant"] {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "destructive";
    case "in_escrow":
      return "outline";
    default:
      return "default";
  }
}

function getOrderStatusLabel(status: OrderStatus) {
  return status.replace("_", " ");
}

/* ------------------ Component ------------------ */

export default function OrdersListPage() {
  const { access } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  /* ------------------ Fetch Orders ------------------ */

  useEffect(() => {
    if (!access) return;

    async function fetchOrders() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/orders/`,
          {
            headers: { Authorization: `Bearer ${access}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data: OrdersResponse = await res.json();
        setOrders(Array.isArray(data.results) ? data.results : []);
      } catch (e: any) {
        setErr(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [access]);

  /* ------------------ Cancel Order ------------------ */

  async function handleCancelOrder() {
    if (!cancelOrderId || !access) return;

    try {
      setCancelLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${cancelOrderId}/cancel/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      if (!res.ok) throw new Error("Failed to cancel order");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === cancelOrderId ? { ...o, status: "cancelled" } : o
        )
      );

      setSuccessMessage("Order cancelled successfully.");
    } finally {
      setCancelLoading(false);
      setCancelOrderId(null);
    }
  }

  /* ------------------ States ------------------ */

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

  /* ------------------ Render ------------------ */

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold">Your Orders</h2>
        <Button onClick={() => router.push("/dashboard/marketplace")}>
          Continue Shopping
        </Button>
      </div>

      <div className="space-y-2">
        {orders.map((order) => {
          const cancellable =
            order.status === "pending" || order.status === "in_escrow";

          return (
            <Card key={order.id}>
              <CardContent className="px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/dashboard/marketplace/orders/${order.id}`
                      )
                    }
                  >
                    <p className="font-semibold truncate">#{order.id}</p>
                    <p className="truncate">{order.item.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.item.seller_name}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge
                      variant={getOrderBadgeVariant(order.status)}
                      className="capitalize"
                    >
                      {getOrderStatusLabel(order.status)}
                    </Badge>

                    {cancellable && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCancelOrderId(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Confirm Cancel Modal */}
      {cancelOrderId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-lg font-semibold">Are you sure?</h3>
            <p className="text-sm text-muted-foreground">
              This will cancel your order and release escrow funds.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCancelOrderId(null)}
                disabled={cancelLoading}
              >
                No
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={cancelLoading}
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-xl w-96 text-center space-y-4">
            <h3 className="text-lg font-semibold">Success</h3>
            <p className="text-sm text-muted-foreground">
              {successMessage}
            </p>
            <Button onClick={() => setSuccessMessage(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
