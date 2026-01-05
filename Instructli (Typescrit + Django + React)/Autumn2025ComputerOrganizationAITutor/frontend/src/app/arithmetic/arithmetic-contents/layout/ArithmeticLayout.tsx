"use client";
import { useState, useEffect } from "react";
import Chatbot from "../../../../../components/ChatBot";
import Sidebar from "./Sidebar";
import ChatbotToggle from "./ChatbotToggle";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const MIN_CHATBOT_WIDTH = 540;
  const MIN_CONTENT_WIDTH = 700;

  const [chatbotWidth, setChatbotWidth] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getMaxChatbotWidth = () => Math.max(MIN_CHATBOT_WIDTH, window.innerWidth - MIN_CONTENT_WIDTH);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isExpanded) return;
    const newWidth = window.innerWidth - e.clientX;
    const maxWidth = getMaxChatbotWidth();
    const clampedWidth = Math.max(MIN_CHATBOT_WIDTH, Math.min(maxWidth, newWidth));
    setChatbotWidth(clampedWidth);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const toggleChatbot = () => {
    if (isExpanded) {
      setChatbotWidth(0);
      setIsExpanded(false);
    } else {
      setChatbotWidth(MIN_CHATBOT_WIDTH);
      setIsExpanded(true);
    }
  };

  return (
    <div className="flex h-full w-full bg-gradient-to-tr from-[#b1c4e4] via-[#c8d7ec] to-[#e8eef7] relative overflow-hidden">
      <Sidebar />

      <main
        className="flex flex-col flex-grow transition-all duration-300 bg-transparent"
        style={{ width: isExpanded ? `calc(100% - ${chatbotWidth}px)` : "100%" }}
      >
        {children}
      </main>

      {isExpanded && (
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-400 hover:bg-gray-600 cursor-col-resize flex-shrink-0 transition-colors duration-200"
        />
      )}

      <aside
        className="h-full flex-shrink-0 overflow-hidden bg-white border-l border-gray-200"
        style={{ width: `${chatbotWidth}px` }}
      >
        {isExpanded && <Chatbot />}
      </aside>

      <ChatbotToggle
        isExpanded={isExpanded}
        chatbotWidth={chatbotWidth}
        isDragging={isDragging}
        toggleChatbot={toggleChatbot}
      />
    </div>
  );
}