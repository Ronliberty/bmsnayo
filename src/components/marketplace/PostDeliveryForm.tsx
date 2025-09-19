"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

export type DeliveryData = {
  id: string;
  message?: string;
  repo_url?: string;
  login_details?: string;
  file?: string;
  approved: boolean;
};

interface PostDeliveryFormProps {
  orderId: string;
  accessToken: string;
  onSuccess?: (deliveryData: DeliveryData) => void;
}

export default function PostDeliveryForm({ orderId, accessToken, onSuccess }: PostDeliveryFormProps) {
  const [message, setMessage] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [loginDetails, setLoginDetails] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitDelivery = async () => {
    setErr(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("message", message);
    if (repoUrl) formData.append("repo_url", repoUrl);
    if (loginDetails) formData.append("login_details", loginDetails);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/deliver/?role=seller`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (onSuccess) onSuccess(res.data); // ✅ pass delivery data from backend
    } catch (e: any) {
      setErr(e.response?.data?.detail || e.message || "Failed to submit delivery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Delivery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {err && <p className="text-red-600">{err}</p>}
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
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </CardContent>
      <CardFooter>
        <Button onClick={submitDelivery} disabled={loading}>
          {loading ? "Submitting..." : "Submit Delivery"}
        </Button>
      </CardFooter>
    </Card>
  );
}
