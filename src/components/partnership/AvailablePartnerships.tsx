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

  const [activeApplicationId, setActiveApplicationId] =
    useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [appError, setAppError] = useState<string | null>(null);
  const [appSuccess, setAppSuccess] = useState(false);
  const [appLoading, setAppLoading] = useState(false);

  /* ==========================
     Fetch partnerships (FIXED)
     ========================== */
  useEffect(() => {
    if (!access) return;

    const fetchPartnerships = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnership/partnerships/`,
          { headers: { Authorization: `Bearer ${access}` } }
        );

        // ✅ DRF pagination-safe
        setPartnerships(
          Array.isArray(data.results) ? data.results : []
        );
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/partnership/partnership-questions/${partnershipId}/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );

      // questions is already a list
      setQuestions(Array.isArray(data) ? data : []);
      setAnswers({});
    } catch {
      setAppError("Failed to load questions.");
    } finally {
      setAppLoading(false);
    }
  };

  const handleChangeAnswer = (q: Question, value: any) => {
    let formattedValue: any = value;

    if (q.question_type === "boolean") {
      formattedValue = value === "true" || value === true;
    } else {
      formattedValue = value || null;
    }

    setAnswers((prev) => ({ ...prev, [q.id]: formattedValue }));
  };

  const handleSubmitApplication = async () => {
    if (!access || activeApplicationId === null) return;

    for (const q of questions) {
      if (q.required && answers[q.id] == null) {
        setAppError(`Please answer: "${q.question_text}"`);
        return;
      }
    }

    setAppLoading(true);
    setAppError(null);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/partner/partnerships/${activeApplicationId}/apply/`,
        { answers },
        { headers: { Authorization: `Bearer ${access}` } }
      );

      setAppSuccess(true);
      setActiveApplicationId(null);
    } catch (err: any) {
      setAppError(
        err.response?.data?.detail || "Failed to submit application."
      );
    } finally {
      setAppLoading(false);
    }
  };

  if (loading) {
    return <p>Loading available partnerships...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {partnerships.length === 0 && (
        <p className="text-muted-foreground col-span-full">
          No partnerships available at the moment.
        </p>
      )}

      {partnerships.map((p) => (
        <Card
          key={p.id}
          className="p-4 flex flex-col space-y-2"
        >
          <h3 className="font-semibold text-lg">{p.title}</h3>

          <p className="text-sm text-muted-foreground">
            {p.description}
          </p>

          <p className="text-xs text-muted-foreground">
            Commission:{" "}
            {p.commission_type === "percentage"
              ? `${p.commission_value}%`
              : `$${p.commission_value}`}
          </p>

          {p.referral_enabled && (
            <p className="text-xs text-muted-foreground">
              Referral Rate: {p.referral_commission_rate}%
            </p>
          )}

          <Button
            className="mt-auto w-full sm:w-auto"
            onClick={() => handleJoinClick(p.id)}
          >
            Join Program
          </Button>
        </Card>
      ))}

      {/* Application Form */}
      {activeApplicationId && (
        <div className="mt-6 p-4 border rounded col-span-full space-y-4">
          <h2 className="text-xl font-bold">Application Questions</h2>

          {appLoading && <p>Loading questions...</p>}
          {appError && <p className="text-red-600">{appError}</p>}
          {appSuccess && (
            <p className="text-green-600">
              Application submitted successfully!
            </p>
          )}

          {!appLoading &&
            questions.map((q) => (
              <div key={q.id} className="space-y-1">
                <label className="font-medium text-sm">
                  {q.question_text} {q.required && "*"}
                </label>

                {q.question_type === "text" && (
                  <input
                    className="border px-3 py-2 rounded w-full"
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      handleChangeAnswer(q, e.target.value)
                    }
                  />
                )}

                {q.question_type === "boolean" && (
                  <select
                    className="border px-3 py-2 rounded w-full"
                    value={
                      answers[q.id] === true
                        ? "true"
                        : answers[q.id] === false
                        ? "false"
                        : ""
                    }
                    onChange={(e) =>
                      handleChangeAnswer(q, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                )}

                {q.question_type === "select" && (
                  <select
                    className="border px-3 py-2 rounded w-full"
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      handleChangeAnswer(q, e.target.value)
                    }
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
            <Button
              onClick={handleSubmitApplication}
              disabled={appLoading}
            >
              {appLoading ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
