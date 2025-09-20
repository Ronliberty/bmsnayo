"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SubscribeModal from "@/components/subscription/SubscribeModal"; // ✅ import modal

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

  // Mock current user subscription
  const currentPlan = "Free";
  const isSubscribed = false;

  // Fetch plans
  useEffect(() => {
    async function fetchPlans() {
      if (!access) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/plans/`, {
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Subscription</h1>
      <p className="text-muted-foreground">
        Manage your subscription plan and benefits.
      </p>

      {loading && <p className="text-sm text-muted-foreground">Loading plans...</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {!loading && !err && plans.map((plan) => (
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
              {plan.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2">
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
            ) : (
              // ✅ use modal instead of button
              <SubscribeModal plan={plan} />
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
