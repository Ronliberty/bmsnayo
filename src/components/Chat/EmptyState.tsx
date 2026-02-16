"use client";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-2xl font-semibold mb-4">No Conversations Yet</h2>
      <p className="text-gray-500 mb-6">Start a new conversation to see messages here.</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Start New Conversation
      </button>
    </div>
  );
}