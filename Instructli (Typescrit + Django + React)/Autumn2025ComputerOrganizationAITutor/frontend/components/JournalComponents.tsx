'use client';
import { useState, useEffect, useRef } from 'react';
import api from "../src/utils/api";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import ChatBot, { ChatBotRef } from './ChatBot';

// Type definitions
interface JournalEntry {
  id: number;
  title: string;
  updated_at: string;
  preview: string;
  conversation_id: string;
}

interface FullJournalEntry extends JournalEntry {
  content: string;
  tags?: string[];
}

// JournalButton Component
type NavButtonProps = {
  text: string;
  entryID: string;
  date: string;
  isActive: boolean;
  onClick: () => void;
};

function JournalButton({ text, entryID, date, isActive, onClick }: NavButtonProps) {
  const formatShortDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col items-start justify-center cursor-pointer
        w-full h-[80px] px-[8px] py-[6px] mb-[1px] border-b border-gray-300
        ${isActive ? 'bg-[#FFFFFF]' : 'bg-[#F3F3F3] hover:bg-[#E5E5E5] active:bg-[#E5E5E5]'}
      `}
    >
      <h1 className="text-black text-sm font-medium break-words line-clamp-2 leading-tight mb-1">{text}</h1>
      <span className="text-gray-500 text-xs">{formatShortDate(date)}</span>
    </div>
  );
}

// JournalOps Component
type JournalOpsProps = {
  entries: JournalEntry[];
  currButton: string | null;
  setCurrButton: (id: string) => void;
  onTabSwitch: () => void;
}

function JournalOps({ entries, currButton, setCurrButton, onTabSwitch }: JournalOpsProps) {
  return (
    <nav className="w-[350px] h-full flex flex-col bg-[#F3F3F3] border-2 border-[#D9D9D9]">
      <div className="flex-1 overflow-y-auto">
        {entries.map((entry) => (
          <JournalButton
            key={entry.id}
            text={entry.title}
            entryID={entry.id.toString()}
            date={entry.updated_at}
            isActive={currButton === entry.id.toString()}
            onClick={() => {
              setCurrButton(entry.id.toString());
              onTabSwitch();
            }} 
          />
        ))}
       </div>
    </nav>
  );
}

// JournalPage Component
type JournalPageProps = {
  entry: FullJournalEntry;
  onShowChat: (id: string) => void;
  onHideChat?: () => void;
  isChatOpen?: boolean;
};

function JournalPage({ entry, onShowChat, onHideChat, isChatOpen }: JournalPageProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await api.post('/api/chat/delete-summary', { id: entry.id });
        // Redirect or refresh the page after deletion
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete entry:', error);
        alert('Failed to delete entry. Please try again.');
      }
    }
  };

  const handleViewFullChat = async () => {
    if (isChatOpen && onHideChat) {
      onHideChat();
    } else {
      onShowChat(entry.conversation_id);
    }
  };

  return (
    <main className='w-full h-full text-black bg-[#FFFFFF] p-6 overflow-y-auto'>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{entry.title}</h1>
          <h2 className="text-gray-600">{formatDate(entry.updated_at)}</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleViewFullChat}
            className="w-10 h-10 bg-[#D9D9D9] hover:bg-[#BFBFBF] transition-colors duration-200 flex items-center justify-center cursor-pointer rounded"
            title={isChatOpen ? "Hide Chat" : "View Full Chat"}
          >
            {isChatOpen ? (
              // Minimize icon
              <svg 
                width="30" 
                height="30" 
                viewBox="0 0 25 25" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <g strokeWidth="5"/>
                <g strokeLinecap="round" strokeLinejoin="round"/>
                <g>
                  <path d="M6 14.5L10.5 14.5V19M19 10.5H14.5L14.5 6" stroke="#212121" strokeWidth="1.2"/>
                  <path d="M10.5 14.5L6 19" stroke="#212121" strokeWidth="1.2"/>
                  <path d="M14.5 10.5L19 6" stroke="#212121" strokeWidth="1.2"/>
                </g>
              </svg>
            ) : (
              // Expand icon
              <svg 
                width="30" 
                height="30" 
                viewBox="0 0 25 25" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <g strokeWidth="5"/>
                <g strokeLinecap="round" strokeLinejoin="round"/>
                <g>
                  <path d="M14 6.5H18.5V11M11 18.5H6.5V14" stroke="#212121" strokeWidth="1.2"/>
                  <path d="M18.5 6.5L14 11M6.5 18.5L11 14" stroke="#212121" strokeWidth="1.2"/>
                </g>
              </svg>
            )}
          </button>
          <button
            onClick={handleDelete}
            className="w-10 h-10 bg-[#D9D9D9] hover:bg-[#BFBFBF] transition-colors duration-200 flex items-center justify-center cursor-pointer rounded"
            title="Delete Entry"
          >
            <svg 
              width="30" 
              height="30" 
              viewBox="0 0 25 25" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <g strokeWidth="5"/>
              <g strokeLinecap="round" strokeLinejoin="round"/>
              <g>
                <path d="M5 6.5H20M10 6.5V4.5C10 3.94772 10.4477 3.5 11 3.5H14C14.5523 3.5 15 3.94772 15 4.5V6.5M12.5 9V17M15.5 9L15 17M9.5 9L10 17M18.5 6.5L17.571 18.5767C17.5309 19.0977 17.0965 19.5 16.574 19.5H8.42603C7.90349 19.5 7.46905 19.0977 7.42898 18.5767L6.5 6.5H18.5Z" stroke="#212121" strokeWidth="1.2"/>
              </g>
            </svg>
          </button>
        </div>
      </div>
      <div className="prose max-w-none pr-30">
        <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
          {entry.content}
        </ReactMarkdown>
      </div>
    </main>
  );
}

// Main Journal Component
export default function JournalHome() {
  const MIN_CHATBOT_WIDTH = 540;  // Minimum width in pixels
  const MIN_CONTENT_WIDTH = 700;  // Minimum width for main content area
  const [currEntryID, setCurrEntryID] = useState<string | null>(null); 
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<FullJournalEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chatbotWidth, setChatbotWidth] = useState(MIN_CHATBOT_WIDTH); // Default width
  const [isDragging, setIsDragging] = useState(false);

  const getMaxChatbotWidth = () => Math.max(MIN_CHATBOT_WIDTH, window.innerWidth - MIN_CONTENT_WIDTH);

  const chatBotRef = useRef<ChatBotRef>(null);

  const handleShowChat = (id: string) => {
    setShowChat(!showChat);
    setTimeout(() => {
      chatBotRef.current?.jumpToConversation(id);
    }, 0);
  }

  // Fetch all entries on component mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await api.get('/api/chat/summaries');
        const data = response.data.reverse();
        setEntries(data);
        
        // Set the first entry as default if available
        if (data.length > 0) {
          setCurrEntryID(data[0].id.toString());
        }
      } catch (error) {
        console.error('Failed to fetch entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Fetch specific entry when currEntryID changes
  useEffect(() => {
    const fetchEntry = async () => {
      if (!currEntryID) return;
      
      try {
        const response = await api.get(`/api/chat/summaries/${currEntryID}`);
        setCurrentEntry(response.data);
      } catch (error) {
        console.error('Failed to fetch entry:', error);
        setCurrentEntry(null);
      }
    };

    fetchEntry();
  }, [currEntryID]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No summaries found</h2>
          <p className="text-gray-600">Start a conversation to create your first entry!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <main className="flex-1 flex" style={{ width: showChat ? `calc(100% - ${chatbotWidth}px)` : '100%' }}>  
        <JournalOps 
          entries={entries}
          currButton={currEntryID} 
          setCurrButton={setCurrEntryID}
          onTabSwitch={() => setShowChat(false)}
        />
        {currentEntry && <JournalPage 
          entry={currentEntry} 
          onShowChat={handleShowChat}
          onHideChat={() => setShowChat(false)}
          isChatOpen={showChat}
        />}
      </main>
      
      {/* Resize handle - only show when chat is open */}
      {showChat && (
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-400 hover:bg-gray-600 cursor-col-resize flex-shrink-0 transition-colors duration-200"
        />
      )}
      
      {/* Chatbot on the right side - shown when chat is opened */}
      {showChat && (
        <aside 
          className="h-full flex-shrink-0 overflow-hidden"
          style={{ width: `${chatbotWidth}px` }}
        >
          <div className="w-full h-full">
            <ChatBot ref={chatBotRef} />
          </div>
        </aside>
      )}
    </div>
  );
}

// Export the original components for backward compatibility if needed
export const JournalMenu = JournalHome;
export const JournalEntry = JournalPage;
