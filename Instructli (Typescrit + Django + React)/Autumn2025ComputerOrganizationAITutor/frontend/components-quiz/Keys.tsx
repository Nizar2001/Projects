import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export type KeysProps = {
    flags: boolean[],
    selectedQuestionIndex: number;
    onQuestionSelected: Dispatch<SetStateAction<number>>,
    onFlagSet: (questionIndex: number, newFlag: boolean) => void
    onFinish: () => void
};

export function Keys({flags, selectedQuestionIndex, onQuestionSelected, onFlagSet, onFinish}: KeysProps) {
    return (
        <div className="flex flex-row gap-2 items-center justify-center">
            <button
            onClick={() => selectedQuestionIndex > 0 && onQuestionSelected(selectedQuestionIndex - 1)}
            className={`grid place-items-center shadow-lg dark:shadow-xl aspect-[19/7] w-[100%] ${selectedQuestionIndex <= 0 ? "bg-[#D9D9D9]": "bg-[#EEEEEE] hover:bg-[#b6c8e3] transition cursor-pointer"}`}>
                <p className={`${selectedQuestionIndex <= 0 ? "text-[#EEEEEE]/50": "text-[#000000]"}`}>
                    ← Back
                </p>
            </button>
            <button
            onClick={() => onFlagSet(selectedQuestionIndex, !flags[selectedQuestionIndex])}
            className={`grid place-items-center shadow-lg dark:shadow-xl aspect-[19/7] w-[100%] ${flags[selectedQuestionIndex] ? "bg-[#36517D] hover:bg-[#b6c8e3] transition cursor-pointer": "bg-[#EEEEEE] hover:bg-[#b6c8e3] transition cursor-pointer"}`}>
                <p className={`${flags[selectedQuestionIndex] ? "text-[#FFFFFF]": "text-[#000000]"}`}>
                    {flags[selectedQuestionIndex] && "⚑ UnFlag" || "⚐ Flag"}
                </p>
            </button>
            <button
            onClick={() => selectedQuestionIndex < flags.length - 1 ? onQuestionSelected(selectedQuestionIndex + 1) : onFinish()}
            className={`grid place-items-center shadow-lg dark:shadow-xl aspect-[19/7] w-[100%] bg-[#EEEEEE] hover:bg-[#b6c8e3] w=25 h=10 transition cursor-pointer`}>
                <p className={`text-[#000000]`}>
                    {selectedQuestionIndex < flags.length - 1 && "Next →" || "Finish ✓"}
                </p>
            </button>
        </div>
    );
}