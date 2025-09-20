"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SubscribeModal({ plan }: { plan: any }) {
  const { access } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  async function handleJoinWaitlist() {
    if (!access) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/waitlist/join/`,
        { plan: plan.id }, // sending plan ID
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Join waitlist success:", res.data);
      setJoined(true);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Join waitlist error:", {
          status: err.response?.status,
          data: err.response?.data,
        });
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  // Auto close modal after success
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (joined) {
      timer = setTimeout(() => setOpen(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [joined]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CheckCircle className="h-4 w-4 mr-2" />
        Subscribe
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{plan.name} Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <strong>Price:</strong>{" "}
              {plan.price === 0 ? "Free" : `$${plan.price}/month`}
            </p>
            <ul className="list-disc pl-5">
              {plan.benefits.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            {joined ? (
              <p className="text-green-600">
                ✅ Successfully joined! We’ll get back to you soon.
              </p>
            ) : (
              <Button disabled={loading} onClick={handleJoinWaitlist}>
                {loading ? "Joining..." : "Join the Waitlist"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
