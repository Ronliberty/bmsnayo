"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Shield, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // ✅ get access token

interface FreelancerProfile {
  id: number;
  bio: string;
  hourly_rate: string;
  currency: string;
  availability: string;
  skills: string[];
  rating_avg: string;
  rating_count: number;
  created_at: string;
  user?: { username?: string; email?: string }; // extend if API sends user info
}

export default function ProfilePage() {
  const { access } = useAuth();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!access) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/freelancer/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to fetch profile");
        }

        const data = await res.json();
        setProfile(data);
      } catch (error: any) {
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [access]);

  // pick first letter of username/email/id
  const getInitial = () => {
    if (!profile) return "?";
    if (profile.user?.username) return profile.user.username.charAt(0).toUpperCase();
    if (profile.user?.email) return profile.user.email.charAt(0).toUpperCase();
    return String(profile.id).charAt(0);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>

      {loading && <p className="text-muted-foreground">Loading profile...</p>}
      {err && <p className="text-red-500">{err}</p>}

      {!loading && !err && profile && (
        <>
          {/* Public Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              {/* Avatar with initials */}
              <div className="w-24 h-24 flex items-center justify-center rounded-full border bg-primary text-white text-3xl font-bold">
                {getInitial()}
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold">
                  {profile.user?.username || `Freelancer #${profile.id}`}
                </h2>
                <p className="text-muted-foreground">{profile.bio}</p>
                <div className="flex gap-2 flex-wrap">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill, idx) => (
                      <Badge key={idx}>{skill}</Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No skills added</Badge>
                  )}
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
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Rate: {profile.currency} {profile.hourly_rate}/hr
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Rating: {profile.rating_avg} ({profile.rating_count} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Availability: {profile.availability}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
