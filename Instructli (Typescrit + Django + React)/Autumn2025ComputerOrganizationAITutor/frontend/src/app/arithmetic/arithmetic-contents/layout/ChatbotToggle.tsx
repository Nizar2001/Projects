"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChatbotToggleProps {
  isExpanded: boolean;
  chatbotWidth: number;
  isDragging: boolean;
  toggleChatbot: () => void;
}

export default function ChatbotToggle({
  isExpanded,
  chatbotWidth,
  isDragging,
  toggleChatbot,
}: ChatbotToggleProps) {
  return (
    <button
      onClick={toggleChatbot}
      className="absolute top-1/2 z-50 transform -translate-y-1/2 
                bg-[#36517d] text-white rounded-l-md shadow-md p-2 
                hover:bg-[#2b4066] transition-all duration-300"
      style={{
        right: `${chatbotWidth}px`,
        transition: isDragging ? "none" : "right 0.3s ease-in-out",
      }}
      title={isExpanded ? "Collapse Chatbot" : "Expand Chatbot"}
    >
      {isExpanded ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
    </button>
  );
}