'use client';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { ChevronDown, ChevronRight, User, MessageCircle, Calendar, Download } from 'lucide-react';
import api from "../../../utils/api";

// made using claude
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: number;
  title: string;
  has_summary: boolean;
  messages: Message[];
}

interface Summary {
  id: number;
  title: string;
  updated_at: string;
  preview: string;
  conversation_id: number;
  content: string;
}

interface UserData {
  username: string;
  conversations: Conversation[];
  summaries: Summary[];
}

interface ExpandedState {
  [key: string]: boolean;
}

interface ExpandedStateNumber {
  [key: number]: boolean;
}

type StudentStatsProps = {
    setViewStats: Dispatch<SetStateAction<boolean>>;
};

export function StudentStats({setViewStats}: StudentStatsProps) {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<ExpandedState>({});
  const [expandedConversations, setExpandedConversations] = useState<ExpandedStateNumber>({});
  const [expandedSummaries, setExpandedSummaries] = useState<ExpandedStateNumber>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/users/student-stats");
        setUserData(res.data);
      } catch {
        console.log("failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleUserExpansion = (username: string): void => {
    setExpandedUsers((prev) => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  const toggleConversationExpansion = (conversationId: number): void => {
    setExpandedConversations((prev) => ({
      ...prev,
      [conversationId]: !prev[conversationId]
    }));
  };

  const toggleSummaryExpansion = (summaryId: number): void => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [summaryId]: !prev[summaryId]
    }));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const downloadData = async (): Promise<void> => {
    setDownloading(true);
    try {
      const res = await api.get("/api/users/student-stats");
      const dataStr = JSON.stringify(res.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `student-stats-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading data:', err);
    } finally {
      setDownloading(false);
    }
  };

  const downloadCsvData = async (): Promise<void> => {
    setDownloadingCsv(true);
    try {
      const res = await api.get("/api/users/student-stats");
      const data: UserData[] = res.data;
      
      // Create conversations CSV
      const conversationRows: string[][] = [];
      conversationRows.push(['username', 'conversation_id', 'title', 'has_summary', 'message_count', 'messages']);
      
      data.forEach(user => {
        user.conversations.forEach(conversation => {
          const messagesJson = JSON.stringify(conversation.messages);
          conversationRows.push([
            user.username,
            conversation.id.toString(),
            `"${conversation.title.replace(/"/g, '""')}"`, // Escape quotes in CSV
            conversation.has_summary.toString(),
            conversation.messages.length.toString(),
            `"${messagesJson.replace(/"/g, '""')}"` // Escape quotes in JSON
          ]);
        });
      });

      // Create summaries CSV
      const summaryRows: string[][] = [];
      summaryRows.push(['username', 'summary_id', 'title', 'updated_at', 'preview', 'conversation_id', 'content']);
      
      data.forEach(user => {
        user.summaries.forEach(summary => {
          summaryRows.push([
            user.username,
            summary.id.toString(),
            `"${summary.title.replace(/"/g, '""')}"`,
            summary.updated_at,
            `"${summary.preview.replace(/"/g, '""')}"`,
            summary.conversation_id.toString(),
            `"${summary.content.replace(/"/g, '""')}"`
          ]);
        });
      });

      // Convert to CSV strings
      const conversationsCsv = conversationRows.map(row => row.join(',')).join('\n');
      const summariesCsv = summaryRows.map(row => row.join(',')).join('\n');

      // Download conversations CSV
      const conversationsBlob = new Blob([conversationsCsv], { type: 'text/csv' });
      const conversationsUrl = window.URL.createObjectURL(conversationsBlob);
      const conversationsLink = document.createElement('a');
      conversationsLink.href = conversationsUrl;
      conversationsLink.download = `conversations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(conversationsLink);
      conversationsLink.click();
      document.body.removeChild(conversationsLink);
      window.URL.revokeObjectURL(conversationsUrl);

      // Download summaries CSV
      const summariesBlob = new Blob([summariesCsv], { type: 'text/csv' });
      const summariesUrl = window.URL.createObjectURL(summariesBlob);
      const summariesLink = document.createElement('a');
      summariesLink.href = summariesUrl;
      summariesLink.download = `summaries-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(summariesLink);
      summariesLink.click();
      document.body.removeChild(summariesLink);
      window.URL.revokeObjectURL(summariesUrl);
      
    } catch (err) {
      console.error('Error downloading CSV data:', err);
    } finally {
      setDownloadingCsv(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden" style={{ paddingBottom: "60px" }}>

        <button
            onClick={() => setViewStats(false)}
            className="absolute top-4 left-4 text-bg-[#36517D] hover:text-bg-[#b6c8e3] transition cursor-pointer flex items-center gap-2"
        >
            <ArrowLeft size={18} />
            Back
        </button>

        <div className="max-w-6xl mx-auto w-full flex flex-col h-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
            {/* Fixed Header */}
            <div className="bg-[#3F5F92] px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {/* <User className="h-6 w-6" /> */}
                    Student Stats Dashboard
                    </h1>
                    <p className="text-blue-100 mt-1">
                    {userData.length} users • {userData.reduce((acc, user) => acc + user.conversations.length, 0)} total conversations
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                    onClick={downloadData}
                    disabled={downloading || downloadingCsv}
                    className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 backdrop-blur-sm 
                            text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200
                            disabled:cursor-not-allowed disabled:opacity-50"
                    >
                    {downloading ? (
                        <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        Downloading...
                        </>
                    ) : (
                        <>
                        <Download className="h-4 w-4" />
                        Raw JSON
                        </>
                    )}
                    </button>
                    <button
                    onClick={downloadCsvData}
                    disabled={downloading || downloadingCsv}
                    className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 backdrop-blur-sm 
                            text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200
                            disabled:cursor-not-allowed disabled:opacity-50"
                    >
                    {downloadingCsv ? (
                        <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        Downloading...
                        </>
                    ) : (
                        <>
                        <Download className="h-4 w-4" />
                        CSV Files
                        </>
                    )}
                    </button>
                </div>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                {userData.map((user) => (
                <div key={user.username} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                    {/* User Header */}
                    <div 
                    className="bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => toggleUserExpansion(user.username)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleUserExpansion(user.username);
                        }
                    }}
                    >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        {expandedUsers[user.username] ? 
                            <ChevronDown className="h-5 w-5 text-gray-500" /> : 
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                        }
                        <User className="h-5 w-5 text-[#3F5F92]" />
                        <span className="font-semibold text-gray-900">{user.username}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            {user.conversations.length} conversations
                        </span>
                        <span className="flex items-center gap-1">
                            {user.summaries.length} summaries
                        </span>
                        </div>
                    </div>
                    </div>

                    {/* User Content */}
                    {expandedUsers[user.username] && (
                    <div className="p-4 space-y-4">
                        {/* Conversations Section */}
                        {user.conversations.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            Conversations
                            </h3>
                            {user.conversations.map((conversation) => (
                            <div key={conversation.id} className="border border-gray-200 rounded-md">
                                <div 
                                className="px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => toggleConversationExpansion(conversation.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleConversationExpansion(conversation.id);
                                    }
                                }}
                                >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                    {expandedConversations[conversation.id] ? 
                                        <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    }
                                    <span className="font-medium text-gray-700">{conversation.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>ID: {conversation.id}</span>
                                    <span>{conversation.messages.length} messages</span>
                                    {conversation.has_summary && (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Has Summary
                                        </span>
                                    )}
                                    </div>
                                </div>
                                </div>
                                
                                {/* Messages */}
                                {expandedConversations[conversation.id] && (
                                <div className="p-3 space-y-2 bg-white">
                                    {conversation.messages.length > 0 ? (
                                    conversation.messages.map((message, messageIndex) => (
                                        <div 
                                        key={messageIndex} 
                                        className={`p-3 rounded-lg ${
                                            message.role === 'user' 
                                            ? 'bg-blue-50 border-l-4 border-blue-400' 
                                            : 'bg-green-50 border-l-4 border-green-400'
                                        }`}
                                        >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-medium uppercase ${
                                            message.role === 'user' ? 'text-blue-600' : 'text-green-600'
                                            }`}>
                                            {message.role}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{message.content}</p>
                                        </div>
                                    ))
                                    ) : (
                                    <p className="text-gray-500 text-sm italic">No messages in this conversation</p>
                                    )}
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        )}

                        {/* Summaries Section */}
                        {user.summaries.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            Summaries
                            </h3>
                            {user.summaries.map((summary) => (
                            <div key={summary.id} className="border border-gray-200 rounded-md">
                                <div 
                                className="px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => toggleSummaryExpansion(summary.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleSummaryExpansion(summary.id);
                                    }
                                }}
                                >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                    {expandedSummaries[summary.id] ? 
                                        <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    }
                                    <span className="font-medium text-gray-700 truncate">{summary.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(summary.updated_at)}
                                    </span>
                                    <span>Conv ID: {summary.conversation_id}</span>
                                    </div>
                                </div>
                                </div>
                                
                                {/* Summary Content */}
                                {expandedSummaries[summary.id] && (
                                <div className="p-3 bg-white">
                                    <div className="space-y-2">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Preview:</h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                        {summary.preview}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Full Content:</h4>
                                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded leading-relaxed">
                                        {summary.content.split('\n').map((paragraph, index) => (
                                            <p key={index} className="mb-2 last:mb-0">{paragraph}</p>
                                        ))}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        )}

                        {/* Empty State */}
                        {user.conversations.length === 0 && user.summaries.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>No conversations or summaries for this user</p>
                        </div>
                        )}
                    </div>
                    )}
                </div>
                ))}
            </div>
            </div>
        </div>
    </div>
);
};
