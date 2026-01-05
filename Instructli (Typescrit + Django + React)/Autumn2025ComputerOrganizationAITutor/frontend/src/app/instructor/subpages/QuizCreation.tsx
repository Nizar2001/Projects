"use client";

import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Question, answerType, Quiz, Difficulty, QuestionType } from "@/utils/quiz";

type QuizCreationProps = {
    quizzes: Quiz[],
    setQuizzes: Dispatch<SetStateAction<Quiz[]>>;
    setEditQuiz: Dispatch<SetStateAction<number | null>>;
    selectedQuiz: number;
};

export function QuizCreation({quizzes, selectedQuiz, setQuizzes, setEditQuiz}: QuizCreationProps) {
    const [selectedQuestion, setEditQuestion] = useState<number>(0);

    // Clone the quiz and only update the og upon pressing SAVE
    const [localQuiz, setLocalQuiz] = useState<Quiz>(structuredClone(quizzes[selectedQuiz]));

    const saveQuiz = () => {
        setQuizzes( 
            quizzes.map((quiz, i) => i === selectedQuiz ? localQuiz : quiz)
        );
    }

    const setQuestions = (newQuestions: Question[]) => {
        setLocalQuiz((prev) => ({
            ...prev,
            questions: newQuestions,
        }));
    };

    const addQuestion = () => {
        setQuestions([
        ...localQuiz.questions,
        {
            description: "",
            difficulty: Difficulty.Easy,
            tags: [],
            answer: "",
            type_data: {
                type: QuestionType.MultipuleChoice,
                choices: [],
            },
        },
        ]);
    };

    const deleteQuestion = (index: number) => {
        setQuestions(localQuiz.questions.filter((question, questionIndex) => index !== questionIndex));
        if (selectedQuestion > 1) {
            setEditQuestion(selectedQuestion - 1);
        }
    };

    const setQuestion = (index: number, newQuestion: Question) => {
        setQuestions(
            localQuiz.questions.map((question, i)  => i === index ? newQuestion : question)
        );
    }

    const updateQuestionType = (index: number, newType: QuestionType) => {
        const oldQuestion = localQuiz.questions[selectedQuestion]

        if (oldQuestion.type_data.type == newType) {
            return;
        }

        switch (newType) {
            case QuestionType.ShortAnswer:
                setQuestion(selectedQuestion, {...oldQuestion, type_data: {type: QuestionType.ShortAnswer}});
                break;
            case QuestionType.MultipuleChoice:
                setQuestion(selectedQuestion, {...oldQuestion, type_data: {type: QuestionType.MultipuleChoice, choices: []}});
                break;
        }
    };

    if (localQuiz.questions.length <= 0) {
        addQuestion()
    }

    if (localQuiz.questions.length > 0 && localQuiz.questions.length <= selectedQuestion) {
        setEditQuestion(localQuiz.questions.length-1)
    }

    if (!localQuiz || localQuiz.questions.length === 0 || localQuiz.questions.length <= selectedQuestion) {
        return (
            <main>
            </main>
        );
    }

    return (
        <main className="h-screen flex bg-gray-50 text-gray-800 overflow-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
            <div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                Quiz Questions
                </h2>
                <button
                    onClick={() => setEditQuiz(null)}
                    className="flex items-center gap-2 text-sm font-medium text-bg-[#36517D] hover:text-bg-[#b6c8e3] transition cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>

            {/* Question list */}
            <div className="p-3 text-sm text-gray-600">
                <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs uppercase font-semibold text-gray-500">Question list</span>
                <div className="flex gap-2">
                    <Trash2 
                        size={16} 
                        className={`${
                            localQuiz.questions.length > 1 ? 
                            "text-red-500 cursor-pointer" : 
                            "text-gray-300 cursor-not-allowed"
                        }`}
                        onClick={() => selectedQuestion != null && localQuiz.questions.length > 1 && deleteQuestion(selectedQuestion)}
                    />
                    <Plus 
                        size={16} 
                        className="text-gray-500 cursor-pointer"
                        onClick={() => addQuestion()}
                    />
                </div>
                </div>

                {localQuiz.questions.map((q, i) => (
                <div
                    key={i}
                    className={`px-3 py-2 rounded-md mb-1 ${
                    selectedQuestion === i ? "bg-[#36517D] text-[#FFFFFF] font-medium" : "transition cursor-pointer hover:bg-[#b6c8e3] text-[#000000]"
                    }`}
                    onClick={() => setEditQuestion(i)}
                >
                <h3 className="text-lg font-medium">Question {i}</h3>
                </div>
                ))}
            </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-xs text-gray-400 border-t border-gray-100">
            Instructli: AI-powered learning for CSC258. AI may make mistakes.
            </div>
        </aside>

        {/* Main content */}
        <section className="flex-1 px-12 py-10">
            <h1 className="text-2xl font-semibold mb-10">Create New Quiz</h1>
            <div className="space-y-8 max-w-3xl">
                {/* Question input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <textarea
                        placeholder="Enter your question here..."
                        value={localQuiz.questions[selectedQuestion].description}
                        onChange={(e) =>
                        setQuestion(selectedQuestion, {
                            ...localQuiz.questions[selectedQuestion],
                            description: e.target.value,
                        })
                        }
                        rows={1}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 resize-none overflow-hidden focus:ring-2 focus:ring-[#b6c8e3] focus:border-transparent"
                        onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = "auto";
                        el.style.height = `${el.scrollHeight}px`;
                        }}
                    />
                </div>

                <label className="block text-sm font-medium mb-2">Question Type</label>
                <select
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#b6c8e3] focus:border-transparent"
                    value={localQuiz.questions[selectedQuestion].type_data.type}
                    onChange={(e) => updateQuestionType(selectedQuestion, Number(e.target.value) as QuestionType)}
                >
                    <option value={QuestionType.ShortAnswer}>Short Answer</option>
                    <option value={QuestionType.MultipuleChoice}>Multiple Choice</option>
                </select>

                {/* Answer input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Answer</label>
                    <textarea
                        placeholder="Enter the answer here..."
                        value={localQuiz.questions[selectedQuestion].answer}
                        onChange={(e) =>
                        setQuestion(selectedQuestion, {
                            ...localQuiz.questions[selectedQuestion],
                            answer: e.target.value,
                        })
                        }
                        rows={1}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 resize-none overflow-hidden focus:ring-2 focus:ring-[#b6c8e3] focus:border-transparent"
                        onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = "auto";
                        el.style.height = `${el.scrollHeight}px`;
                        }}
                    />
                </div>

                {/* Save button */}
                <div className="flex justify-end pt-4">
                    <button
                    onClick={() => saveQuiz()}
                    type="submit"
                    className="text-[#FFFFFF] hover:text-[#000000] px-6 py-2.5 rounded-full shadow bg-[#36517D] hover:bg-[#b6c8e3] transition cursor-pointer"
                    >
                    Save
                    </button>
                </div>
            </div>
        </section>
        </main>
    );
}
