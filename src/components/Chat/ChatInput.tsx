"use client";

export default function ChatInput() {
  return (
    <div className="p-4 border-t">
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}