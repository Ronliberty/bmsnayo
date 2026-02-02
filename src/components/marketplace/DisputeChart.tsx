"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchDisputeMessages,
  postDisputeMessage,
  DisputeMessage,
} from "@/lib/market/api";

type DisputeChatProps = {
  disputeId: number;
};

export default function DisputeChat({ disputeId }: DisputeChatProps) {
  const { access } = useAuth();

  const [messages, setMessages] = useState<DisputeMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------
   * AUTO SCROLL
   * ------------------------------------------- */
  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------------------------------------
   * LOAD MESSAGES
   * ------------------------------------------- */
  const loadMessages = useCallback(async () => {
    if (!access || !disputeId) return;

    setLoading(true);
    try {
      const data = await fetchDisputeMessages(access, disputeId);
      setMessages(data);
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      console.error("Failed to load dispute messages", err);
    } finally {
      setLoading(false);
    }
  }, [access, disputeId]);

  /* ---------------------------------------------
   * SEND MESSAGE
   * ------------------------------------------- */
  const handleSend = async () => {
    if (!access || (!newMessage.trim() && !file)) return;

    setSending(true);
    try {
      const msg = await postDisputeMessage(access, disputeId, {
        message: newMessage.trim(),
        attachment: file,
      });

      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      setFile(null);

      setTimeout(scrollToBottom, 50);
    } catch (err) {
      console.error("Failed to send dispute message", err);
    } finally {
      setSending(false);
    }
  };

  /* ---------------------------------------------
   * EFFECT
   * ------------------------------------------- */
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  /* ---------------------------------------------
   * RENDER
   * ------------------------------------------- */
  return (
 <div className="flex flex-col h-[100dvh] sm:h-[420px] border border-border rounded-none sm:rounded-lg bg-background">
  {/* 🧾 MESSAGE LIST */}
  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
    {loading ? (
      <p className="text-sm text-muted-foreground text-center">
        Loading messages…
      </p>
    ) : messages.length === 0 ? (
      <p className="text-sm text-muted-foreground text-center">
        No messages yet. Start the dispute conversation.
      </p>
    ) : (
      messages.map((msg) => {
        const isBuyer = msg.sender_role === "buyer";

        return (
          <div
            key={msg.id}
            className={`flex ${isBuyer ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-xs p-3 rounded-lg shadow-sm ${
                isBuyer
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.message && (
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.message}
                </p>
              )}

              {msg.attachment && (
                <a
                  href={msg.attachment}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-2 text-xs underline text-primary"
                >
                  📎 View attachment
                </a>
              )}

              <div className="mt-1 text-[10px] text-muted-foreground text-right">
                {new Date(msg.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })
    )}

    <div ref={scrollRef} />
  </div>

  {/* ✍️ INPUT (sticky on mobile) */}
  <div className="border-t border-border p-3 space-y-2 bg-background sticky bottom-0">
    <textarea
      className="border border-input rounded p-2 w-full text-sm resize-none
                 bg-background text-foreground placeholder:text-muted-foreground"
      rows={2}
      placeholder="Type your message…"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      disabled={sending}
    />

    <div className="flex items-center gap-2">
      <input
        type="file"
        className="text-xs text-muted-foreground"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        className="ml-auto bg-primary text-primary-foreground px-4 py-2 rounded text-sm
                   disabled:opacity-50 disabled:pointer-events-none"
        onClick={handleSend}
        disabled={sending || (!newMessage.trim() && !file)}
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </div>
  </div>
</div>

  );
}
