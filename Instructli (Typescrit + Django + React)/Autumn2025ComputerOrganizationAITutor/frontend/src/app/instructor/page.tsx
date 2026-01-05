"use client";
import { DashBoard } from '../instructor/subpages/DashBoard';
import { QuizCreation } from '../instructor/subpages/QuizCreation';
import { StudentStats } from '../instructor/subpages/StudentStats';
import { useRouter } from 'next/navigation';
import api from "../../utils/api";
import { Quiz } from "@/utils/quiz";
import { useState, useEffect } from "react";
import { UserData } from "@/utils/instructor-screen";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        const checkInstructor = async () => {
            try {
                const res = await api.get("/api/users/check-instructor");
                if (!res.data) {
                    router.push('/');
                }
            } catch {
                console.log("failed to fetch instructor status");
            }
        };
        checkInstructor();
    }, []);

    // Example list of icons from your directory
    const availableIcons = [
        "/images/icons/calculator.png",
        "/images/icons/quiz.jpg",
    ];

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

    const [viewingStats, setViewStats] = useState<boolean>(false);

    const [selectedQuiz, setEditQuiz] = useState<number | null>(null);

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    const getCurrentScreen = () => {
        if (viewingStats) {
            return <StudentStats 
                setViewStats={setViewStats}
            />;
        }
        if (selectedQuiz != null) {
            return <QuizCreation 
                quizzes={quizzes} 
                setQuizzes={setQuizzes} 
                selectedQuiz={selectedQuiz} 
                setEditQuiz={setEditQuiz}
            />;
        }
        return <DashBoard 
            quizzes={quizzes} 
            setQuizzes={setQuizzes} 
            setEditQuiz={setEditQuiz}
            setViewStats={setViewStats}
            userData={userData}
            availableIcons={availableIcons}
        />;
    };

    return (
        <div>
            {getCurrentScreen()}
        </div>
    )
}