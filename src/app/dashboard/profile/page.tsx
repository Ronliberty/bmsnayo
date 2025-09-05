"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Shield, Wallet } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Public Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <img
            src="https://i.pravatar.cc/120"
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Jane Doe</h2>
            <p className="text-muted-foreground">
              Data Annotator | AI Trainer | Freelancer
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge>Python</Badge>
              <Badge variant="outline">Machine Learning</Badge>
              <Badge variant="success">Data Annotation</Badge>
            </div>
            <Button size="sm">Contact</Button>
          </div>
        </CardContent>
      </Card>

      {/* Private Data */}
      <Card>
        <CardHeader>
          <CardTitle>Private Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Email: jane.doe@example.com</span>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span>Balance: $245.00</span>
            </div>
            <Button variant="outline" size="sm">
              Withdraw
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Subscription: Free Plan</span>
            </div>
            <Button size="sm">Upgrade</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
