"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
export default function SellingPage() {
  const { access } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Simulate checking subscription
  useEffect(() => {
    if (!access) return;
    async function checkSubscription() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/subscription/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setIsSubscribed(data.is_subscribed);
        }
      } catch (err) {
        console.error("Error checking subscription", err);
      }
    }
    checkSubscription();
  }, [access]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Seller Program</h1>
      <p className="text-muted-foreground">
        Join our peer-to-peer marketplace where vetted sellers can offer software, accounts, and freelance services.  
        Build trust, reach new buyers, and grow with the community.
      </p>

      {isSubscribed ? (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Your Seller Benefits</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Priority listing for your services</li>
            <li>Direct peer-to-peer transactions</li>
            <li>Access to buyer insights and analytics</li>
            <li>Community seller badge</li>
          </ul>
          <div className="flex gap-3 pt-4">
            <Button asChild>
              <a href="dashboard/seller/application">Sell</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/dashboard/marketplace/sales">Orders</a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Why Subscribe?</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Unlock the ability to sell apps, accounts, and services</li>
            <li>Be featured in our verified seller program</li>
            <li>Access trusted buyers within the community</li>
            <li>Low transaction fees & secure payments</li>
          </ul>
         <Button asChild>
            <Link href="/dashboard/subscription">Subscribe Now</Link>
            </Button>

        </div>
      )}
    </div>
  );
}
