"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { returnPath, JsonResponse } from '@/utils/single-processor';

import LayoutWrapper from "../../arithmetic-contents/layout/ArithmeticLayout";


// dynamically import so it only runs client-side
const Terminal = dynamic(
  () => import("../../../../../components-processor/Terminal"),
  { ssr: false }
);



// ============================================
// FEATURE 1: OPERATION CONFIGURATION
// Toggle operations on/off by changing 'enabled' to true/false
// ============================================
const OPERATION_CONFIG = {
  ADD: { enabled: true, label: 'ADD', symbol: '+', description: 'Addition' },
  SUB: { enabled: true, label: 'SUB', symbol: '−', description: 'Subtraction' },
  MUL: { enabled: false, label: 'MUL', symbol: '×', description: 'Multiplication' },
  DIV: { enabled: false, label: 'DIV', symbol: '÷', description: 'Division' },
  AND: { enabled: false, label: 'AND', symbol: '&', description: 'Bitwise AND' },
  OR: { enabled: false, label: 'OR', symbol: '|', description: 'Bitwise OR' },
  XOR: { enabled: false, label: 'XOR', symbol: '⊕', description: 'Bitwise XOR' }
} as const;

// ============================================
// ARITHMETIC MODE TYPES
// ============================================
type NumberFormat = 'UNSIGNED' | 'SIGNED';
type OverflowMode = 'UNSATURATED' | 'SATURATED';

export default function Home() {

  const [code, setCode] = useState<string>("add x28, x6, x7\n");
  const [results, setResults] = useState<JsonResponse | null | undefined>();


  // Arithmetic module state
  const [operation, setOperation] = useState('ADD');
  const [numA, setNumA] = useState<number>(5);
  const [numB, setNumB] = useState<number>(3);
  const [bitWidth, setBitWidth] = useState<number>(8);
  const [step, setStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // SYSTEM SETTINGS (Top bar)
  const [numberFormat, setNumberFormat] = useState<NumberFormat>('UNSIGNED');
  const [overflowMode, setOverflowMode] = useState<OverflowMode>('UNSATURATED');

  // OPERATION SETTINGS (Bottom bar)
  const [subtractionMethod, setSubtractionMethod] = useState<'DIRECT' | 'TWOS_COMPLEMENT'>('TWOS_COMPLEMENT');


  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  // Get min and max values for current bit width and mode
  const getRange = () => {
    if (numberFormat === 'SIGNED') {
      // Signed (Two's complement): -(2^(n-1)) to +(2^(n-1) - 1)
      return {
        min: -Math.pow(2, bitWidth - 1),
        max: Math.pow(2, bitWidth - 1) - 1
      };
    } else {
      // Unsigned: 0 to 2^n - 1
      return {
        min: 0,
        max: Math.pow(2, bitWidth) - 1
      };
    }
  };

  const range = getRange();

  const getBinary = (num: number, width: number) => {
    // Handle conversion based on number format and actual value
    if (numberFormat === 'SIGNED' && num < 0) {
      // For negative numbers in signed mode, convert to two's complement
      const maxVal = Math.pow(2, width);
      const unsignedValue = maxVal + num; // e.g., 256 + (-73) = 183
      const binary = unsignedValue.toString(2);
      return binary.padStart(width, '0').slice(-width);
    } else {
      // For unsigned or positive signed numbers
      const binary = (num >>> 0).toString(2);
      return binary.padStart(width, '0').slice(-width);
    }
  };

  // ============================================
  // TWO'S COMPLEMENT HELPER FUNCTIONS
  // ============================================

  // Get inverted bits (step 1 of two's complement)
  const getInvertedBits = (num: number, width: number) => {
    const binary = getBinary(num, width);
    return binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
  };

  // Add 1 to binary string (step 2 of two's complement)
  const addOneToBinary = (binaryStr: string) => {
    const width = binaryStr.length;
    let result = '';
    let carry = 1; // We're adding 1

    // Process from right to left
    for (let i = width - 1; i >= 0; i--) {
      const bit = parseInt(binaryStr[i]);
      const sum = bit + carry;
      result = (sum % 2) + result;
      carry = Math.floor(sum / 2);
    }

    return result;
  };

  // Get two's complement of a number
  const getTwosComplement = (num: number, width: number) => {
    const inverted = getInvertedBits(num, width);
    return addOneToBinary(inverted);
  };

  // Calculate carry bits for addition visualization
  const getCarryBits = (binA: string, binB: string) => {
    const width = binA.length;
    const carries: boolean[] = new Array(width).fill(false);
    let carry = 0;

    for (let i = width - 1; i >= 0; i--) {
      const a = parseInt(binA[i]);
      const b = parseInt(binB[i]);
      const sum = a + b + carry;

      if (sum >= 2) {
        carries[i] = true;
        carry = 1;
      } else {
        carry = 0;
      }
    }

    return carries;
  };

  // ============================================
  // ENHANCED CALCULATION WITH SATURATION SUPPORT
  // ============================================
  const calculate = () => {
    const maxVal = Math.pow(2, bitWidth);
    let result: number;
    let overflow = false;
    let carry = false;
    let saturated = false;
    let originalResult: number; // Store the mathematical result before saturation

    switch (operation) {
      case 'ADD':
        originalResult = numA + numB;
        result = originalResult;

        if (overflowMode === 'UNSATURATED') {
          // Carry flag: set when addition produces carry-out from MSB
          if (result >= maxVal) {
            carry = true;
          }

          // Overflow detection based on number format
          if (numberFormat === 'UNSIGNED') {
            // Unsigned: overflow when result exceeds max representable value
            if (result > range.max) {
              overflow = true;
            }
          } else { // SIGNED
            // Signed: overflow when two positives yield negative, or two negatives yield positive
            // Check sign bits based on actual input values (not bit patterns)
            const signA = numA < 0 ? 1 : 0;
            const signB = numB < 0 ? 1 : 0;
            const resultWrapped = result % maxVal;
            const signResult = resultWrapped >= Math.pow(2, bitWidth - 1) ? 1 : 0;

            // Overflow occurs when: (A and B positive, Result negative) OR (A and B negative, Result positive)
            if ((signA === 0 && signB === 0 && signResult === 1) ||
              (signA === 1 && signB === 1 && signResult === 0)) {
              overflow = true;
            }
          }

          // Wrap result to bit width
          result = result % maxVal;
        } else { // SATURATED
          if (numberFormat === 'UNSIGNED') {
            // Unsigned saturated: clamp to [0, 2^bitWidth - 1]
            if (result > range.max) {
              result = range.max;
              saturated = true;
              // overflow NOT set in saturated mode - saturation prevents overflow
            }
            // Carry flag for unsigned addition
            if (originalResult > range.max) {
              carry = true;
            }
          } else { // SIGNED
            // Signed saturated: clamp to [-(2^(bitWidth-1)), 2^(bitWidth-1) - 1]
            if (result > range.max) {
              saturated = true;
              // overflow NOT set in saturated mode - saturation prevents overflow
              result = range.max;
            } else if (result < range.min) {
              saturated = true;
              // overflow NOT set in saturated mode - saturation prevents overflow
              result = range.min;
            }

            // Convert to unsigned representation for display
            if (result < 0) {
              result = maxVal + result;
            }
          }
        }
        break;

      case 'SUB':
        // For two's complement method, we convert subtraction to addition
        if (subtractionMethod === 'TWOS_COMPLEMENT') {
          // Convert numB to its two's complement and add
          const twosCompB = getTwosComplement(numB, bitWidth);
          const twosCompBValue = parseInt(twosCompB, 2);

          // Perform addition with two's complement
          originalResult = numA + twosCompBValue;
          result = originalResult;

          if (overflowMode === 'UNSATURATED') {
            // Carry flag: set when addition produces carry-out from MSB
            if (result >= maxVal) {
              carry = true;
            }

            // Overflow detection based on number format
            if (numberFormat === 'UNSIGNED') {
              // For unsigned subtraction: overflow when result < 0 (borrowing needed)
              // In two's complement addition, this manifests as no carry from MSB
              if (numA < numB) {
                overflow = true;
              }
            } else { // SIGNED
              // Signed: overflow when subtracting negative from positive yields negative,
              // or subtracting positive from negative yields positive
              // Use actual input values, not bit patterns
              const signA = numA < 0 ? 1 : 0;
              const signB = numB < 0 ? 1 : 0;
              const resultWrapped = result % maxVal;
              const signResult = resultWrapped >= Math.pow(2, bitWidth - 1) ? 1 : 0;

              // Overflow when signs of A and B differ and result sign matches B's sign
              // A - B: if A positive, B negative (subtracting negative = adding positive), result negative = overflow
              // A - B: if A negative, B positive (subtracting positive from negative), result positive = overflow
              if ((signA === 0 && signB === 1 && signResult === 1) ||
                (signA === 1 && signB === 0 && signResult === 0)) {
                overflow = true;
              }
            }

            // Wrap result to bit width
            result = result % maxVal;
          } else { // SATURATED
            if (numberFormat === 'UNSIGNED') {
              // Unsigned saturated: handle underflow
              if (numA < numB) {
                result = range.min; // Clamp to 0
                saturated = true;
                // overflow NOT set in saturated mode - saturation prevents overflow
              } else {
                result = result % maxVal;
              }
            } else { // SIGNED
              // Signed saturated: clamp to range
              // Convert result to signed for comparison
              const signedResult = result >= Math.pow(2, bitWidth - 1) ? result - maxVal : result % maxVal;

              if (signedResult > range.max) {
                result = range.max;
                saturated = true;
                // overflow NOT set in saturated mode - saturation prevents overflow
              } else if (signedResult < range.min) {
                result = range.min;
                saturated = true;
                // overflow NOT set in saturated mode - saturation prevents overflow
              } else {
                result = result % maxVal;
              }

              // Convert to unsigned representation for display
              if (result < 0) {
                result = maxVal + result;
              }
            }
          }
        } else {
          // DIRECT method
          originalResult = numA - numB;
          result = originalResult;

          if (overflowMode === 'UNSATURATED') {
            if (numberFormat === 'UNSIGNED') {
              // Unsigned: overflow when result < 0 (underflow/borrow)
              if (result < 0) {
                overflow = true;
                carry = true; // Borrow occurred
                result = maxVal + result; // Wrap around
              }
            } else { // SIGNED
              // Signed: overflow when result exceeds representable range
              if (result > range.max || result < range.min) {
                overflow = true;
              }

              // Wrap negative results to unsigned representation
              if (result < 0) {
                result = maxVal + result;
              } else {
                result = result % maxVal;
              }
            }
          } else { // SATURATED
            if (numberFormat === 'UNSIGNED') {
              // Unsigned saturated: clamp to [0, max]
              if (result < range.min) {
                result = range.min;
                saturated = true;
                // overflow NOT set in saturated mode - saturation prevents overflow
              }
            } else { // SIGNED
              // Signed saturated: clamp to [min, max]
              if (result > range.max) {
                result = range.max;
                saturated = true;
                // overflow NOT set in saturated mode - saturation prevents overflow
              } else if (result < range.min) {
                result = range.min;
                saturated = true;
                // overflow NOT set in saturated mode - saturation prevents overflow
              }

              // Convert to unsigned representation for display
              if (result < 0) {
                result = maxVal + result;
              }
            }
          }
        }
        break;

      case 'MUL':
        originalResult = numA * numB;
        result = originalResult;

        if (overflowMode === 'UNSATURATED') {
          result = result % maxVal;
          overflow = originalResult >= maxVal;
        } else { // SATURATED
          if (numberFormat === 'UNSIGNED') {
            if (result > range.max) {
              result = range.max;
              saturated = true;
              // overflow NOT set in saturated mode - saturation prevents overflow
            }
          } else { // SIGNED
            if (result > range.max) {
              result = range.max;
              saturated = true;
              // overflow NOT set in saturated mode - saturation prevents overflow
            } else if (result < range.min) {
              result = range.min;
              saturated = true;
              // overflow NOT set in saturated mode - saturation prevents overflow
            }
            if (result < 0) {
              result = maxVal + result;
            }
          }
        }
        break;

      case 'DIV':
        result = numB !== 0 ? Math.floor(numA / numB) : 0;
        originalResult = result;
        break;

      case 'AND':
        result = numA & numB;
        originalResult = result;
        break;

      case 'OR':
        result = numA | numB;
        originalResult = result;
        break;

      case 'XOR':
        result = numA ^ numB;
        originalResult = result;
        break;

      default:
        result = 0;
        originalResult = 0;
    }

    // Ensure result fits in bit width
    result = result % maxVal;

    return {
      result,
      originalResult: originalResult || result,
      zero: result === 0,
      negative: numberFormat === 'SIGNED' && result >= Math.pow(2, bitWidth - 1),
      overflow,
      carry,
      saturated
    };
  };

  const { result, originalResult, zero, negative, overflow, carry, saturated } = calculate();
  const binaryA = getBinary(numA, bitWidth);
  const binaryB = getBinary(numB, bitWidth);
  const binaryResult = getBinary(result, bitWidth);

  // Calculate carry bits for visualization
  const getOperandB = () => {
    if (operation === 'SUB' && subtractionMethod === 'TWOS_COMPLEMENT' && step >= 5) {
      return getTwosComplement(numB, bitWidth);
    }
    return binaryB;
  };

  const carryBits = (operation === 'ADD' || (operation === 'SUB' && subtractionMethod === 'TWOS_COMPLEMENT'))
    ? getCarryBits(binaryA, getOperandB())
    : [];

  // ============================================
  // FEATURE 5: STATE JSON FOR CHATBOT CONTEXT
  // ============================================
  const getCalculatorState = () => ({
    timestamp: new Date().toISOString(),
    inputs: {
      operation,
      numberA: numA,
      numberB: numB,
      bitWidth,
      numberFormat,
      overflowMode
    },
    display: {
      binaryA,
      binaryB,
      binaryResult
    },
    outputs: {
      result,
      decimalResult: numberFormat === 'SIGNED' && overflowMode === 'SATURATED' && negative
        ? result - Math.pow(2, bitWidth)
        : result,

      originalResult: originalResult !== result ? originalResult : undefined
    },
    flags: {
      zero,
      negative,
      overflow,
      carry,
      saturated
    },
    range,
    currentStep: step,
    stepDescription: getStepExplanation(),
    isAnimating
  });

  // Log state for debugging and chatbot integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const calculatorState = getCalculatorState();
      // Store in localStorage
      localStorage.setItem('calculatorState', JSON.stringify(calculatorState));
    }
  }, [operation, numA, numB, bitWidth, numberFormat, overflowMode, subtractionMethod, step, result, isAnimating]);

  const startAnimation = () => {
    setStep(0);
    setIsAnimating(true);
  };

  // Update nextStep to handle more steps for two's complement
  const getMaxSteps = () => {
    if (operation === 'SUB' && subtractionMethod === 'TWOS_COMPLEMENT') {
      return 8; // More steps for two's complement visualization
    }
    return 5; // Original number of steps
  };

  const nextStep = () => {
    const maxSteps = getMaxSteps();
    if (step < maxSteps) setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
    setIsAnimating(false);
  };

  useEffect(() => {
    reset();
  }, [operation, numA, numB, bitWidth, numberFormat, overflowMode, subtractionMethod]);

  // Get enabled operations for dropdown
  const enabledOperations = Object.entries(OPERATION_CONFIG)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({ key, ...config }));

  // ============================================
  // ENHANCED "WHAT'S HAPPENING" EXPLANATIONS
  // ============================================
  const getStepExplanation = () => {
    const modeDesc = numberFormat === 'UNSIGNED'
      ? `unsigned (0 to ${range.max})`
      : `signed two's complement (${range.min} to ${range.max})`;

    const overflowDesc = overflowMode === 'UNSATURATED'
      ? 'values wrap around on overflow'
      : 'values clamp to limits on overflow';

    const flagExplanation = saturated
      ? ` The result was clamped to ${result} because ${originalResult} exceeds the valid range.`
      : overflow && overflowMode === 'UNSATURATED'
        ? ` The result wrapped around because ${originalResult} exceeds ${range.max}.`
        : '';

    // Special handling for two's complement subtraction
    if (operation === 'SUB' && subtractionMethod === 'TWOS_COMPLEMENT') {
      const invertedB = getInvertedBits(numB, bitWidth);
      const twosCompB = getTwosComplement(numB, bitWidth);
      const twosCompBValue = parseInt(twosCompB, 2);

      switch (step) {
        case 0:
          return "Click 'Execute' to start the animation and see how the computer performs subtraction using the two's complement method.";
        case 1:
          return `The numbers ${numA} and ${numB} are loaded from memory into registers A and B, converted to ${bitWidth}-bit binary representation using ${modeDesc}.`;
        case 2:
          return `To subtract ${numB} from ${numA}, we first need to convert ${numB} into its two's complement form. This is how computers represent negative numbers in binary.`;
        case 3:
          return `Step 1 of two's complement: Invert all the bits of ${numB}. The binary ${binaryB} becomes ${invertedB}. Every 0 becomes 1, and every 1 becomes 0.`;
        case 4:
          return `Step 2 of two's complement: Add 1 to the inverted bits. ${invertedB} + 1 = ${twosCompB}. This completes the two's complement, which represents -${numB} in binary.`;
        case 5:
          return `Now we can perform addition instead of subtraction: ${numA} + (-${numB}). The binary addition is ${binaryA} + ${twosCompB}.`;
        case 6:
          const hasCarries = carryBits.some(c => c);
          return `The ALU adds each pair of bits starting from the rightmost position. When 1 + 1 occurs, we write 0 and carry 1 to the next position—just like carrying in decimal addition.${hasCarries ? ' Notice the red carry bits (1) above positions where carries are generated.' : ''} Watch the carry propagate from right to left.`;
        case 7:
          return `The addition is complete. ${carry ? 'A carry was produced beyond the leftmost bit, which is discarded in two\'s complement arithmetic.' : 'No carry beyond the leftmost bit.'} The final result is ${binaryResult} = ${result}₁₀.`;
        case 8:
          return `Operation complete! ${numA} - ${numB} = ${result}.${flagExplanation} Status flags: ${zero ? '✓ Zero (result is 0), ' : ''
            }${negative ? '✓ Negative (MSB is 1 in signed mode), ' : ''
            }${overflow ? '✓ Overflow (result exceeded range), ' : ''
            }${carry ? '✓ Carry (produced beyond MSB), ' : ''
            }${saturated ? '✓ Saturated (result clamped to valid range)' : ''
            }`.replace(/, $/, '.');
        default:
          return '';
      }
    }

    // Original explanations for addition and other operations
    switch (step) {
      case 0:
        return "Click 'Execute' to start the animation and see how the computer performs arithmetic step by step.";
      case 1:
        return `The numbers ${numA} and ${numB} are loaded from memory into registers A and B, converted to ${bitWidth}-bit binary representation using ${modeDesc}.`;
      case 2:
        return `The ALU receives the operands and begins processing them bit by bit from right to left. Notice the yellow ring highlighting the least significant bit (LSB) where processing begins.`;
      case 3:
        if (operation === 'ADD') {
          const hasCarries = carryBits.some(c => c);
          return `The ALU adds each pair of bits starting from the rightmost position. When the sum of two bits becomes 2 (that is, 1 + 1), we write 0 in that column and carry 1 to the next bit position on the left—just like carrying over in decimal addition.${hasCarries ? ' Watch the red carry bits (1) appear above the positions where carries occur.' : ''}`;
        }
        return `The ALU performs the ${OPERATION_CONFIG[operation as keyof typeof OPERATION_CONFIG].description} operation. ${['AND', 'OR', 'XOR'].includes(operation)
          ? 'Each bit position is processed independently using boolean logic.'
          : 'The mathematical operation is computed.'
          }`;
      case 4:
        return `The result is computed and stored in the result register. The binary representation shows the final value stored in ${bitWidth} bits.${flagExplanation}`;
      case 5:
        return `Operation complete! The ${OPERATION_CONFIG[operation as keyof typeof OPERATION_CONFIG].description.toLowerCase()} of ${numA} and ${numB} equals ${result}.${flagExplanation} Status flags indicate: ${zero ? '✓ Zero (result is 0), ' : ''
          }${negative ? '✓ Negative (MSB is 1 in signed mode), ' : ''
          }${overflow ? '✓ Overflow (result exceeded range), ' : ''
          }${carry ? '✓ Carry (addition produced carry-out), ' : ''
          }${saturated ? '✓ Saturated (result was clamped to valid range)' : ''
          }`.replace(/, $/, '.');
      default:
        return '';
    }
  };

  return (

    <LayoutWrapper>
      <div className="flex h-full w-full bg-gradient-to-bl from-[#f3f3f3] to-[#7b93b8] relative">
        {/* Main content area */}
        <main className="flex-1 flex flex-col min-w-0 transition-all duration-200">
          <div className="flex-1 overflow-auto bg-gradient-to-bl from-[#f3f3f3] to-[#7b93b8] ">
            {/* Arithmetic module */}
            <div className="flex flex-col transition-all duration-300 py-1.5 px-6 gap-2.5">

              {/* SYSTEM SETTINGS - TOP BAR */}
              <div className="bg-blue-50 backdrop-blur rounded-lg border border-blue-500/30 px-4 py-2">
                <div className="flex items-center justify-between gap-6 flex-wrap">
                  {/* System Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-[#36517d] font-semibold mb-1">Numbers</label>
                      <select
                        value={numberFormat}
                        onChange={(e) => setNumberFormat(e.target.value as NumberFormat)}
                        className="bg-[#36507D] border border-blue-500/50 rounded px-3 py-1.5 text-white text-sm"
                      >
                        <option value="UNSIGNED">Unsigned</option>
                        <option value="SIGNED">Signed</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-[#36517d] font-semibold mb-1">Overflow</label>
                      <select
                        value={overflowMode}
                        onChange={(e) => setOverflowMode(e.target.value as OverflowMode)}
                        className="bg-[#36507D] border border-blue-500/50 rounded px-3 py-1.5 text-white text-sm"
                      >
                        <option value="UNSATURATED">Unsaturated</option>
                        <option value="SATURATED">Saturated</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-[#36517d] font-semibold mb-1">Bit Width</label>
                      <select
                        value={bitWidth}
                        onChange={(e) => setBitWidth(parseInt(e.target.value))}
                        className="bg-[#36507D] border border-blue-500/50 rounded px-3 py-1.5 text-white text-sm"
                      >
                        <option value={4}>4-bit</option>
                        <option value={8}>8-bit</option>
                        <option value={16}>16-bit</option>
                        <option value={32}>32-bit</option>
                      </select>
                    </div>
                  </div>

                  {/* Current Range Display */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#36517d]">Range:</span>
                    <span className="px-3 py-1.5 bg-red-100 border border-red-300 rounded font-mono text-red-700 text-sm">
                      {range.min}
                    </span>
                    <span className="text-xs text-[#36517d]">to</span>
                    <span className="px-3 py-1.5 bg-green-100 border border-green-300 rounded font-mono text-green-700 text-sm">
                      {range.max}
                    </span>
                    <span className="text-xs text-slate-600">
                      ({bitWidth}-bit {numberFormat === 'SIGNED' ? 'signed' : 'unsigned'} {overflowMode.toLowerCase()})
                    </span>
                  </div>
                </div>
              </div>

              {/* BINARY REPRESENTATION - Main center area */}
              <div className="flex-1 bg-gray-50  backdrop-blur rounded-lg border border-blue-500/30 py-1.5 px-8 flex flex-col justify-center">
                <div className="max-w-4xl mx-auto w-full space-y-8">
                  {/* Register A */}
                  <div className={`transition-all duration-500 mb-2 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="text-sm text-blue-300 font-semibold">Register A = {numA}</div>

                    {/* Carry bits visualization - only show during addition step */}
                    {(operation === 'ADD' && step >= 3) || (operation === 'SUB' && subtractionMethod === 'TWOS_COMPLEMENT' && step >= 6) ? (
                      <>
                        {carryBits.some(c => c) && (
                          <div className="text-xs text-red-400 font-semibold text-center mb-1">
                            Carry bits ↓
                          </div>
                        )}
                        <div className="flex gap-1 font-mono justify-center flex-wrap mb-1">
                          {carryBits.map((hasCarry, i) => (
                            <div
                              key={i}
                              className={`${bitWidth <= 8
                                ? 'w-12 h-6 text-sm'
                                : bitWidth <= 16
                                  ? 'w-8 h-5 text-xs'
                                  : 'w-4 h-4 text-[10px]'
                                } flex items-center justify-center font-bold transition-all ${hasCarry
                                  ? 'text-red-500 animate-pulse'
                                  : 'text-transparent'
                                }`}
                            >
                              {hasCarry ? '1' : '0'}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="h-6"></div>
                    )}

                    <div className="flex gap-1 font-mono justify-center flex-wrap">
                      {binaryA.split('').map((bit, i) => (
                        <div
                          key={i}
                          className={`${bitWidth <= 8
                            ? 'w-12 h-8 text-lg'
                            : bitWidth <= 16
                              ? 'w-8 h-6 text-base'
                              : 'w-4 h-3 text-sm'
                            } flex items-center justify-center rounded-lg font-bold transition-all ${bit === '1'
                              ? 'bg-green-500 text-black shadow-lg shadow-green-500/50'
                              : 'bg-slate-300'
                            } ${step >= 2 && i === binaryA.length - 1 ? 'ring-4 ring-yellow-400' : ''}`}
                        >
                          {bit}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ALU Operation Symbol */}
                  <div className={`text-center transition-all duration-500 mb-2 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                    <div
                      className={`inline-flex items-center justify-center px-4 py-0 rounded-lg text-3xl font-bold transition-all text-black ${step >= 3
                        ? 'bg-yellow-400/20 border-2 border-yellow-400 shadow-lg shadow-yellow-400/30'
                        : 'bg-slate-200/50 border-2 border-slate-400'
                        }`}
                    >
                      {OPERATION_CONFIG[operation as keyof typeof OPERATION_CONFIG]?.symbol || operation}
                    </div>
                  </div>

                  {/* Register B */}
                  <div className={`transition-all duration-500 mb-2 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="text-sm text-blue-300 font-semibold">Register B = {numB}</div>
                    <div className="flex gap-1 font-mono text-xl justify-center">
                      {binaryB.split('').map((bit, i) => (
                        <div
                          key={i}
                          className={`${bitWidth <= 8
                            ? 'w-12 h-8 text-lg'
                            : bitWidth <= 16
                              ? 'w-8 h-6 text-base'
                              : 'w-4 h-3 text-sm'
                            } flex items-center justify-center rounded-lg font-bold transition-all ${bit === '1'
                              ? 'bg-green-500 text-black shadow-lg shadow-green-500/50'
                              : 'bg-slate-300'
                            } ${step >= 2 && i === binaryA.length - 1 ? 'ring-4 ring-yellow-400' : ''}`}
                        >
                          {bit}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TWO'S COMPLEMENT INTERMEDIATE STEPS */}
                  {operation === 'SUB' && subtractionMethod === 'TWOS_COMPLEMENT' && step >= 3 && (
                    <>
                      {/* Step 3: Show Inverted Bits */}
                      {step >= 3 && (
                        <div className={`transition-all duration-500 mb-2 ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
                          <div className="text-sm text-purple-400 font-semibold flex items-center gap-2 justify-center">
                            <span>Inverted B (Step 1 of Two's Complement)</span>
                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-400">
                              Invert all bits
                            </span>
                          </div>
                          <div className="flex gap-1 font-mono text-xl justify-center">
                            {getInvertedBits(numB, bitWidth).split('').map((bit, i) => (
                              <div
                                key={i}
                                className={`${bitWidth <= 8
                                  ? 'w-12 h-8 text-lg'
                                  : bitWidth <= 16
                                    ? 'w-8 h-6 text-base'
                                    : 'w-4 h-3 text-sm'
                                  } flex items-center justify-center rounded-lg font-bold transition-all ${bit === '1'
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                                    : 'bg-purple-200'
                                  }`}
                              >
                                {bit}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 4: Show Two's Complement (Inverted + 1) */}
                      {step >= 4 && (
                        <div className={`transition-all duration-500 mb-2 ${step >= 4 ? 'opacity-100' : 'opacity-50'}`}>
                          <div className="text-sm text-orange-400 font-semibold flex items-center gap-2 justify-center">
                            <span>Two's Complement of B = -{numB}</span>
                            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-400">
                              Add 1
                            </span>
                          </div>
                          <div className="flex gap-1 font-mono text-xl justify-center">
                            {getTwosComplement(numB, bitWidth).split('').map((bit, i) => (
                              <div
                                key={i}
                                className={`${bitWidth <= 8
                                  ? 'w-12 h-8 text-lg'
                                  : bitWidth <= 16
                                    ? 'w-8 h-6 text-base'
                                    : 'w-4 h-3 text-sm'
                                  } flex items-center justify-center rounded-lg font-bold transition-all ${bit === '1'
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                                    : 'bg-orange-200'
                                  }`}
                              >
                                {bit}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 5-6: Show operation symbol changing to addition */}
                      {step >= 5 && (
                        <div className="text-center transition-all duration-500 mb-2">
                          <div className="text-sm text-blue-300 font-semibold mb-2">
                            Now performing addition: {numA} + (-{numB})
                          </div>
                          <div
                            className="inline-flex items-center justify-center px-4 py-0 rounded-lg text-3xl font-bold bg-yellow-400/20 border-2 border-yellow-400 shadow-lg shadow-yellow-400/30 text-black"
                          >
                            +
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Divider */}
                  <div className={`border-t-4 border-blue-500 transition-all duration-500 mb-1 mt-1 ${operation === 'SUB' && subtractionMethod === 'TWOS_COMPLEMENT'
                    ? step >= 6 ? 'opacity-100 shadow-lg shadow-blue-500/30' : 'opacity-50'
                    : step >= 3 ? 'opacity-100 shadow-lg shadow-blue-500/30' : 'opacity-50'
                    }`}></div>

                  {/* Result */}
                  <div className={`transition-all duration-500 mb-0 ${operation === 'SUB' && subtractionMethod === 'TWOS_COMPLEMENT'
                    ? step >= 7 ? 'opacity-100' : 'opacity-50'
                    : step >= 4 ? 'opacity-100' : 'opacity-50'
                    }`}>
                    <div className="text-sm text-green-300 font-semibold flex items-center gap-2 justify-center">
                      <span>Result = {result}</span>
                      {saturated && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded border border-yellow-500">
                          SATURATED
                        </span>
                      )}
                      {numberFormat === 'SIGNED' && negative && (
                        <span className="text-xs text-red-400">
                          (signed: {result - Math.pow(2, bitWidth)})
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 font-mono text-xl justify-center">
                      {binaryResult.split('').map((bit, i) => (
                        <div
                          key={i}
                          className={`${bitWidth <= 8
                            ? 'w-12 h-8 text-lg'
                            : bitWidth <= 16
                              ? 'w-8 h-6 text-base'
                              : 'w-4 h-3 text-sm'
                            } flex items-center justify-center rounded-lg font-bold transition-all ${bit === '1'
                              ? 'bg-green-500 text-black shadow-lg shadow-green-500/50'
                              : 'bg-slate-300'
                            } ${step >= 2 && i === binaryA.length - 1 ? 'ring-4 ring-yellow-400' : ''}`}
                        >
                          {bit}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isAnimating && step < getMaxSteps() && (
                    <div className="text-center">
                      <button
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-1.5 mt-1 rounded-lg flex items-center justify-center gap-2 mx-auto text-md text-white"
                      >
                        Next Step →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* FLAGS SECTION */}
              <div className="bg-gray-50  backdrop-blur rounded-lg border border-blue-500/30 py-1.5 px-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-blue-300">Status Flags:</span>
                  <div className="flex gap-3 flex-1 flex-wrap">
                    <div className={`px-4 py-1.5.5 rounded text-sm font-medium transition-all ${zero ? 'bg-green-500 text-black shadow-lg shadow-green-500/50' : 'bg-slate-300/50 text-slate-400'
                      }`} title="Result equals zero">
                      Zero: {zero ? '1' : '0'}
                    </div>

                    <div className={`px-2 py-1.5.5 rounded text-sm font-medium transition-all ${negative ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : 'bg-slate-300/50 text-slate-400'
                      }`} title="Most significant bit is 1 (negative in signed mode)">
                      Negative: {negative ? '1' : '0'}
                    </div>

                    <div className={`px-2 py-1.5.5 rounded text-sm font-medium transition-all ${overflow ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50' : 'bg-slate-300/50 text-slate-400'
                      }`} title="Result exceeded representable range">
                      Overflow: {overflow ? '1' : '0'}
                    </div>

                    <div className={`px-2 py-1.5.5 rounded text-sm font-medium transition-all ${carry ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' : 'bg-slate-300/50 text-slate-400'
                      }`} title="Carry out from most significant bit">
                      Carry: {carry ? '1' : '0'}
                    </div>

                    {saturated && (
                      <div className="px-2 py-1.5.5 rounded text-sm font-medium bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                        title="Result was clamped to valid range">
                        Saturated: 1
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* WHAT'S HAPPENING - ENHANCED */}
              <div
                className="relative bg-gradient-to-r from-[#36517d]/10 via-blue-100 to-slate-200 border border-[#36517d]/40 px-6 py-1.5 rounded-lg shadow-md transition-all duration-500"
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2 text-[#36517d]">
                    What's Happening?
                  </h3>
                  <p className="text-black leading-relaxed">
                    {getStepExplanation()}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="flex-none relative bottom-[10px]">

            {/* OPERATION CONTROLS - BOTTOM BAR */}
            <div className="bg-gray-50  backdrop-blur rounded-lg border border-blue-500/30 px-4 py-1.5">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex flex-col">
                  <label className="text-xs text-blue-300 mb-1">Operation</label>
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="bg-[#36507D] border border-blue-500/50 rounded px-2 py-1.5 text-white text-sm"
                  >
                    {enabledOperations.map(op => (
                      <option key={op.key} value={op.key}>{op.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-blue-300 mb-1">Number A</label>
                  <input
                    type="number"
                    value={numA}
                    onChange={(e) => setNumA(parseInt(e.target.value) || 0)}
                    className="bg-[#36507D] border border-blue-500/50 rounded px-2 py-1.5 text-white w-20 text-sm"
                    max={range.max}
                    min={range.min}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-blue-300 mb-1">Number B</label>
                  <input
                    type="number"
                    value={numB}
                    onChange={(e) => setNumB(parseInt(e.target.value) || 0)}
                    className="bg-[#36507D] border border-blue-500/50 rounded px-2 py-1.5 text-white w-20 text-sm"
                    max={range.max}
                    min={range.min}
                  />
                </div>

                {/* Subtraction Method Selector - Only show for SUB operation */}
                {operation === 'SUB' && (
                  <div className="flex flex-col">
                    <label className="text-xs text-blue-300 mb-1">Method</label>
                    <select
                      value={subtractionMethod}
                      onChange={(e) => setSubtractionMethod(e.target.value as 'DIRECT' | 'TWOS_COMPLEMENT')}
                      className="bg-[#36507D] border border-blue-500/50 rounded px-2 py-1.5 text-white text-sm"
                      title="Choose how subtraction is performed"
                    >
                      <option value="TWOS_COMPLEMENT">Two's Complement</option>
                      <option value="DIRECT">Direct</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-2 ml-auto  self-end text-white">
                  <button
                    onClick={startAnimation}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded flex items-center gap-2"
                  >
                    ▶ Execute
                  </button>
                  <button
                    onClick={reset}
                    className="bg-slate-600 hover:bg-[#36507D] px-2 py-1.5 rounded"
                  >
                    ⟲
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>



      </div>
    </LayoutWrapper>

  );
}