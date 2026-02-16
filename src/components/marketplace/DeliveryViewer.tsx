


"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import RejectOrder from "./RejectOrder";
import DisputeChat from "./DisputeChart";

import {
  getBuyerDeliveries,
  OrderItemDelivery,
} from "@/lib/market/api";

interface DeliveryViewerProps {
  orderItemId: number;
}

export default function DeliveryViewer({ orderItemId }: DeliveryViewerProps) {
  const { access } = useAuth();

  const [deliveries, setDeliveries] = useState<OrderItemDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState<number | null>(null);
  const [showDispute, setShowDispute] = useState<number | null>(null);

  /* ---------------------------------------------
   * FETCH DELIVERIES
   * ------------------------------------------- */
  useEffect(() => {
    if (!access || !orderItemId) return;

    async function fetchDeliveries() {
      try {
        setLoading(true);
        setError(null);

        const data = await getBuyerDeliveries(
          access as string,
          Number(orderItemId)
        );

        setDeliveries(data);
      } catch (e: any) {
        setError(e.message || "Failed to load deliveries");
      } finally {
        setLoading(false);
      }
    }

    fetchDeliveries();
  }, [access, orderItemId]);

  if (loading) return <p>Loading deliveries...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!deliveries.length) return <p>No deliveries submitted yet.</p>;

  /* ---------------------------------------------
   * RENDER
   * ------------------------------------------- */
  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => {
        /* -----------------------------------------
         * INDEPENDENT FLAGS (KEY FIX)
         * --------------------------------------- */
        const hasDispute = Boolean(delivery.dispute?.id);
        const canAct =
          delivery.status === "pending" ||
          delivery.status === "partial";

        return (
          <Card key={delivery.id}>
            <CardHeader>
              <CardTitle>
                Delivery #{delivery.id} · Qty {delivery.delivered_quantity}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {delivery.message && <p>{delivery.message}</p>}

              {delivery.repo_url && (
                <p>
                  Repo:{" "}
                  <a
                    href={delivery.repo_url}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {delivery.repo_url}
                  </a>
                </p>
              )}

              {delivery.login_details && (
                <p>
                  <span className="font-semibold">Login:</span>{" "}
                  {delivery.login_details}
                </p>
              )}

              {delivery.file && (
                <a
                  href={delivery.file}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Download File
                </a>
              )}

              <p className="text-xs text-muted-foreground">
                Submitted at:{" "}
                {new Date(delivery.submitted_at).toLocaleString()}
              </p>
            </CardContent>

            {/* -----------------------------------------
             * FOOTER — BUYER ACTIONS + DISPUTE CHAT
             * --------------------------------------- */}
 
<CardFooter className="flex flex-col gap-3 border-t pt-4">
  {/* INLINE ACTIONS */}
  <div className="flex items-center gap-4 text-sm">
   

    {(delivery.status !== "disputed" && delivery.status !== "accepted") && (
      <>
        <button
          className="text-green-600 hover:underline"
          disabled={submitting}
        >
          Approve
        </button>

        <button
          className="text-red-600 hover:underline"
          disabled={submitting}
          onClick={() => setShowRejectForm(delivery.id)}
        >
          Reject
        </button>
      </>
    )}
    

  
   

  </div>

  {/* REJECT FORM INLINE */}
  {showRejectForm === delivery.id && (
    <div className="w-full rounded-md border p-3 bg-muted">
      <RejectOrder
        deliveryId={delivery.id}
        onClose={() => setShowRejectForm(null)}
      />
    </div>
  )}

  {/* DISPUTE THREAD (NO STATUS CHECK) */}
  
    <div className="w-full rounded-md border p-3 bg-background space-y-2">
      
      <DisputeChat disputeId={delivery.dispute?.id!} />
    
    </div>




</CardFooter>

          </Card>
        );
      })}
    </div>
  );
}
