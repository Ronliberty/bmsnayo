"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LogOut, Trash2, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted-foreground">
        Manage your account, preferences, and security.
      </p>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="user@email.com" />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input type="tel" placeholder="+1 234 567 890" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Change Password</span>
            <Button variant="outline" size="sm">
              <Key className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Enable Two-Factor Authentication</span>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Enable Notifications</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" size="lg">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <Button variant="destructive" className="w-full" size="lg">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
