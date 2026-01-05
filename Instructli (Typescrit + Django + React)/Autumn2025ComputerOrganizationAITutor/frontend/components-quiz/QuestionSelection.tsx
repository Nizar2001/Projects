import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { BaseAnswerProps, StateColours } from "@/utils/quiz";

type QuizSelectionProps = BaseAnswerProps & {
    flags: boolean[],
    onQuestionSelected: Dispatch<SetStateAction<number>>,
}

export function QuestionSelection({answers, selectedQuestionIndex, flags, onQuestionSelected}: QuizSelectionProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    function getQuestionColour(index: number) {
        if (index == selectedQuestionIndex) {
            return StateColours.Selected
        }
        else if (flags[index]) {
            return StateColours.Flagged
        }
        else if (typeof answers[index] == "string") {
            return StateColours.Answered
        }
        return StateColours.Unanswered
    }

    return (
        <div className="flex flex-row flex-wrap gap-5">
            {answers.map((item, index) => (
                <button 
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onQuestionSelected(index)}
                className={`shadow-lg dark:shadow-xl rounded-lg items-start w-15 h-15 transition cursor-pointer`} style={{ backgroundColor: `#${getQuestionColour(index)}`, opacity: hoveredIndex == index && index != selectedQuestionIndex && 0.75 || 1.0 }}>
                    <p className={`${index == selectedQuestionIndex ? "text-[#FFFFFF]": "text-[#000000]"}`}>
                        Q{index+1}
                    </p>
                </button>
            ))}
        </div>
    );
}