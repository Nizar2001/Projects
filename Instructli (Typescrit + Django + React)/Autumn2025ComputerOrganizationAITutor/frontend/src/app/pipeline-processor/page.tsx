"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { handlePipeLinePreset } from "@/utils/pipeline-processor";
// dynamically import so it only runs client-side -> ssr is server-side render
const PipeLineTerminal = dynamic(
  () => import("../../../components-processor/PipeLineTerminal"),
  { ssr: false }
);

import PipelineProcessor from "../../../components-processor/PipelineProcessor";
import { PipelineState } from "../../utils/pipeline-types"
import Chatbot from "../../../components/ChatBot";

export default function Home() {
  const MIN_CHATBOT_WIDTH = 540;  // Minimum width in pixels
  const MIN_CONTENT_WIDTH = 670;  // Minimum width for main content area (diagrams need more space)
  const [code, setCode] = useState<string>("add x1, x1, x2\n");
  const [results, setResults] = useState<PipelineState[]>([]);
  const [currCycle, setCurrCycle] = useState(-1);
  const [chatbotWidth, setChatbotWidth] = useState(MIN_CHATBOT_WIDTH); // Default width
  const [isDragging, setIsDragging] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<{index: number, note: string} | null>(null);

  
  const getMaxChatbotWidth = () => Math.max(MIN_CHATBOT_WIDTH, window.innerWidth - MIN_CONTENT_WIDTH);

  const handleBackward = (currCycle: number) => {
    // console.log("backwards pressed")
    if (currCycle > 0) {
      // console.log("backwards button is pressed")
      setCurrCycle(currCycle - 1);
    }
  };

  // sends terminal code to multiCycle using fetch
  const handleExecute = async (preset: number) => {
    const newCycle = currCycle + 1;
    // console.log("preset index", preset)
    // console.log(newCycle)
    setCurrCycle(newCycle)
    const data = handlePipeLinePreset(preset)
    setResults(data)
    if (currCycle >= data[data.length - 1].cycle){
      setCurrCycle(0)
    }

    localStorage.setItem("pipelineDiagram", JSON.stringify(data));
    localStorage.setItem("currCycle", JSON.stringify(newCycle%(data[data.length - 1].cycle +1)));
    // console.log("CYCLE: ", newCycle%(data[data.length - 1].cycle +1))

    /*try {
      setBranchToggled(false)
      const instructions = code
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");
      
      if (instructions.length === 0){
        throw new Error("Provided a non-empty instructions array")
      }
      const data = simulatePipeline(instructions); 

      // Calculate the new cycle value
      let newCycle = currCycle + 1;
      console.log("current Cycle", data[data.length - 1].cycle);
      
      if (newCycle > data[data.length - 1].cycle) {
        newCycle = -1;
      }

      // Update states
      setResults(data);
      setCurrCycle(newCycle);

      // Use the NEW values instead of state variables
      if ((newCycle >= 0) && data[newCycle]?.stages?.EX || data[newCycle]?.stages?.MEM || data[newCycle]?.stages?.WB) {
        setBranchFlag((data[newCycle]?.stages?.EX?.startsWith('b') || 
        data[newCycle]?.stages?.MEM?.startsWith('b') ||
        data[newCycle]?.stages?.WB?.startsWith('b'))?? false);
      } else {
        setBranchFlag(false);
      }
      console.log("Results updated:", data);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }*/
  };
  

  // resets and clears everything
  const handleReset = () => {
    setResults([]);
    setCurrCycle(-1);
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
          <PipelineProcessor results={results} currCycle={currCycle} currentPreset={currentPreset}/>
        </div>

        <div className="flex-none relative bottom-[10px]">
        <PipeLineTerminal
          code={code}
          onCodeChange={setCode}
          onExecute={handleExecute}
          onBackward={handleBackward}
          onReset={handleReset}
          currCycle={currCycle}
          onPresetChange={setCurrentPreset}
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
