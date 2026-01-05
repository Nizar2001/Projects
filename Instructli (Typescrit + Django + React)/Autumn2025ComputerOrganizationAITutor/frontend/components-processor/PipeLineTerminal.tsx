"use client";

import React, { useEffect, useState } from "react";

interface PipeLineTerminalProps {
  code: string;
  currCycle: number;
  asmCode: string;
  onAsmCodeChange: (newAsmCode: string) => void
  onCodeChange: (newCode: string) => void;
  onExecute: (index: number) => void;
  onBackward: (currCycle: number) => void;
  onReset: () => void;
  onPresetChange: (preset: { index: number; note: string } | null) => void;
  onCompile: () => void;
  processorType: string;
  onProcessorChange: (proc: string) => void;
  compilationError: string
  registerInit: string
  setRegisterInit: (register: string) => void
}

interface Preset {
  index: number;
  label: string;
  code: string;
  note: string;
  highlight?: Record<number, number[]>;
}

export default function Terminal({
  code,
  currCycle,
  asmCode,
  onAsmCodeChange,
  onCodeChange,
  onExecute,
  onBackward,
  onReset,
  onPresetChange,
  onCompile,
  processorType,
  onProcessorChange,
  compilationError,
  registerInit,
  setRegisterInit
}: PipeLineTerminalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(3);

  // ===== Presets =====
  const presets: Preset[] = [
    {
      index: 0,
      label: "Data Hazard Example",
      code: `add x28, x29, x31
sub x5, x28, x6`,
      note: `DATA HAZARD: Suppose that there is no forwarding unit only hazard detection. 
Instruction 2 depends on x28 from instruction 1 which is only available after WB stage. 
A bubble is inserted to stall and resolve the hazard.
Initial: x28=0, x29=5, x31=1, x6=4. Final: x28=6, x5=2.`,
      highlight: {
        0: [0],
        1: [0, 1],
        2: [0, 1, 2],
        3: [0, 1, 2],
        4: [0, 1, 2],
        5: [1, 2],
        6: [2],
      },
    },
    {
      index: 1,
      label: "Control Hazard Example",
      code: `add x30, x31, x5
beq x1, x0, 40
addi x28, x0, 10`,
      note: `CONTROL HAZARD: Suppose that there is no forwarding unit only hazard detection. 
Result of branch is not available until EX stage. 
If the branch is taken (as assumed), a hazard occurs, and a bubble is inserted to flush the stage.`,
      highlight: {
        0: [0],
        1: [0, 1],
        2: [0, 1, 2],
        3: [0, 1, 2, 3],
        4: [0, 4],
        5: [4],
        6: [4],
        7: [4],
        8: [],
      },
    },
    {
      index: 3,
      label: "No Hazards",
      code: `add x28, x29, x31
li x29, 10
addi x28, x5, 10`,
      note: `NO HAZARDS: Instructions use different registers or have sufficient separation. 
Initial: x29=5, x31=3, x5=7. 
Final: x28=17 (last instruction overwrites), x29=10.`,
      highlight: {
        0: [0],
        1: [0, 1],
        2: [0, 1, 2],
        3: [0, 1, 2],
        4: [0, 1, 2],
        5: [1, 2],
        6: [2],
        7: [],
      },
    },
    {
      index: 4,
      label: "Custom Instruction",
      code: code,
      note: "You can enter your code. All registers are initialized to 0.",
    },
  ];

  // ===== Lifecycle =====
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const defaultPreset = presets.find((p) => p.label === "No Hazards");
    if (defaultPreset) {
      handlePresetChange({
        target: { value: "No Hazards" },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return null;

  // ===== Handlers =====
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = presets.find((p) => p.label === e.target.value);
    if (!preset) return;
    setSelectedPreset(preset.index);
    onCodeChange(preset.code);
    onReset();
    onPresetChange({ index: preset.index, note: preset.note });
  };



  const currentPreset = presets.find((p) => p.index === selectedPreset);
  const highlightIndices = currentPreset?.highlight?.[currCycle] || [];
  const codeLines = code.split("\n").map((line) => line.trim()).filter(Boolean);

  // ===== Render =====
  return (
    <div className="w-full mx-auto flex flex-col">
      <div className="flex-none bg-white pb-3 pt-2">
        {/* ==== Top Bar ==== */}
        <div className="flex justify-between items-center px-6 py-2 text-sm">
          <div className="flex space-x-3 items-center">
            {/* Preset Selector */}
            <select
              className="border border-gray-300 bg-gray-50 text-gray-900 text-sm p-1 rounded focus:outline-none"
              onChange={handlePresetChange}
              defaultValue="No Hazards"
            >
              <option value="" disabled>
                Select a preset...
              </option>
              {presets.map((p) => (
                <option key={p.index} value={p.label}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* Processor Selector */}
            {selectedPreset == 4 && <select
              className="border border-gray-300 bg-gray-50 text-gray-900 text-sm p-1 rounded focus:outline-none"
              value={processorType}
              onChange={(e) => onProcessorChange(e.target.value)}
            >
              <option value="RV32_5S_NO_FW_HZ">RV32_5S_NO_FW_HZ</option>
              <option value="RV32_5S_NO_HZ">RV32_5S_NO_HZ</option>
              <option value="RV32_5S_NO_FW">RV32_5S_NO_FW</option>
              <option value="RV32_5S">RV32_5S</option>
            </select>}

            {/* Compile Button (only in Custom mode) */}
            {selectedPreset === 4 && (
              <button
                onClick={() => onCompile()}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Compile
              </button>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex space-x-2 text-blue-600">
            <button onClick={onReset} className="hover:underline cursor-pointer">
              Reset
            </button>
            <span>|</span>
            <button
              onClick={() => onBackward(currCycle)}
              className={`hover:underline cursor-pointer ${
                selectedPreset === -1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={selectedPreset === -1}
            >
              Backward
            </button>
            <span>|</span>
            <button
              onClick={() => onExecute(selectedPreset)}
              className={`hover:underline cursor-pointer ${
                selectedPreset === -1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={selectedPreset === -1}
            >
              Next
            </button>
          </div>
        </div>

        {/* ==== Code Area ==== */}
        <div className="flex-1 bg-white px-6 relative max-h-32">
          {selectedPreset == 4 ? (
          <div className="flex gap-4"> {/* Split horizontally */}
            {/* Left: Assembly Input */}
            <div className="flex-1">
              <textarea
                value={asmCode}
                onChange={(e) => onAsmCodeChange(e.target.value)}
                placeholder="Enter your assembly code here..."
                className="w-full h-30 border border-gray-300 rounded bg-gray-50 font-mono text-sm p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto text-black"
                style={{ lineHeight: "1.5", tabSize: 2 }}
              />
              {compilationError && (
                <p className="text-red-500 text-sm font-medium text-center mt-1">
                  {compilationError}
                </p>
              )}
            </div>

            {/* Right: Register Initialization */}
            <div className="w-1/3"> {/* You can adjust width (e.g., w-1/4 or w-1/2) */}
              <textarea
                value={registerInit}
                onChange={(e) => setRegisterInit(e.target.value)}
                placeholder="Enter register initializations (e.g. x1=5, x2=10) separated by comma. If leave empty, all register are zero"
                className="w-full h-30 border border-gray-300 rounded bg-gray-50 font-mono text-sm p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 overflow-auto text-black"
                style={{ lineHeight: "1.5", tabSize: 2 }}
              />
              <p className="text-gray-500 text-xs mt-1 text-center">
                Example: x1 = 5, x2 = 10
              </p>
            </div>
          </div>
        ) : (
            <div className="border border-gray-300 rounded bg-gray-50">
              <div
                className="mx-2 mb-2 text-sm font-mono text-opacity-80 overflow-auto whitespace-pre"
                style={{ lineHeight: "1.5", tabSize: 2 }}
              >
                {codeLines.length ? (
                  codeLines.map((line, index) => {
                    const isHighlighted = highlightIndices.includes(index);
                    return (
                      <span
                        key={index}
                        className={`block px-2 ${
                          isHighlighted
                            ? "bg-gray-200 text-gray-900 font-semibold"
                            : "text-gray-900"
                        }`}
                      >
                        {line}
                      </span>
                    );
                  })
                ) : (
                  <span className="block px-2 text-gray-500 font-semibold">
                    Select a Preset value
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
