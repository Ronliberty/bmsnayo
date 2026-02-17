"use client";
import { Send, Paperclip } from 'lucide-react';
export default function ChatInput() {
  return (
    <div className="p-4 border-t relative flex gap-2">
      <input
      type="text"
      placeholder="Type your message..."
      className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
      type="file"
      id="file-input"
      className="hidden"
      />
      <Paperclip 
      onClick={() => document.getElementById('file-input')?.click()}
      className="text-gray-400 cursor-pointer hover:text-gray-600"
      />
      <Send
      onClick={() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input?.value.trim()) {
        console.log('Message:', input.value);
        input.value = '';
      }
      }}
      className="text-blue-600 cursor-pointer hover:text-blue-700" />
    </div>
  );
}