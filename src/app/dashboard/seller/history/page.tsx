"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface Item {
  title: string;
  item_type: string;
}

interface Order {
  id: number;
  status: string;
  quantity: number;
  created_at: string;
  item: Item;
}

interface Escrow {
  id: number;
  amount: number;
  currency: string;
  status: "funded" | "released" | "refunded";
  funded_at: string | null;
  released_at: string | null;
  refunded_at: string | null;
  order_detail: Order;
}

export default function SellerHistoryPage() {
  const { access } = useAuth();
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!access) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/escrows/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Only completed history
        const completed = data.filter(
          (e: Escrow) => e.status === "released" || e.status === "refunded"
        );
        setEscrows(completed);
      })
      .finally(() => setLoading(false));
  }, [access]);

  if (loading) {
    return <p className="p-6">Loading history...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Order & Escrow History</h1>

      {escrows.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No completed orders yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {escrows.map((escrow) => (
          <Card key={escrow.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{escrow.order_detail.item.title}</span>

                <Badge
                  variant={
                    escrow.status === "released"
                      ? "success"
                      : "destructive"
                  }
                >
                  {escrow.status.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Item Type</span>
                <Badge variant="outline">
                  {escrow.order_detail.item.item_type}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Quantity</span>
                <span>{escrow.order_detail.quantity}</span>
              </div>

              <div className="flex justify-between">
                <span>Amount</span>
                <span className="font-semibold">
                  {escrow.currency} {escrow.amount}
                </span>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Order ID</span>
                <span>#{escrow.order_detail.id}</span>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Created</span>
                <span>
                  {new Date(
                    escrow.order_detail.created_at
                  ).toLocaleDateString()}
                </span>
              </div>

              {escrow.released_at && (
                <div className="text-xs text-green-600">
                  Released on{" "}
                  {new Date(escrow.released_at).toLocaleDateString()}
                </div>
              )}

              {escrow.refunded_at && (
                <div className="text-xs text-red-600">
                  Refunded on{" "}
                  {new Date(escrow.refunded_at).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
