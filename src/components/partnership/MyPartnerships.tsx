"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface Partnership {
  id: number;
  title: string;
  description: string;
  commission_type: string;
  commission_value: number;
  referral_enabled: boolean;
  referral_commission_rate: number;
}

interface UserPartnership {
  id: number;
  partnership: Partnership;
  status: "pending" | "accepted" | "declined";
  total_earned: string;
  joined_at: string;
}

export default function MyPartnerships() {
  const { access } = useAuth();
  const [pendingPartnerships, setPendingPartnerships] = useState<UserPartnership[]>([]);
  const [acceptedPartnerships, setAcceptedPartnerships] = useState<UserPartnership[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-700";
      case "pending":
        return "text-yellow-600";
      case "declined":
        return "text-red-600";
      default:
        return "text-gray-700";
    }
  };

  useEffect(() => {
    if (!access) return;

    const fetchPartnerships = async () => {
      try {
        const [{ data: pending }, { data: accepted }] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/partner/my/partnerships/?status=pending`, {
            headers: { Authorization: `Bearer ${access}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/partner/my/partnerships/?status=accepted`, {
            headers: { Authorization: `Bearer ${access}` },
          }),
        ]);

        setPendingPartnerships(pending);
        setAcceptedPartnerships(accepted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerships();
  }, [access]);

  if (loading) return <p>Loading your partnerships...</p>;

  return (
    <div className="space-y-8">
      {/* Pending Applications */}
      <div>
        <h2 className="text-xl font-bold mb-4">Pending Applications</h2>
        {pendingPartnerships.length === 0 ? (
          <p>No pending applications.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPartnerships.map((up) => (
              <Card key={up.id} className="p-4 animate__animated animate__fadeIn">
                <h3 className="font-semibold">{up.partnership.title}</h3>
                <p className="text-sm text-muted-foreground">{up.partnership.description}</p>
                <p className={`space-y-1 text-xs mt-2 ${getStatusColor(up.status)}`}>
                  <strong>Status:</strong> {up.status} <br />
                  <strong>Total Earned:</strong> ${up.total_earned} <br />
                  <strong>Joined At:</strong> {new Date(up.joined_at).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Partnerships */}
      <div>
        <h2 className="text-xl font-bold mb-4">Accepted Partnerships</h2>
        {acceptedPartnerships.length === 0 ? (
          <p>No accepted partnerships yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedPartnerships.map((up) => (
              <Card key={up.id} className="p-4 animate__animated animate__fadeIn">
                <h3 className="font-semibold">{up.partnership.title}</h3>
                <p className="text-sm text-muted-foreground">{up.partnership.description}</p>
                <p className={`space-y-1 text-xs mt-2 ${getStatusColor(up.status)}`}>
                  <strong>Status:</strong> {up.status} <br />
                  <strong>Total Earned:</strong> ${up.total_earned} <br />
                  <strong>Joined At:</strong> {new Date(up.joined_at).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
