"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Shield, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

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
  user?: { username?: string; email?: string };
}

export default function ProfilePage() {
  const { access } = useAuth();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(true);

  // editable fields
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [availability, setAvailability] = useState("");
  const [skills, setSkills] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!access) return;
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/nayo/profile/freelancer/`,
          { headers: { Authorization: `Bearer ${access}` } }
        );
        setProfile(data);

        // prefill form
        setBio(data.bio || "");
        setHourlyRate(data.hourly_rate || "");
        setCurrency(data.currency || "USD");
        setAvailability(data.availability || "");
        setSkills(data.skills?.join(", ") || "");

        if (data.bio || data.skills?.length > 0) {
          setEditing(false);
        }
      } catch (error: any) {
        setErr(error.response?.data?.detail || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [access]);

  const saveProfile = async () => {
    if (!access) return;
    setSaving(true);
    try {
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nayo/profile/freelancer/`,
        {
          bio,
          hourly_rate: hourlyRate,
          currency,
          availability,
          skills: skills.split(",").map((s) => s.trim()).filter((s) => s),
        },
        { headers: { Authorization: `Bearer ${access}` } }
      );

      // ✅ Update both profile & form states
      setProfile(data);
      setBio(data.bio || "");
      setHourlyRate(data.hourly_rate || "");
      setCurrency(data.currency || "USD");
      setAvailability(data.availability || "");
      setSkills(data.skills?.join(", ") || "");

      setSuccess(true);
      setEditing(false);
    } catch (error: any) {
      setErr(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>

      {loading && <p className="text-muted-foreground">Loading profile...</p>}
      {err && <p className="text-red-500">{err}</p>}
      {success && <p className="text-green-600">Profile successfully updated!</p>}

      {!loading && !err && profile && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

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

              {!editing && (
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Profile Form */}
          {editing && (
            <Card>
              <CardHeader>
                <CardTitle>{profile.bio ? "Edit Profile" : "Complete Your Profile"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <Input
                  placeholder="Hourly Rate"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
                <Input
                  placeholder="Currency (e.g. USD)"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
                <Input
                  placeholder="Availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                />
                <Input
                  placeholder="Skills (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />

                <div className="flex gap-3">
                  <Button onClick={saveProfile} disabled={saving}>
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
