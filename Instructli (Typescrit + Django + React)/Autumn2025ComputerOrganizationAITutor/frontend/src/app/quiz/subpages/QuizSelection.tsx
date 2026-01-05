"use client";

import Image from "next/image";
import { Question, answerType, Quiz } from "@/utils/quiz";
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { UserData } from "@/utils/instructor-screen";
import { SelectionBox } from '../../../../components-instructor/SelectionBox';

type QuizSelectionProps = {
    quizzes: Quiz[];
    userData: UserData
    setSelectedQuiz: (id: number) => void;
};

export function QuizSelection({quizzes, userData, setSelectedQuiz}: QuizSelectionProps) {
    return (
        <main className="h-screen bg-gray-50 px-8 py-10 text-gray-800 overflow-auto">
            <div className="mt-17 mb-17 ml-25 mr-25">
                {/* Header */}
                <div className="flex items-center gap-4 mb-17">
                    <div className="w-18 h-18 rounded-full overflow-hidden bg-gray-200">
                        <Image
                            src={userData.profile}
                            alt="User avatar"
                            width={100}
                            height={100}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl">Welcome {userData.name}</h1>
                        <p className="text-xl mt-2">Check your understanding with one of the Quizzes below!</p>
                    </div>
                </div>

                {/* Quizzes Section */}
                <div className="mb-17">
                    <SelectionBox
                        title="Quizzes"
                        items={quizzes.map((item, index) => (
                            {
                                id: index,
                                icon: item.icon,
                                title: item.title,
                                length: item.questions.length,
                                quantifier: "Questions",
                            }
                        ))}
                        onClick = {setSelectedQuiz}
                    />
                </div>
            </div>
        </main>
    );
}
