"use client";

import Image from "next/image";
import { Question, answerType, Quiz, QuizResult, QuestionType } from "@/utils/quiz";
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { MultipuleChoice } from '../../../../components-quiz/MultipuleChoice';
import { ShortAnswer } from '../../../../components-quiz/ShortAnswer';
import Chatbot from "../../../../components/ChatBot";

type QuizResultsProps = {
    results: QuizResult;
    setSelectedQuiz: (id: number | null) => void;
    setResults: (results: QuizResult| null) => void;
};

export function QuizResults({results, setResults, setSelectedQuiz}: QuizResultsProps) {

    const MIN_CHATBOT_WIDTH = 540;  // Minimum width in pixels
    const MIN_CONTENT_WIDTH = 500;  // Minimum width for main content area (diagrams need more space)
    const [chatbotWidth, setChatbotWidth] = useState(MIN_CHATBOT_WIDTH); // Default width
    const getMaxChatbotWidth = () => Math.max(MIN_CHATBOT_WIDTH, window.innerWidth - MIN_CONTENT_WIDTH);
    const [isDragging, setIsDragging] = useState(false);
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const diagramString = results.quiz.questions.map((question, index) => ({
        number: index + 1,
        description: question.description,
        givenAnswer: results.result[index],
        correctAnswer: question.answer,
    }));
    localStorage.setItem("quizResult", JSON.stringify(diagramString));
    console.log(JSON.parse(localStorage.getItem("quizResult") || 'null'));
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

    const normalizeString = (inputString: answerType) => {
        if (!inputString) {
            return "";
        }

        return inputString.toLowerCase().replace(/\s+/g, "").replace(/[.,\/#!$%\^&\*;:{}=\_`~()?'"<>|\\-]/g, "");
    };

    function IsResultCorrect(index: number) {
        if (results.quiz.questions.length <= index || results.result.length <= index) {
            return false;
        }
        return normalizeString(results.quiz.questions[index].answer) == normalizeString(results.result[index]);
    }

    function GetCorrectnessPercent() {
        const sum = results.quiz.questions.reduce((accumulator, question, index) => {
            return accumulator + (IsResultCorrect(index) ? 1 : 0);
        }, 0);

        return Math.ceil((sum / results.quiz.questions.length) * 100);
    }

    function GetChatBotQuip() {
        const perc = GetCorrectnessPercent();
        if (perc >= 50) {
            return "Not bad! Evaluate your answers using the chat bot here →"
        }
        if (perc >= 100) {
            return "Great Job! If you have any further questions you can ask the chat bot here →"
        }
        return "Better luck next time. Evaluate your answers using the chat bot here →"
    }

    function GetBGHighlightColour(selectedQuestionIndex: number, item: string) {
        const isAnswer = normalizeString(item) == normalizeString(results.quiz.questions[selectedQuestionIndex].answer)
        const isResult = normalizeString(item) == normalizeString(results.result[selectedQuestionIndex]);
        if (isAnswer && isResult) {
            return "bg-[#36517D]"
        }
        if (isAnswer) {
            return "bg-green-100"
        }
        if (isResult) {
            return "bg-red-100"
        }
        return "bg-[#EEEEEE]"
    }

    function GetTextHighlightColour(selectedQuestionIndex: number, item: string) {
        const isAnswer = normalizeString(item) == normalizeString(results.quiz.questions[selectedQuestionIndex].answer)
        const isResult = normalizeString(item) == normalizeString(results.result[selectedQuestionIndex]);
        if (isAnswer && isResult) {
            return "text-[#FFFFFF]"
        }
        if (isAnswer) {
            return "text-green-700"
        }
        if (isResult) {
            return "text-red-600"
        }
        return "text-[#000000]"
    }

    function GetTextBoxHighlightColour(selectedQuestionIndex: number, isEditing: boolean) {
        return "bg-[#EEEEEE]"
    }

    function GetIncorrectTextBoxHighlightColour(selectedQuestionIndex: number, isEditing: boolean) {
        return "bg-red-100 text-red-600"
    }

    function GetCorrectTextBoxHighlightColour(selectedQuestionIndex: number, isEditing: boolean) {
        return "bg-green-100 text-green-700"
    }

    function createAnswerBox(index: number) {
        const question: Question = results.quiz.questions[index]

        switch (question.type_data.type) {
            case QuestionType.MultipuleChoice:
                return (
                    <MultipuleChoice 
                        data={question.type_data}
                        selectedQuestionIndex={index}
                        GetBGHighlightColour={GetBGHighlightColour}
                        GetTextHighlightColour={GetTextHighlightColour}
                    />
                )
            default:
                if (!IsResultCorrect(index)) {
                    return (
                    <div>
                        <ShortAnswer 
                            data={question.type_data}
                            selectedQuestionIndex={index}
                            inputText={results.result[index]}
                            GetTextBoxHighlightColour={GetIncorrectTextBoxHighlightColour}
                        />
                        <ShortAnswer 
                            data={question.type_data}
                            selectedQuestionIndex={index}
                            inputText={question.answer}
                            GetTextBoxHighlightColour={GetCorrectTextBoxHighlightColour}
                        />
                    </div>
                    )
                }
                return (
                    <ShortAnswer 
                        data={question.type_data}
                        selectedQuestionIndex={index}
                        inputText={results.result[index]}
                        GetTextBoxHighlightColour={GetTextBoxHighlightColour}
                    />
                )
        }
    }

    function RetakeQuiz() {
        setSelectedQuiz(results.quiz.id);
        setResults(null);
    }

    return (
        <div className="flex h-full w-full bg-white">
            <main className="h-full bg-gray-50 px-6 py-8 overflow-auto" style={{ width: `calc(100% - ${chatbotWidth}px)` }}>
                <div className="flex flex-col self-start inline-flex">
                    {/* Back to Home */}
                    <button
                        onClick={() => setResults(null)}
                        className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition cursor-pointer"
                    >
                        ← Back to home
                    </button>

                    {/* Right-Side Buttons */}
                    <button
                        onClick={() => RetakeQuiz()}
                        className="bg-black text-white px-5 py-2 mt-4 rounded hover:bg-gray-800 transition cursor-pointer"
                        >
                        ⟳ Retake Quiz
                    </button>
                </div>


                {/* Title */}
                <div className="text-center mt-8">
                    <h1 className="text-3xl font-semibold text-black">{results.quiz.title} – Results</h1>
                    <p className="mt-4 text-gray-600">Your score is:</p>

                    {/* Score Box */}
                    <div className="mx-auto mt-4 bg-white shadow-md w-48 h-32 rounded-xl flex items-center justify-center">
                        <span className="text-5xl font-bold text-black">{GetCorrectnessPercent()}%</span>
                    </div>

                    <p className="mt-4 text-gray-500">
                        {GetChatBotQuip()}
                    </p>
                </div>
                
                {/* Answer Box */}
                <div className="mt-10 space-y-10 max-w-2xl mx-auto">
                    {results.quiz.questions.map((question, index) => {
                        const isCorrect = IsResultCorrect(index);

                        return (
                            <div key={index} className="bg-white shadow p-6 rounded-xl">
                                
                                {/* Correct / Incorrect Tag */}
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                                    ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                    {isCorrect ? "✔ Correct" : "✖ Incorrect"}
                                </span>

                                {/* Question title */}
                                <h2 className="mt-4 font-semibold text-black">
                                    Question {index + 1} of {results.quiz.questions.length}
                                </h2>

                                {/* Question text */}
                                <p className="mt-2 text-gray-700">
                                    {question.description}
                                </p>

                                {/* Answer choices */}
                                <div className="mt-4 space-y-3">
                                    {createAnswerBox(index)}
                                </div>
                            </div>
                        );
                    })}

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
