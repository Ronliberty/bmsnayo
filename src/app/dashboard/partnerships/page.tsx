"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Partnership {
  id: number;
  title: string;
  description: string;
  commission_type: string;
  commission_value: number;
  referral_enabled: boolean;
  referral_commission_rate: number;
  status: string;
}

interface Question {
  id: number;
  question_text: string;
  question_type: "text" | "boolean" | "select";
  required: boolean;
  options?: string[];
}

export default function PartnershipsWithApplication() {
  const { access } = useAuth();

  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [joinedIds, setJoinedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeApplicationId, setActiveApplicationId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [appError, setAppError] = useState<string | null>(null);
  const [appSuccess, setAppSuccess] = useState(false);
  const [appLoading, setAppLoading] = useState(false);

  // Fetch all partnerships
  const fetchPartnerships = async () => {
    if (!access) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/partner/partnerships/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      const data = await res.json();
      setPartnerships(data);
    } catch (err) {
      console.error("Error fetching partnerships:", err);
    }
  };

  // Fetch user's joined partnerships
  const fetchUserPartnerships = async () => {
    if (!access) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/partner/my/partnerships/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      const data = await res.json();
      setJoinedIds(data.map((p: any) => p.partnership.id));
    } catch (err) {
      console.error("Error fetching user partnerships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerships();
    fetchUserPartnerships();
  }, [access]);

  // Start application process
  const handleJoinClick = async (partnershipId: number) => {
    setActiveApplicationId(partnershipId);
    setAppLoading(true);
    setAppError(null);
    setAppSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/partner/partnerships/${partnershipId}/questions/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      const data = await res.json();
      setQuestions(data);
      setAnswers({}); // reset answers
    } catch (err) {
      setAppError("Failed to load questions.");
    } finally {
      setAppLoading(false);
    }
  };

  // Handle answer change with automatic type handling
  const handleChangeAnswer = (q: Question, value: any) => {
    let formattedValue: any = value;

    if (q.question_type === "boolean") {
      formattedValue = value === "true" || value === true;
    } else if (q.question_type === "text" || q.question_type === "select") {
      formattedValue = value || null; // send null for empty
    }

    setAnswers((prev) => ({ ...prev, [q.id]: formattedValue }));
  };

  // Submit application
  const handleSubmitApplication = async () => {
    if (!access || activeApplicationId === null) return;

    // Validate required fields
    for (const q of questions) {
      if (q.required && (answers[q.id] === undefined || answers[q.id] === null)) {
        setAppError(`Please answer the question: "${q.question_text}"`);
        return;
      }
    }

    setAppLoading(true);
    setAppError(null);
    setAppSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/partner/partnerships/${activeApplicationId}/apply/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
          body: JSON.stringify({ answers }),
        }
      );

      if (res.ok) {
        setAppSuccess(true);
        setJoinedIds((prev) => [...prev, activeApplicationId]);
        setActiveApplicationId(null);
      } else {
        const data = await res.json();
        setAppError(data.detail || "Failed to submit application.");
      }
    } catch (err) {
      setAppError("Failed to submit application.");
    } finally {
      setAppLoading(false);
    }
  };

  if (loading) return <p>Loading partnerships...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Partnership Programs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partnerships.map((p) => (
          <Card key={p.id} className="p-4 animate__animated animate__fadeIn">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Commission: {p.commission_type === "percentage" ? `${p.commission_value}%` : `$${p.commission_value}`}
            </p>
            {p.referral_enabled && (
              <p className="text-xs text-muted-foreground">Referral Rate: {p.referral_commission_rate}%</p>
            )}

            <div className="mt-2">
              {joinedIds.includes(p.id) ? (
                <Button variant="destructive">Already Joined</Button>
              ) : (
                <Button onClick={() => handleJoinClick(p.id)}>Join Program</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Application Form */}
      {activeApplicationId && (
        <div className="mt-8 p-4 border rounded space-y-4">
          <h2 className="text-xl font-bold">Application Questions</h2>

          {appLoading && <p>Loading questions...</p>}
          {appError && <p className="text-red-600">{appError}</p>}
          {appSuccess && <p className="text-green-600">Application submitted successfully!</p>}

          {!appLoading &&
            questions.map((q) => (
              <div key={q.id} className="flex flex-col">
                <label className="font-medium">
                  {q.question_text} {q.required && "*"}
                </label>

                {q.question_type === "text" && (
                  <input
                    type="text"
                    className="border px-3 py-2 rounded"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChangeAnswer(q, e.target.value)}
                  />
                )}

                {q.question_type === "boolean" && (
                  <select
                    className="border px-3 py-2 rounded"
                    value={answers[q.id] === true ? "true" : answers[q.id] === false ? "false" : ""}
                    onChange={(e) => handleChangeAnswer(q, e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                )}

                {q.question_type === "select" && (
                  <select
                    className="border px-3 py-2 rounded"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChangeAnswer(q, e.target.value)}
                  >
                    <option value="">Select</option>
                    {q.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

          {questions.length > 0 && (
            <Button onClick={handleSubmitApplication} disabled={appLoading}>
              {appLoading ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
