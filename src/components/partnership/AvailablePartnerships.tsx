"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface Partnership {
  id: number;
  title: string;
  description: string;
  commission_type: string;
  commission_value: number;
  referral_enabled: boolean;
  referral_commission_rate: number;
}

interface Question {
  id: number;
  question_text: string;
  question_type: "text" | "boolean" | "select";
  required: boolean;
  options?: string[];
}

export default function AvailablePartnerships() {
  const { access } = useAuth();
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeApplicationId, setActiveApplicationId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [appError, setAppError] = useState<string | null>(null);
  const [appSuccess, setAppSuccess] = useState(false);
  const [appLoading, setAppLoading] = useState(false);

  useEffect(() => {
    if (!access) return;

    const fetchPartnerships = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/partner/partnerships/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        setPartnerships(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerships();
  }, [access]);

  const handleJoinClick = async (partnershipId: number) => {
    setActiveApplicationId(partnershipId);
    setAppLoading(true);
    setAppError(null);
    setAppSuccess(false);

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/partner/partnerships/${partnershipId}/questions/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      setQuestions(data);
      setAnswers({});
    } catch (err) {
      setAppError("Failed to load questions.");
    } finally {
      setAppLoading(false);
    }
  };

  const handleChangeAnswer = (q: Question, value: any) => {
    let formattedValue: any = value;
    if (q.question_type === "boolean") formattedValue = value === "true" || value === true;
    else if (q.question_type === "text" || q.question_type === "select") formattedValue = value || null;
    setAnswers((prev) => ({ ...prev, [q.id]: formattedValue }));
  };

  const handleSubmitApplication = async () => {
    if (!access || activeApplicationId === null) return;

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
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/partner/partnerships/${activeApplicationId}/apply/`,
        { answers },
        { headers: { Authorization: `Bearer ${access}` } }
      );
      setAppSuccess(true);
      setActiveApplicationId(null);
    } catch (err: any) {
      setAppError(err.response?.data?.detail || "Failed to submit application.");
    } finally {
      setAppLoading(false);
    }
  };

  if (loading) return <p>Loading available partnerships...</p>;

  return (
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
            <Button onClick={() => handleJoinClick(p.id)}>Join Program</Button>
          </div>
        </Card>
      ))}

      {/* Application Form */}
      {activeApplicationId && (
        <div className="mt-8 p-4 border rounded space-y-4 col-span-full">
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
