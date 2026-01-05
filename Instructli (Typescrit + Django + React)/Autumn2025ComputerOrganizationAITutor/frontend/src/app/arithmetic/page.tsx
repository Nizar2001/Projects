import LayoutWrapper from "./arithmetic-contents/layout/ArithmeticLayout";


import { Binary, FunctionSquare, Calculator, Sigma, AlertTriangle } from "lucide-react";
import Link from "next/link";



export default function ArithmeticPage() {
  return (
    <LayoutWrapper>

      
      <div className="flex-1 overflow-auto pb-[50px] p-10 text-gray-800 w-full max-w-none">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Arithmetic Module</h1>

      <p className="text-base mb-4 leading-relaxed w-full max-w-[120ch]">
        In this module, you’ll learn the fundamentals of <b>computer arithmetic</b> — how numbers are
        <b> represented</b>, <b>converted</b>, and <b>manipulated</b> across different bases such as
        <b> binary</b>, <b>octal</b>, <b>decimal</b>, and <b>hexadecimal</b>.
      </p>

      <p className="text-base mb-4 leading-relaxed w-full max-w-[120ch]">
        You’ll also explore how computers perform <b>arithmetic operations</b>, represent
        <b> signed values</b> using <b>sign-magnitude</b> and <b>two’s complement</b>, and understand
        the effects of <b>overflow</b>.
      </p>

      <p className="text-base mb-4 leading-relaxed w-full max-w-[120ch]">
        As you move through each section, <b>your own specialized AI tutor</b> is available to help you —
        ask questions, get <b>step-by-step explanations</b>, or clarify anything related to the topic you’re studying.
      </p>

      <p className="text-base mb-4 leading-relaxed w-full max-w-[120ch]">
      Choose from the sections below to explore each concept in detail.
      </p>




      <div className="mt-20"></div>
      

      {/* PENTAGON LAYOUT */}
      <div className="flex flex-col items-center gap-8 mt-10 pb-10 w-full max-w-full transition-all duration-300">

        {/* TOP ROW */}
        <div className="flex justify-center flex-wrap gap-6 w-full">
          <Link href="/arithmetic/arithmetic-contents/number-systems" className="w-full sm:w-auto">
          <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 
                      hover:shadow-lg hover:border-[#36517d]/60 hover:-translate-y-2 
                      transition-all duration-300 ease-in-out 
                      flex flex-col items-center justify-center text-center cursor-default
                      p-6 min-h-[220px] min-w-[280px] max-w-[360px] flex-1"
          >
            <Binary size={40} className="text-[#36517d] mb-3" />
            <h2 className="text-lg font-semibold text-[#253657] mb-1">Number Systems</h2>
            <p className="text-sm text-gray-700 px-3 leading-snug">
              Learn how computers represent numbers in binary, octal, decimal, and hexadecimal systems.
            </p>
          </div>
          </Link>
        </div>

        {/* MIDDLE ROW */}
        <div className="flex justify-center flex-wrap gap-6 w-full">

          <Link href="/arithmetic/arithmetic-contents/signed-representations" className="w-full sm:w-auto">
            <div
              className="bg-white rounded-lg shadow-sm border border-gray-200 
                        hover:shadow-lg hover:border-[#36517d]/60 hover:-translate-y-2 
                        transition-all duration-300 ease-in-out 
                        flex flex-col items-center justify-center text-center cursor-default
                        p-6 min-h-[220px] min-w-[280px] max-w-[360px] flex-1"
            >
              <Sigma size={40} className="text-[#36517d] mb-3" />
              <h2 className="text-lg font-semibold text-[#253657] mb-1">Signed Representations</h2>
              <p className="text-sm text-gray-700 px-3 leading-snug">
                Understand how negative numbers are represented using sign-magnitude and two’s complement systems,
                enabling both positive and negative arithmetic.
              </p>
            </div>
          </Link>


          <Link href="/arithmetic/arithmetic-contents/arithmetic-operations" className="w-full sm:w-auto">
            <div
              className="bg-white rounded-lg shadow-sm border border-gray-200 
                        hover:shadow-lg hover:border-[#36517d]/60 hover:-translate-y-2 
                        transition-all duration-300 ease-in-out 
                        flex flex-col items-center justify-center text-center cursor-default
                        p-6 min-h-[220px] min-w-[280px] max-w-[360px] flex-1"
            >
              <FunctionSquare size={40} className="text-[#36517d] mb-3" />
              <h2 className="text-lg font-semibold text-[#253657] mb-1">Arithmetic Operations</h2>
              <p className="text-sm text-gray-700 px-3 leading-snug">
                Explore how addition and subtraction are performed in binary, and how carries and borrows are handled at the bit level.
              </p>
            </div>
          </Link>

        </div>

        {/* BOTTOM ROW */}
        <div className="flex justify-center flex-wrap gap-6 w-full">
          <Link href="/arithmetic/arithmetic-contents/overflow" className="w-full sm:w-auto">
            <div
              className="bg-white rounded-lg shadow-sm border border-gray-200 
                        hover:shadow-lg hover:border-[#36517d]/60 hover:-translate-y-2 
                        transition-all duration-300 ease-in-out 
                        flex flex-col items-center justify-center text-center cursor-default
                        p-6 min-h-[220px] min-w-[280px] max-w-[360px] flex-1"
            >
              <AlertTriangle size={40} className="text-[#36517d] mb-3" />
              <h2 className="text-lg font-semibold text-[#253657] mb-1">Overflow</h2>
              <p className="text-sm text-gray-700 px-3 leading-snug">
                Discover how overflow occur when arithmetic exceeds bit limits.
              </p>
            </div>
          </Link>

          <Link href="/arithmetic/arithmetic-contents/arithmetic-calculator" className="w-full sm:w-auto">
          <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 
                      hover:shadow-lg hover:border-[#36517d]/60 hover:-translate-y-2 
                      transition-all duration-300 ease-in-out 
                      flex flex-col items-center justify-center text-center cursor-default
                      p-6 min-h-[220px] min-w-[280px] max-w-[360px] flex-1"
          >
            <Calculator size={40} className="text-[#36517d] mb-3" />
            <h2 className="text-lg font-semibold text-[#253657] mb-1">Arithmetic Calculator</h2>
            <p className="text-sm text-gray-700 px-3 leading-snug">
                Use the calculator to perform arithmetic operations, identify cases of overflow, and analyze the underlying causes with assistance from your specialized AI tutor.
            </p>
          </div>
          </Link>
        </div>
      </div>
      </div>


    </LayoutWrapper>
  );
}