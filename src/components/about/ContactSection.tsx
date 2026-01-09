// src/components/about/ContactSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <ContactSkeleton />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For production, integrate API endpoint here
    console.log(form);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 bg-background">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Contact Us
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Have a question, need support, or want to request a demo? Reach out to us below.
        </p>

        {submitted ? (
          <motion.div
            className="mt-10 p-6 bg-card rounded-lg text-center text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Thank you! We received your message and will get back to you shortly.
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-4 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject (Optional)"
              value={form.subject}
              onChange={handleChange}
              className="w-full rounded-md border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full rounded-md border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="mt-4 rounded-md bg-primary px-6 py-3 text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              Send Message
            </button>
          </motion.form>
        )}
      </div>

      {/* Chatbot + Human Agent */}
      <ChatBotButton />
    </section>
  );
}

/* ChatBot + Human Agent floating button */
function ChatBotButton() {
  const [open, setOpen] = useState(false);
  const [humanRequested, setHumanRequested] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full bg-primary p-4 shadow-lg text-primary-foreground hover:opacity-90 transition"
        >
          💬
        </button>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 w-72 bg-card rounded-lg shadow-lg p-4 flex flex-col gap-4"
          >
            {humanRequested ? (
              <div className="text-sm text-muted-foreground">
                A human agent will contact you shortly. Thank you!
              </div>
            ) : (
              <>
                <p className="text-sm text-foreground">Hi! How can we help you today?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setHumanRequested(true)}
                    className="flex-1 rounded-md bg-secondary px-3 py-2 text-secondary-foreground text-sm hover:opacity-90 transition"
                  >
                    Request Human Agent
                  </button>
                  <button
                    onClick={() => alert("ChatBot is under development")}
                    className="flex-1 rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm hover:opacity-90 transition"
                  >
                    ChatBot
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}

/* Skeleton Loader */
function ContactSkeleton() {
  return (
    <section className="relative py-24 bg-background animate-pulse">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="h-6 w-40 rounded bg-muted mx-auto" />
        <div className="mt-3 h-4 w-80 rounded bg-muted mx-auto" />

        <div className="mt-10 flex flex-col gap-4">
          <div className="h-10 w-full rounded-md bg-muted" />
          <div className="h-10 w-full rounded-md bg-muted" />
          <div className="h-10 w-full rounded-md bg-muted" />
          <div className="h-24 w-full rounded-md bg-muted" />
          <div className="h-10 w-32 rounded-md bg-muted mx-auto mt-2" />
        </div>
      </div>
    </section>
  );
}
