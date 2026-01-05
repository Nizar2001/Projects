"use client";

import Image from "next/image";
import { Question, answerType, Quiz } from "@/utils/quiz";
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { UserData } from "@/utils/instructor-screen";
import { SelectionBox } from '../../../../components-instructor/SelectionBox';

type DashBoardProps = {
    quizzes: Quiz[];
    setQuizzes: Dispatch<SetStateAction<Quiz[]>>;
    setEditQuiz: Dispatch<SetStateAction<number | null>>;
    setViewStats: Dispatch<SetStateAction<boolean>>;
    userData: UserData;
    availableIcons: string[]
};

export function DashBoard({quizzes, setQuizzes, setEditQuiz, setViewStats, userData, availableIcons}: DashBoardProps) {

    const addQuiz = () => {
        setQuizzes([
        ...quizzes,
        {
            id: quizzes.length + 1,
            title: "New Quiz",
            icon: "/images/icons/quiz.jpg",
            questions: [],
        },
        ]);
    };

    const deleteQuiz = (index: number) => {
        setQuizzes(quizzes.filter((quiz, quizIndex) => index !== quizIndex));
    };

    const setQuiz = (index: number, newQuiz: Quiz) => {
        setQuizzes(
            quizzes.map((quiz, i)  => i === index ? newQuiz : quiz)
        );
    }

    const setQuizTitle = (index: number, title: string) => {
        setQuiz(index, {
            ...quizzes[index],
            title: title,
        })
    }

    const setQuizIcon = (index: number, icon: string) => {
        setQuiz(index, {
            ...quizzes[index],
            icon: icon,
        })
    }

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
                        <h1 className="text-3xl">Welcome Back {userData.name}</h1>
                        <p className="text-xl mt-2">Here are your modules and quizzes</p>
                    </div>

                    {/* View Stats Button */}
                    <button
                        onClick={() => setViewStats(true)}
                        className="ml-auto text-white px-5 py-2 rounded-lg transition cursor-pointer bg-[#36517D] hover:bg-[#b6c8e3] text-[#FFFFFF] hover:text-[#000000]"
                    >
                        View Stats
                    </button>
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
                        onAdd={addQuiz}
                        onDelete={deleteQuiz}
                        onEdit={setEditQuiz}
                        onEditName={setQuizTitle}
                        onEditIcon={setQuizIcon}
                        availableIcons={availableIcons}
                    />
                </div>
            </div>
        </main>
    );
}