import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { evaluate } from "mathjs";

export enum StateColours {
    Selected = "000000",
    Answered = "50C878",
    Flagged = "FFA500",
    Unanswered = "EEEEEE",
}

export enum Difficulty {
    Easy,
    Medium,
    Hard
}

export enum QuestionType {
    ShortAnswer,
    MultipuleChoice,
}

export type TypeData = ShortAnswerTypeData | MultipuleChoiceTypeData;

export type ShortAnswerTypeData = {
    type: QuestionType.ShortAnswer,
};

export type MultipuleChoiceTypeData = {
    type: QuestionType.MultipuleChoice,
    choices: string[],
};

export type Question = {
    description: string,
    difficulty: Difficulty,
    tags: string[],
    answer: string,
    type_data: TypeData,
    explanation?: string,  // Optional explanation for AI-generated questions
};

export type Quiz = {
    id: number,
    title: string,
    icon: string,
    questions: Question[],
};

export type answerType = string | null | undefined;

export type QuizResult = {
    quiz: Quiz,
    result: answerType[],
};

export type BaseAnswerProps = {
    answers: answerType[];
    selectedQuestionIndex: number;
}

export type BaseAnswerBoxProps = {
    selectedQuestionIndex: number;
    onAnswerSelected?: (questionIndex: number, newAnswer: answerType) => void,
};
