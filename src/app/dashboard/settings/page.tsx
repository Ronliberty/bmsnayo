"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LogOut, Trash2, Key } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "@/app/hooks/useAccount";
import Link from "next/link";

export default function SettingsPage() {
  const { logout, access } = useAuth();
  const router = useRouter();

  // ✅ hooks must always be called, even if access is null
  const { data: account, isLoading } = useAccount(access ?? "");
  const updateAccount = useUpdateAccount(access ?? "");
  const deleteAccount = useDeleteAccount(access ?? "");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // preload existing account values when available
  useEffect(() => {
    if (account) {
      setEmail(account.email || "");
      setPhone(account.phone || "");
    }
  }, [account]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  function handleSave() {
    updateAccount.mutate({ email, phone });
  }

  function handleDelete() {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        logout();
        router.push("/");
      },
    });
  }

  // show message if not logged in
  if (!access) {
    return <p>You must be logged in to view settings.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-6">
        Manage your account, preferences, and security.
      </p>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Account Info */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={updateAccount.isPending}
                  >
                    {updateAccount.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Change Password</span>
                <Link href="/dashboard/settings/change-password">
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span>Enable Two-Factor Authentication</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
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
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                size="lg"
                onClick={handleDelete}
                disabled={deleteAccount.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteAccount.isPending ? "Deleting..." : "Delete Account"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
