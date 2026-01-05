import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Question, QuestionType, BaseAnswerBoxProps, answerType } from "@/utils/quiz";
import { MultipuleChoice } from './MultipuleChoice';
import { ShortAnswer } from './ShortAnswer';

type QuizBoxProps = BaseAnswerBoxProps & {
    answers: answerType[];
    questions: Question[];
    selectedQuestionIndex: number;
};

export function QuestionBox({questions, selectedQuestionIndex, answers, onAnswerSelected}: QuizBoxProps) {
    const question: Question = questions[selectedQuestionIndex]

    function GetBGHighlightColour(selectedQuestionIndex: number, item: string) {
        if (item == answers[selectedQuestionIndex]) {
            return "bg-[#36517D]"
        }
        return "bg-[#EEEEEE] hover:bg-[#b6c8e3]"
    }

    function GetTextHighlightColour(selectedQuestionIndex: number, item: string) {
        if (item == answers[selectedQuestionIndex]) {
            return "text-[#FFFFFF]"
        }
        return "text-[#000000]"
    }

    function GetTextBoxHighlightColour(selectedQuestionIndex: number, isEditing: boolean) {
        if (isEditing) {
            return "bg-[#b6c8e3]"
        }
        return "bg-[#EEEEEE] hover:bg-[#b6c8e3]"
    }

    function createAnswerBox() {
        switch (question.type_data.type) {
            case QuestionType.MultipuleChoice:
                return (
                    <MultipuleChoice 
                        data={question.type_data}
                        selectedQuestionIndex={selectedQuestionIndex}
                        onAnswerSelected={onAnswerSelected}
                        GetBGHighlightColour={GetBGHighlightColour}
                        GetTextHighlightColour={GetTextHighlightColour}
                    />
                )
            default:
                return (
                    <ShortAnswer 
                        data={question.type_data}
                        selectedQuestionIndex={selectedQuestionIndex}
                        inputText={answers[selectedQuestionIndex]}
                        onAnswerSelected={onAnswerSelected}
                        GetTextBoxHighlightColour={GetTextBoxHighlightColour}
                    />
                )
        }
    }

    return (
        <div className="bg-[#000DFF]/2 shadow-lg dark:shadow-xl rounded-lg overflow-auto flex flex-col h-full items-left justify-left">
            <h2 className="text-[#000000] text-lg font-medium mt-18 ml-12 mr-17">
                Question {selectedQuestionIndex+1} of {questions.length}
            </h2>
            <p className="text-[#000000] mt-12 ml-12 mr-17">
                {question.description}
            </p>
            <div className="mt-8 ml-12 mr-17 mb-14 h-full">
                {createAnswerBox()}
            </div>
        </div>
    );
}