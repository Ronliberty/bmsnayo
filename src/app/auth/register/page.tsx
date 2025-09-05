"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500); // Mock request
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up with your email to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input type="text" placeholder="John" required />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input type="text" placeholder="Doe" required />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="••••••••" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline hover:text-primary">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
