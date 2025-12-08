"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Plan = {
  id: number;
  name: string;
  price: number;
  benefits: string[];
};

export default function SubscriptionPage() {
  const { access } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [joiningPlanId, setJoiningPlanId] = useState<number | null>(null); // track loading per plan
  const [joinedPlanIds, setJoinedPlanIds] = useState<number[]>([]); // track which plans user joined

  // Mock current user subscription
  const currentPlan = "Free";
  const isSubscribed = false;

  // Fetch plans
  useEffect(() => {
    async function fetchPlans() {
      if (!access) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/plans/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to fetch plans");
        }

        const data: Plan[] = await res.json();
        setPlans(data);
      } catch (error: any) {
        console.error("Error fetching plans:", error);
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, [access]);

  // Join waitlist function
  async function joinWaitlist(planId: number) {
    if (!access) return;
    setJoiningPlanId(planId);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/waitlist/join/`,
        { plan: planId },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Waitlist joined:", res.data);
      setJoinedPlanIds((prev) => [...prev, planId]);
    } catch (err: any) {
      console.error("Join waitlist error:", err.response?.data || err.message);
      alert(`Error joining waitlist: ${err.response?.data?.error || err.message}`);
    } finally {
      setJoiningPlanId(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Subscription</h1>
      <p className="text-muted-foreground">
        Manage your subscription plan and benefits.
      </p>

      {loading && <p className="text-sm text-muted-foreground">Loading plans...</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {!loading &&
        !err &&
        plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name} Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-semibold">Price:</span>{" "}
                {plan.price === 0 ? "Free" : `$${plan.price}/month`}
              </p>
              <ul className="space-y-1">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.name === currentPlan && isSubscribed ? (
                <Button variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              ) : joinedPlanIds.includes(plan.id) ? (
                <p className="text-green-600 font-semibold">
                  ✅ Successfully joined waitlist
                </p>
              ) : (
                <Button
                  disabled={joiningPlanId === plan.id}
                  onClick={() => joinWaitlist(plan.id)}
                >
                  {joiningPlanId === plan.id ? "Joining..." : "Join Waitlist"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}

      {/* Custom Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Need a Custom Plan?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Contact us if you need an enterprise or custom subscription plan.
          </p>
          <Button variant="outline">Request Custom Plan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
