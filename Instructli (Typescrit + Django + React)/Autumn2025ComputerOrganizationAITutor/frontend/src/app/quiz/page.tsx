"use client";
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Question, QuestionType, Difficulty, Quiz, QuizResult, TypeData } from "@/utils/quiz";
import { QuizScreen } from './subpages/QuizScreen';
import { QuizSelection } from './subpages/QuizSelection';
import { QuizResults } from './subpages/QuizResults';
import { UserData } from "@/utils/instructor-screen";
import api from '@/utils/api';

type FilteredQuestionInput = {
    tags: string[],
    difficulty?: string[],  // optional
    type?: string[],  // optional
    count: number,  // number of questions to return
    exclude_ids?: number[]  // optional, exclude specific questions
    render: true // Always render
}

type FilteredQuestionAnswerOutput = string | {
    correct_answer: string,
    options: string[];
}

type FilteredQuestionOutput = {
    id: number,
    question_string: string,
    rendered_question?: string,  // Rendered question from backend
    rendered_answer?: string,    // Rendered answer from backend
    type: string,
    answer: FilteredQuestionAnswerOutput,
    tag: string[],
    is_published: boolean,
    created_at: string,
    updated_at: string,
    difficulty: string,
    explanation?: string,  // Optional explanation for AI-generated questions
}

type QuestionOutput = {
  question: string;  // The generated question text
  type: string;      // "multiple_choice" or "short_answer"
  options?: string[]; // Only for multiple_choice
  answer: string;    // The correct answer
  explanation?: string; // Optional explanation
  valid?: boolean;   // Optional valid flag (should be true if present)
}

// Fetch AI-generated questions from OpenAI (no difficulty filter, mixed difficulty)
const getAIGeneratedQuestions = async () => {
    try {
        console.log("Calling AI question generation");
        const response = await api.get('/api/quiz/generate/', {
            params: {
                use_ai: true  // Use AI for generation
            },
            timeout: 60000 // 1 minute in milliseconds
        });
        console.log("Question generation response:", response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
            console.error('Invalid response format:', response.data);
            return [];
        }
        
        if (response.data.length === 0) {
            console.warn('No questions generated');
            return [];
        }
        
        return response.data.map((q: QuestionOutput, index: number)=>{
            return {
                id: index + 1,
                question_string: q.question || "",
                type: q.type || "short_answer",
                answer: q.type === "multiple_choice" && q.options
                    ? {
                        correct_answer: q.answer || "",
                        options: q.options || []
                    }
                    : (q.answer || ""),
                tag: [],
                is_published: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                difficulty: "easy",
                explanation: q.explanation  // Preserve explanation for AI-generated questions
            };
        })
    } catch (error: any) {
        console.error('Error fetching AI questions:', error);
        throw error;
    }
};

// Fetch questions from test_bank.json by difficulty (without AI)
const getQuestionsByDifficulty = async (difficulty: string) => {
    try {
        console.log(`Loading ${difficulty} questions from test_bank.json`);
        const response = await api.get('/api/quiz/generate/', {
            params: {
                difficulty: difficulty,
                use_ai: false  // Don't use AI for Easy/Medium quizzes
            },
            timeout: 10000 // 10 seconds timeout
        });
        console.log(`${difficulty} questions response:`, response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
            console.error('Invalid response format:', response.data);
            return [];
        }
        
        if (response.data.length === 0) {
            console.warn(`No ${difficulty} questions found`);
            return [];
        }
        
        // Map the response to match FilteredQuestionOutput format
        return response.data.map((q: any, index: number) => ({
            id: index + 1,
            question_string: q.question || "",
            type: q.type || "short_answer",
            answer: q.answer || "",
            tag: q.tag || [],
            difficulty: q.difficulty || difficulty,
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })) as FilteredQuestionOutput[];
    } catch (error: any) {
        console.error(`Error fetching ${difficulty} questions:`, error);
        throw error;
    }
};

// Quiz configuration mapping
const QUIZ_CONFIG = {
    0: { title: "Easy Quiz", difficulty: "easy", useAI: false },      // Easy Quiz - from test_bank.json without AI
    1: { title: "Medium Quiz", difficulty: "medium", useAI: false },  // Medium Quiz - from test_bank.json without AI
    2: { title: "AI-Generated Quiz", difficulty: undefined, useAI: true }, // AI-Generated Quiz - from test_bank.json WITH AI
} as const;

export default function Home() {

    const [userData, setuserData] = useState<UserData>({
        profile: "/images/defaults/default_pfp.jpg",
        name: "Guest",
    });

    useEffect(() => {
        const username = localStorage.getItem('github_username') || "Guest";
        const profile = localStorage.getItem('github_username') != null ? `https://github.com/${localStorage.getItem('github_username')}.png` : "/images/defaults/default_pfp.jpg";
        setuserData({
            profile: profile,
            name: username,
        })
    }, []);

    const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
    const [results, setResults] = useState<QuizResult | null>(null);
    const [quizzes, setQuizzes] = useState<Quiz[]>([
        {
            id: 0,
            title: QUIZ_CONFIG[0].title,
            icon: "/images/icons/quiz.jpg",
            questions: [],
        },
        {
            id: 1,
            title: QUIZ_CONFIG[1].title,
            icon: "/images/icons/quiz.jpg",
            questions: [],
        },
        {
            id: 2,
            title: QUIZ_CONFIG[2].title,
            icon: "/images/icons/quiz.jpg",
            questions: [],
        },
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function loadQuizQuestions(quizId: number) {
        setIsLoading(true);
        setError(null);
        
        try {
            let questionStrings: FilteredQuestionOutput[] = [];
            
            // Get quiz configuration based on quizId
            const config = QUIZ_CONFIG[quizId as keyof typeof QUIZ_CONFIG];
            
            if (!config) {
                throw new Error(`Invalid quiz ID: ${quizId}`);
            }
            
            console.log(`Loading ${config.title}...`);
            
            // Load questions based on configuration
            if (config.useAI) {
                questionStrings = await getAIGeneratedQuestions() as FilteredQuestionOutput[];
            } else if (config.difficulty) {
                questionStrings = await getQuestionsByDifficulty(config.difficulty) as FilteredQuestionOutput[];
            }
            
            if (!questionStrings || questionStrings.length === 0) {
                console.warn('No questions found');
                throw new Error('No questions found');
            }
        
            const questions: Question[] = []

            for (let question_index = 0; question_index < questionStrings.length; question_index++) {
                const questionString: FilteredQuestionOutput = questionStrings[question_index];

                let answer: string = ""
                let choices: string[] = []
                let difficulty: Difficulty = Difficulty.Easy

                if (questionString.difficulty.toLowerCase() === "easy") {
                    difficulty = Difficulty.Easy
                } else if (questionString.difficulty.toLowerCase() === "medium") {
                    difficulty = Difficulty.Medium
                } else if (questionString.difficulty.toLowerCase() === "hard") {
                    difficulty = Difficulty.Hard
                }

                let type_data: TypeData = { type: QuestionType.ShortAnswer };

                if (questionString.type === "multiple_choice") {
                    const answerData = questionString.answer as { correct_answer: string, options: string[] };
                    answer = answerData.correct_answer;
                    choices = answerData.options;
                    type_data = {
                        type: QuestionType.MultipuleChoice,
                        choices: choices
                    };
                } else if (questionString.type === "true_false") {
                    answer = questionString.answer as string;
                    type_data = {
                        type: QuestionType.MultipuleChoice,
                        choices: ["True", "False"]
                    };
                } else {
                    answer = questionString.answer as string;
                }

                // Use rendered_question if available, otherwise use question_string
                const questionText = questionString.rendered_question || questionString.question_string;
                
                questions.push({
                    description: questionText,
                    difficulty: difficulty,
                    tags: questionString.tag,
                    answer: answer,
                    type_data: type_data,
                    explanation: questionString.explanation,  // Include explanation if present
                })
            }

            if (questions.length <= 0) {
                console.warn('No valid questions after processing');
                throw new Error('No valid questions after processing');
            }

            // Update the quiz with questions
            setQuizzes(prevQuizzes => 
                prevQuizzes.map(quiz => 
                    quiz.id === quizId 
                        ? { ...quiz, questions: questions }
                        : quiz
                )
            );
            
            // Now select the quiz to start it
            setSelectedQuiz(quizId);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error 
                || err?.message 
                || 'Failed to load quiz questions. Please try again.';
            setError(errorMessage);
            console.error('Error loading quiz:', err);
        } finally {
            setIsLoading(false);
        }
    }
    // await GenerateQuiz(
            //     "Easy Quiz",
            //     "/images/icons/game_controller.png",
            //     {
            //         tags: ["alu", "pipeline"],
            //         difficulty: ["easy", "medium"],
            //         count: 10,
            //         exclude_ids: [1, 5, 10]
            //     }
            // );
    // Handle quiz selection - always reload questions for fresh random values
    const handleQuizSelection = (quizId: number) => {
        // Always load fresh questions to get new random values
        loadQuizQuestions(quizId);
    };
    
    // await GenerateQuiz(
    //     "Hard Quiz",
    //     "/images/icons/game_controller.png",
    //     {
    //         tags: ["alu", "pipeline"],
    //         difficulty: ["hard"],
    //         count: 10,
    //         exclude_ids: [1, 5, 10]
    //     }
    // );
    useEffect(() => {
        // Don't auto-load quizzes - wait for user selection
    }, []);

    // const quizzes: Quiz[] = [
    //     {
    //         id: 0,
    //         title: "Quiz of Doom",
    //         icon: "/images/icons/game_controller.png",
    //         questions: [question1, question2, question3, question1, question1, question1, question1, question1, question1, question1, question1],
    //     },
    //     {
    //         id: 1,
    //         title: "Impossible Quiz",
    //         icon: "/images/icons/game_controller.png",
    //         questions: [question1],
    //     },
    //     {
    //         id: 2,
    //         title: "Quizless Quiz",
    //         icon: "/images/icons/game_controller.png",
    //         questions: [question2],
    //     },
    // ]

    const getCurrentScreen = () => {
        if (results != null) {
            return <QuizResults 
                results={results}
                setResults={setResults}
                setSelectedQuiz={setSelectedQuiz}
            />
        }
        if (selectedQuiz != null) {
            return <QuizScreen 
                quiz={quizzes[selectedQuiz]}
                setSelectedQuiz={setSelectedQuiz}
                setResults={setResults}
            />
        }
        if (isLoading) {
            return (
                <main className="h-screen bg-gray-50 px-8 py-10 text-gray-800 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-xl">Loading quiz questions...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a minute for AI-generated questions</p>
                    </div>
                </main>
            );
        }
        if (error) {
            return (
                <main className="h-screen bg-gray-50 px-8 py-10 text-gray-800 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xl text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                            }}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors transition cursor-pointer"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </main>
            );
        }
        return <QuizSelection 
            quizzes={quizzes}
            userData={userData}
            setSelectedQuiz={handleQuizSelection}
        />;
    };

    return (
        getCurrentScreen()
    )
}
