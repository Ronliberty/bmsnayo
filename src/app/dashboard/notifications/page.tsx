"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type Notification = {
  id: number;
  title?: string;
  message: string;
  is_read: boolean;
};

export default function BuyerNotificationsPage() {
  const { access } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      if (!access) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notify/notifications/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        // ✅ Handle paginated & non-paginated responses
        const list: Notification[] = Array.isArray(data)
          ? data
          : data?.results ?? [];

        setNotifications(list);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [access]);

  const handleMarkRead = async (id: number) => {
    if (!access) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notify/notifications/${id}/mark_read/`,
        {
          method: "POST", // ✅ matches your DRF @action
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!access) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notify/notifications/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (!res.ok) return;

      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">My Notifications</h2>

      {loading && <p>Loading...</p>}

      {!loading && notifications.length === 0 && (
        <p className="text-muted-foreground">
          No notifications found.
        </p>
      )}

      {notifications.map((n) => (
        <Card key={n.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {n.title || "Notification"}
              {!n.is_read && (
                <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  New
                </span>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm">{n.message}</p>

            <div className="flex gap-2 mt-3">
              {!n.is_read && (
                <Button
                  size="sm"
                  onClick={() => handleMarkRead(n.id)}
                >
                  Mark as Read
                </Button>
              )}

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(n.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
