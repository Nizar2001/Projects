
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '../../components/Header';
import Chatbot from '../../components/ChatBot';
import GuestSessionInit from '../../components/SessionManager';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instructli",
  description: "AI Tutor for CSC258",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    {/* 
    flex-col  → stack header + content
    h-screen  → exactly viewport height
    overflow-hidden → kill scrollbars
    */}
      <body
      className={`
      ${geistSans.variable} ${geistMono.variable}
      antialiased
      flex flex-col h-screen overflow-hidden
      `}
      >
        <GuestSessionInit />
        <Header />

        {/* 
        flex-1 → fill remaining height under header
        overflow-hidden → no scrolling inside
        */}
        <div className="flex flex-1 bg-[#F3F3F3] overflow-hidden">

          <main className="relative flex-1">
          {children}
          </main>
        </div>

      </body>
    </html>
  );
}
