"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import Link from "next/link";


export default function Sidebar() {
  const MIN_SIDEBAR_WIDTH = 240;
  const COLLAPSED_SIDEBAR_WIDTH = 15;
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  return (
    <aside
      className={`h-full border-r border-gray-300 bg-white/50 backdrop-blur-sm transition-all duration-300 flex flex-col relative`}
      style={{
        width: isSidebarExpanded ? `${MIN_SIDEBAR_WIDTH}px` : `${COLLAPSED_SIDEBAR_WIDTH}px`,
        background: "#e7ecf2",
      }}
    >
      {isSidebarExpanded && (
        <nav className="flex flex-col p-4 text-[#253657] text-[15px] font-semibold divide-y divide-gray-300">


            <Link href="/arithmetic" className="w-full sm:w-auto">
              <button
                className="py-2 hover:text-black transition cursor-pointer"
                >
              
                  Module Home
                  
              </button>
           </Link>



           <Link href="/arithmetic/arithmetic-contents/number-systems" className="w-full sm:w-auto">
              <button
                className="py-2 hover:text-black transition cursor-pointer"
                >
              
                  Number Systems
                  
              </button>
           </Link>


          <Link href="/arithmetic/arithmetic-contents/signed-representations" className="w-full sm:w-auto">
              <button
                className="py-2 hover:text-black transition cursor-pointer"
              >
                Signed Representations
              </button>
          </Link>

          <Link href="/arithmetic/arithmetic-contents/arithmetic-operations" className="w-full sm:w-auto">
              <button
                className="py-2 hover:text-black transition cursor-pointer"
              >
                Arithmetic Operations
              </button>
          </Link>

        

          <Link href="/arithmetic/arithmetic-contents/overflow" className="w-full sm:w-auto">
              <button
                className="py-2 hover:text-black transition cursor-pointer"
              >
                Overflow
              </button>
          </Link>


          <Link href="/arithmetic/arithmetic-contents/arithmetic-calculator" className="w-full sm:w-auto">
              <button
                className="py-2 hover:text-black transition cursor-pointer"
              >
                Arithmetic Calculator
              </button>
          </Link>
        </nav>
      )}

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 
                  text-[#36517d] hover:scale-110 transition-transform duration-200"
        title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarExpanded ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
      </button>
    </aside>
  );
}