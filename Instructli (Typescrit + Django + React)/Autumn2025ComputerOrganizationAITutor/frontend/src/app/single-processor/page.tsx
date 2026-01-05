"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { returnPath,  JsonResponse} from '@/utils/single-processor';

// dynamically import so it only runs client-side
const Terminal = dynamic(
  () => import("../../../components-processor/Terminal"),
  { ssr: false }
);

import SingleProcessor from "../../../components-processor/SingleProcessor";
import Chatbot from "../../../components/ChatBot";



export default function Home() {
  const MIN_CHATBOT_WIDTH = 540;  // Minimum width in pixels
  const MIN_CONTENT_WIDTH = 500;  // Minimum width for main content area (diagrams need more space)
  const [code, setCode] = useState<string>("add x28, x6, x7\n");
  const [results, setResults] = useState<JsonResponse | null | undefined>();
  const [chatbotWidth, setChatbotWidth] = useState(MIN_CHATBOT_WIDTH); // Default width
  const [isDragging, setIsDragging] = useState(false);
  const getMaxChatbotWidth = () => Math.max(MIN_CHATBOT_WIDTH, window.innerWidth - MIN_CONTENT_WIDTH);

  const handleExecute = (command: string, instructionType: string) => {
    const newResults = returnPath(command, instructionType)
    // console.log("debugging", newResults)
    // console.log("handle Execute called ")
    const diagramString = {
      data_path: newResults.data_path,
      block_data: newResults.block_data,
      command_type: newResults.command_type,
      command: command,
    };
    localStorage.setItem("singleDiagram", JSON.stringify(diagramString));
    setResults(newResults);
  }

  const handleReset = () => {
    setResults(null);
    localStorage.removeItem("singleDiagram");
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const maxWidth = getMaxChatbotWidth();
    const clampedWidth = Math.max(MIN_CHATBOT_WIDTH, Math.min(maxWidth, newWidth));
    setChatbotWidth(clampedWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse move and up
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex h-full w-full bg-white">
      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0" style={{ width: `calc(100% - ${chatbotWidth}px)` }}>
        <div className="flex-1 overflow-auto bg-white pb-[50px] p-5">
          <SingleProcessor results={results}/>
        </div>

        <div className="flex-none relative bottom-[10px]">
          <Terminal
            code={code}
            onCodeChange={setCode}
            onExecute={handleExecute}
            onReset={handleReset}
          />
        </div>
      </main>
      
      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className="w-1 bg-gray-400 hover:bg-gray-600 cursor-col-resize flex-shrink-0 transition-colors duration-200"
        style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
      />
      
      {/* Chatbot on the right side */}
      <aside 
        className="h-full flex-shrink-0 overflow-hidden"
        style={{ width: `${chatbotWidth}px` }}
      >
        <div className="w-full h-full">
          <Chatbot />
        </div>
      </aside>
    </div>
  );
}