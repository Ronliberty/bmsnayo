"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export default function SubscriptionPage() {
  const currentPlan = "Free"; // mock data, later dynamic
  const isSubscribed = false; // mock data

  const benefits = [
    "Access to premium job listings",
    "Unlock Analytics dashboard",
    "Priority support",
    "Early access to new features",
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Subscription</h1>
      <p className="text-muted-foreground">
        Manage your subscription plan and benefits.
      </p>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-semibold">Plan:</span> {currentPlan}
          </p>
          <p>
            <span className="font-semibold">Price:</span>{" "}
            {isSubscribed ? "$20/month" : "Free"}
          </p>
          {isSubscribed ? (
            <Button variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Subscription
            </Button>
          ) : (
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Subscribe for $20/month
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

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
