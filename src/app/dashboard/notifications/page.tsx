"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function BuyerNotificationsPage() {
  const { access } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      if (!access) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notify/notifications/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data);
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
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to mark as read");
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
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
      if (!res.ok) throw new Error("Failed to delete notification");
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">My Notifications</h2>
      {loading && <p>Loading...</p>}
      {notifications.length === 0 && !loading && <p>No notifications found.</p>}

      {notifications.map((n) => (
        <Card key={n.id}>
          <CardHeader>
            <CardTitle>
              {n.title || "Notification"}{" "}
              {!n.is_read && (
                <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  New
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{n.message}</p>
            <div className="flex gap-2 mt-2">
              {!n.is_read && (
                <Button onClick={() => handleMarkRead(n.id)}>
                  Mark as Read
                </Button>
              )}
              <Button
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
