// hooks/useAccountBalance.ts
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Account {
  id: number;
  currency: string;
  balance: string;
  reserved_balance: string;
  updated_at: string;
}

export function useAccountBalance() {
  const { access } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccount() {
      if (!access) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/account/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Failed to fetch account");
        }

        const data = await res.json();
        setAccount(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAccount();
  }, [access]);

  return { account, loading, error };
}
