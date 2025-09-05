"use client";

import { Bell } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ------------------ Mock Notifications -------------------
const notifications = [
  {
    id: 1,
    type: "job",
    title: "You’ve been hired!",
    message: "Congrats 🎉 You’ve been hired as a Data Annotator for AI Lab.",
    time: "2h ago",
    status: "unread",
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Received",
    message: "You’ve received $250 from John Doe for project delivery.",
    time: "5h ago",
    status: "unread",
  },
  {
    id: 3,
    type: "system",
    title: "System Update",
    message: "Our platform will undergo maintenance on Friday at 11 PM.",
    time: "1d ago",
    status: "read",
  },
  {
    id: 4,
    type: "referral",
    title: "Referral Bonus",
    message: "Your friend Sarah joined via your referral link. You earned $20.",
    time: "3d ago",
    status: "read",
  },
];

// ------------------ Page Component -------------------
export default function NotificationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6" /> Notifications
      </h1>

      <div className="grid gap-4">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`transition ${
              n.status === "unread" ? "border-blue-500 shadow-md" : "opacity-80"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{n.title}</CardTitle>
                <CardDescription>{n.time}</CardDescription>
              </div>
              <Badge
                variant={n.status === "unread" ? "default" : "outline"}
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
        ))}
      </div>
    </div>
  );
}
