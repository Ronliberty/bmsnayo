"use client";
import { MessageCircle } from "lucide-react";

interface ChatLauncherProps {
  onOpen?: () => void;
}

export default function ChatLauncher({ onOpen }: ChatLauncherProps) {
  return (
    <div className="fixed bottom-20  md:bottom-4 right-4 z-50">
    <button 
    onClick={onOpen}
    
    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
      <MessageCircle size={24} />
    </button>
    </div>
  );
}