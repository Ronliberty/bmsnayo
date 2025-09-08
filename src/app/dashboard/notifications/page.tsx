"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

// ------------------ Page Component -------------------
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/notifications/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`, // assumes you store token in localStorage
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6" /> Notifications
      </h1>

      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <p className="text-muted-foreground">No notifications yet 🎉</p>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              className={`transition ${
                !n.is_read ? "border-blue-500 shadow-md" : "opacity-80"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{n.title}</CardTitle>
                  <CardDescription>
                    {new Date(n.created_at).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge
                  variant={!n.is_read ? "default" : "outline"}
                  className="capitalize"
                >
                  {n.type}
                </Badge>
              </CardHeader>
              <CardContent>
                <p>{n.message}</p>
                {n.type === "job" && (
                  <Button size="sm" className="mt-3">
                    View Job
                  </Button>
                )}
                {n.type === "payment" && (
                  <Button size="sm" className="mt-3">
                    View Transaction
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
