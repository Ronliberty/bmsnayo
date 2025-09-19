"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type RejectOrderProps = {
  orderId: string;
  onClose: () => void;
};

export default function RejectOrder({ orderId, onClose }: RejectOrderProps) {
  const { access } = useAuth();
  const [category, setCategory] = useState("other");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!access) return;
    try {
      setSubmitting(true);
      setFeedback(null);

      const formData = new FormData();
      formData.append("category", category);
      if (reason) formData.append("reason", reason);
      if (file) formData.append("evidence_file", file);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/reject/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFeedback("Delivery rejected and dispute opened ✅");
      setTimeout(() => onClose(), 1200); // close after success
    } catch (err: any) {
      setFeedback(err.response?.data?.detail || "Something went wrong ❌");
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
              onChange={(e) => setCategory(e.target.value)}
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

          {feedback && (
            <p className="text-sm text-center text-green-600">{feedback}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={submitting}
          >
            Submit Rejection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
