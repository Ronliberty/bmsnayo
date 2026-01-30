"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchDisputeMessages, postDisputeMessage } from "@/lib/market/api";
import { DisputeMessage } from "@/lib/market/api"; 

type DisputeChatProps = {
  disputeId: number;
};

export default function DisputeChat({ disputeId }: DisputeChatProps) {
  const { access } = useAuth();
  const [messages, setMessages] = useState<DisputeMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!access) return;
    setLoading(true);
    try {
      const data = await fetchDisputeMessages(access, disputeId);
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!access || (!newMessage && !file)) return;

    setSending(true);
    try {
      const msg = await postDisputeMessage(access, disputeId, {
        message: newMessage,
        attachment: file,
      });
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      setFile(null);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [disputeId]);

  return (
    <div className="flex flex-col h-full border rounded p-4 bg-white">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_role === "buyer" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-2 rounded ${
                  msg.sender_role === "buyer"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.message && <p>{msg.message}</p>}
                {msg.attachment && (
                  <a
                    href={msg.attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline"
                  >
                    View attachment
                  </a>
                )}
                <div className="text-xs text-gray-400 text-right">
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          className="border rounded p-2 w-full"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSend}
          disabled={sending || (!newMessage && !file)}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
