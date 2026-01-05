import { useState } from "react";

export default function Processor() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [highlightPath, setHighlightPath] = useState(false);

  return (
    <div className="w-full aspect-[4/3] border bg-white rounded-xl overflow-hidden shadow relative">
      <svg
        viewBox="0 0 800 600"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Register File */}
        <rect
          x="100"
          y="200"
          width="120"
          height="80"
          fill="#e0e7ff"
          stroke="#4f46e5"
          strokeWidth="2"
          rx="10"
          onMouseEnter={() => setHovered("Register File")}
          onMouseLeave={() => setHovered(null)}
        />
        <text x="160" y="245" textAnchor="middle" fontSize="16" fill="#1e1b4b">Register</text>

        {/* ALU */}
        <rect
          x="300"
          y="200"
          width="100"
          height="80"
          fill="#fee2e2"
          stroke="#b91c1c"
          strokeWidth="2"
          rx="10"
          onMouseEnter={() => setHovered("ALU")}
          onMouseLeave={() => setHovered(null)}
        />
        <text x="350" y="245" textAnchor="middle" fontSize="16" fill="#7f1d1d">ALU</text>

        {/* Wire from Register to ALU */}
        <line
          x1="220"
          y1="240"
          x2="300"
          y2="240"
          stroke={highlightPath ? "#f59e0b" : "#000"}
          strokeWidth={highlightPath ? 4 : 2}
        />

        {/* Optional arrowhead */}
        <polygon
          points="300,235 300,245 310,240"
          fill={highlightPath ? "#f59e0b" : "#000"}
        />
      </svg>

      {/* Hover tooltip */}
      {hovered && (
        <div className="absolute left-1/2 top-2 bg-white border border-gray-300 rounded px-3 py-1 shadow-md text-sm">
          {hovered}
        </div>
      )}

      {/* Control buttons */}
      <div className="absolute bottom-2 left-2 flex gap-2">
        <button
          onClick={() => setHighlightPath(!highlightPath)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {highlightPath ? "Reset" : "Highlight Path"}
        </button>
      </div>
    </div>
  );
}
