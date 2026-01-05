import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Question, answerType, QuizResult, Quiz } from "@/utils/quiz";
import { QuestionBox } from '../../../../components-quiz/QuestionBox';
import { SelectionBox } from '../../../../components-quiz/SelectionBox';
import { ProgressBar } from '../../../../components-quiz/ProgressBar';
import { Keys } from '../../../../components-quiz/Keys';

type QuizScreenProps = {
    quiz: Quiz;
    setSelectedQuiz: (id: number | null) => void;
    setResults: (result: QuizResult| null) => void;
};

export function QuizScreen({quiz, setSelectedQuiz, setResults}: QuizScreenProps) {
    const [answers, setAnswers] = useState<(answerType)[]>(Array(quiz.questions.length).fill(null));
    const [flags, setFlags] = useState<boolean[]>(Array(quiz.questions.length).fill(false));
    const [selectedQuestionIndex, onQuestionSelected] = useState<number>(0);

    function onAnswerSelected(questionIndex: number, newAnswer: answerType) {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = newAnswer;
        setAnswers(newAnswers);
    }

    function onFlagSet(questionIndex: number, newFlag: boolean) {
        const newFlags = [...flags];
        newFlags[questionIndex] = newFlag;
        setFlags(newFlags);
    }

    function onFinish() {
        setResults(
            {
                quiz: quiz,
                result: answers,
            }
        );
        setSelectedQuiz(null);
    }

    const answered = answers.reduce((sum, answer) => {
        if (typeof answer == "string") {
            return sum + 1;
        }
        return sum;
    }, 0);

    return (
        <div className="flex flex-col h-full bg-white p-4 overflow-auto">

            <button
                onClick={() => setSelectedQuiz(null)}
                className="absolute top-4 left-4 text-bg-[#36517D] hover:text-bg-[#b6c8e3] transition cursor-pointer flex items-center gap-2 text-black"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="flex flex-1 gap-8 mt-13 mb-5">
                <div className="w-[75%]">
                    <QuestionBox
                        questions={quiz.questions}
                        selectedQuestionIndex={selectedQuestionIndex}
                        answers={answers}
                        onAnswerSelected={onAnswerSelected}
                    />
                </div>
                <div className="flex-1 mr-5">
                    <SelectionBox
                        answers={answers}
                        selectedQuestionIndex={selectedQuestionIndex}
                        flags={flags}
                        onQuestionSelected={onQuestionSelected}
                    />
                </div>
            </div>
            <div className="flex gap-15 mt-6 h-35">
                <div className="w-[75%]">
                    <ProgressBar total={quiz.questions.length} current={answered} />
                </div>
                <div className="flex-1 mr-5">
                    <Keys
                        flags={flags}
                        selectedQuestionIndex={selectedQuestionIndex}
                        onQuestionSelected={onQuestionSelected}
                        onFlagSet={onFlagSet}
                        onFinish={onFinish}
                    />
                </div>
            </div>
        </div>
    )
}