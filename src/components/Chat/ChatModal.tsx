"use client";

import ChatInput from "./ChatInput";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end md:items-end md:justify-end">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
      ></div>

      {/* Chat Modal */}
      <div className="
        relative
        w-full max-w-sm
        h-[500px] md:h-[500px]
        bg-white
        rounded-t-lg md:rounded-lg
        shadow-xl
        overflow-hidden
        flex flex-col
        m-4
        md:m-6
        md:mr-6
        md:mb-6
        animate-slide-up
      ">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white">
          <h2 className="text-lg font-semibold">Customer Support</h2>
          <button
            onClick={onClose}
            className="text-white text-xl font-bold focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Placeholder for Chat Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          Hi ChatModal
        </div>

        {/* Placeholder for Chat Input */}
        <ChatInput />
      </div>
    </div>
  );
}
