import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { BaseAnswerProps, StateColours } from "@/utils/quiz";
import { QuestionSelection } from './QuestionSelection';
import { LegendLabel } from '../components-quiz/LegendLabel';

type SelectionBoxProps = BaseAnswerProps & {
    flags: boolean[],
    onQuestionSelected: Dispatch<SetStateAction<number>>,
}

export function SelectionBox({answers, selectedQuestionIndex, flags, onQuestionSelected}: SelectionBoxProps) {
    return (
        <div className="bg-[#000DFF]/2 shadow-lg dark:shadow-xl rounded-lg w-full flex flex-col h-full">
            <h2 className="text-[#000000] text-lg font-medium mt-18 ml-7 mr-7">
                Questions
            </h2>
            <div className="ml-7 mr-7 mt-12 items-center justify-left">
                <QuestionSelection 
                    answers={answers}
                    selectedQuestionIndex={selectedQuestionIndex}
                    flags={flags}
                    onQuestionSelected={onQuestionSelected}
                />
            </div>
            <div className="bg-[#000000]/21 h-[2px] ml-7 mr-7 mt-12"/>
            <div className="ml-7 mr-7 mt-12 mb-5 flex flex-col gap-4 text-[#000000]">
                <LegendLabel stateColour={StateColours.Selected} label="Current Question" />
                <LegendLabel stateColour={StateColours.Answered} label="Answered Question" />
                <LegendLabel stateColour={StateColours.Flagged} label="Flagged Question" />
            </div>
        </div>
    );
}