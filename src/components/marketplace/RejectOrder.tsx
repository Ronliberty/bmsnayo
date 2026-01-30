"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createDispute, RejectDeliveryPayload } from "@/lib/market/api";

type RejectOrderProps = {
  deliveryId: number; // ✅ change from orderId to deliveryId
  onClose: () => void;
};

export default function RejectOrder({ deliveryId, onClose }: RejectOrderProps) {
  const { access } = useAuth();
  const [category, setCategory] = useState<RejectDeliveryPayload["category"]>("other");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!access) return;
    try {
      setSubmitting(true);
      setFeedback(null);

      await createDispute(access, {
      delivery_id: deliveryId, // pass deliveryId inside payload
      category,
      reason,
      evidence_file: file,
    });

      setFeedback("Delivery rejected and dispute opened ✅");
      setTimeout(onClose, 1200); // auto-close
    } catch (err: any) {
      setFeedback(err.message || "Something went wrong ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reject Delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={category}
              onChange={(e) => setCategory(e.target.value as RejectDeliveryPayload["category"])}
            >
              <option value="not_received">Did not receive work</option>
              <option value="not_as_described">Work not as described</option>
              <option value="poor_quality">Poor quality</option>
              <option value="late_delivery">Late delivery</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Reason (optional)</label>
            <textarea
              className="w-full border rounded p-2 mt-1"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Evidence File (optional)</label>
            <input
              type="file"
              className="mt-1"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {feedback && <p className="text-sm text-center text-green-600">{feedback}</p>}
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={submitting}>
            Submit Rejection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
