"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-2">
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-200"></div>
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-400"></div>
    </div>
  );
}