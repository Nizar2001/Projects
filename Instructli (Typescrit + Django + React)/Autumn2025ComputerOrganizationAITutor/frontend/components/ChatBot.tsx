"use client";
import { useEffect, useState, useRef } from "react";
import { useImperativeHandle, forwardRef } from 'react';
import api, { URL } from "../src/utils/api";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  has_summary: boolean;
}

export interface ChatBotRef {
  jumpToConversation: (id: string) => void;
}

interface ConversationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

interface TitleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversation: Conversation | null;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onSummarize: (id: string) => void;
  summarizing: boolean;
}

// Disclaimer Screen Component
function DisclaimerScreen({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="w-full h-full border-l bg-[#D9D9D9] flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 border border-gray-300">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
        </div>
        
        <div className="space-y-4 text-gray-700 mb-8">
          <p>
            This chatbot is an AI-powered assistant designed to help answer your questions and provide information.
          </p>
          
          <p>
            By proceeding, please acknowledge that while the chatbot strives to provide accurate information, it may not 
            always be 100% correct. If something seems off, feel free to double-check and ask for clarification on Piazza.
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onAccept}
            className="px-8 py-3 bg-[#36517d] hover:bg-[#2d4368] text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer shadow-md"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// top right menu component
function ConversationMenu({ 
  isOpen, 
  onClose, 
  conversations, 
  onNewChat, 
  onSelectConversation 
}: ConversationMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-64">
      <div className="p-2">
        <button
          onClick={onNewChat}
          className="w-full text-left text-black px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          New Chat
        </button>
        
        {conversations.length > 0 && (
          <>
            <hr className="my-2" />
            <div className="max-h-64 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className="w-full text-left text-black px-3 py-2 hover:bg-gray-100 rounded truncate cursor-pointer"
                  title={conv.title}
                >
                  {conv.title}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// menu component of current conversation
function TitleMenu({ 
  isOpen, 
  onClose, 
  currentConversation, 
  onRename, 
  onDelete, 
  onSummarize, 
  summarizing
}: TitleMenuProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (isRenaming && currentConversation) {
      setNewTitle(currentConversation.title);
    }
  }, [isRenaming, currentConversation]);

  // Reset renaming state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setIsRenaming(false);
    }
  }, [isOpen]);

  if (!isOpen || !currentConversation) return null;

  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(currentConversation.id, newTitle.trim());
      setIsRenaming(false);
    }
  };

  if (isRenaming) {
    return (
      <div className="absolute top-10 left-0 bg-white text-black border border-gray-300 rounded-lg shadow-lg z-50 w-64 p-3">
        <div className="space-y-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') setIsRenaming(false);
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleRename}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-400 cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => setIsRenaming(false)}
              className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-48">
      <div className="p-2">
        <button
          onClick={() => setIsRenaming(true)}
          className="w-full text-left text-black px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
        >
          Rename
        </button>
        <button
          onClick={() => onSummarize(currentConversation.id)}
          className="w-full text-left text-black px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
          disabled={summarizing}
        >
          {summarizing 
          ? "Summarizing..." 
          : currentConversation.has_summary 
            ? "Resummarize" 
            : "Summarize"}
        </button>
        <button
          onClick={() => onDelete(currentConversation.id)}
          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-black cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const ChatBot = forwardRef<ChatBotRef>((props, ref) => {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingDisclaimer, setIsLoadingDisclaimer] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [responseLoading, setResponseLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [showSummaryNotification, setShowSummaryNotification] = useState(false);

  // Menu states
  const [conversationMenuOpen, setConversationMenuOpen] = useState(false);
  const [titleMenuOpen, setTitleMenuOpen] = useState(false);

  // Refs for menu containers and trigger buttons
  const conversationMenuRef = useRef<HTMLDivElement>(null);
  const titleMenuRef = useRef<HTMLDivElement>(null);
  const conversationButtonRef = useRef<HTMLButtonElement>(null);
  const titleButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    jumpToConversation: (id: string) => {
      selectConversation(id);
    },
  }));

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('chatbot-disclaimer-accepted');
    if (stored === 'true') {
      setDisclaimerAccepted(true);
    }
    setIsLoadingDisclaimer(false);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('chatbot-disclaimer-accepted', disclaimerAccepted.toString());
    }
  }, [disclaimerAccepted, isClient]);

  // ───── Load conversations and current conversation on mount ─────────────
  useEffect(() => {
    if (disclaimerAccepted) {
      loadConversations();
      loadCurrentConversation();
    }
  }, [disclaimerAccepted]);
  
  useEffect(() => {
    // Reset textarea height on mount and when input is cleared
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.overflowY = "hidden";
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current && input === "") {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.overflowY = "hidden";
    }
  }, [input]);

  // ───── Load conversations list ──────────────────────────────────────────
  const loadConversations = async () => {
    try {
      const res = await api.get("/api/chat/conversations");
      setConversations(res.data.reverse());
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("Failed to load conversations");
    }
  };

  // ───── Load current conversation ────────────────────────────────────────
  const loadCurrentConversation = async () => {
    try {
      const res = await api.get("/api/chat/current-conversation");
      setCurrentConversation({
        id: res.data.id,
        title: res.data.title,
        has_summary: res.data.has_summary,
      });

      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to load current conversation:", err);
    }
  };

  // ───── Set conversation as current ──────────────────────────────────────
  const selectConversation = async (id: string) => {
    try {
      const prevConvo = currentConversation;
      const prevLen = messages.length;

      await api.post(`/api/chat/set-conversation`, {
        id: id,
      });
      await loadCurrentConversation();
      setConversationMenuOpen(false);

      // if previous convo was empty, delete it
      if (prevConvo && prevConvo.id != id && prevLen == 0) {
        try {
          await api.post("/api/chat/delete-conversation", {
            id: prevConvo.id,
          });
          await loadConversations();
        } catch {
          setError("failed to clear empty chat after swapping convo");
        }
      }
    } catch (err) {
      console.error("Failed to select conversation:", err);
      setError("Failed to select conversation");
    }
  };

  // ───── Create new chat ──────────────────────────────────────────────────
  const createNewChat = async () => {
    try {
      await api.post("/api/chat/new-chat");      
      await loadConversations();
      await loadCurrentConversation();
      setConversationMenuOpen(false);
    } catch (err) {
      console.error("Failed to create new chat:", err);
      setError("Failed to create new chat");
    }
  };

  // ───── Rename conversation ──────────────────────────────────────────────
  const renameConversation = async (id: string, newTitle: string) => {
    if (!currentConversation) return;
    
    try {
      await api.post(`/api/chat/rename-conversation`, {
        id: id,
        name: newTitle,
      });
      
      setCurrentConversation({ ...currentConversation, title: newTitle });
      await loadConversations();
      setTitleMenuOpen(false);
    } catch (err) {
      console.error("Failed to rename conversation:", err);
      setError("Failed to rename conversation");
    }
  };

  // ───── Delete conversation ──────────────────────────────────────────────
  const deleteConversation = async (id: string) => {
    if (!currentConversation) return;
    
    try {
      await api.post(`/api/chat/delete-conversation`, {
        id: id,
      });
      await loadConversations();
      await loadCurrentConversation();
      setTitleMenuOpen(false);
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      setError("Failed to delete conversation");
    }
  };

  const summarizeConversation = async (id: string) => {
    if (summarizing) return;
    setSummarizing(true);

    try {
      await api.post("/api/chat/conversation-summary", {id: id});
      setShowSummaryNotification(true);
      setTimeout(() => {
        setShowSummaryNotification(false);
      }, 2000);
    } catch (error) {
      console.log("failed to fetch conversation summary", error);
      setError("failed to fetch conversation summary");
    } finally {
      setSummarizing(false);
    }
  };

  // ───── Scroll helper: only the inner container ────────────────────────────
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // ───── Send prompt & handle response ─────────────────────────────────────
  const streamAssistantResponse = (query_id: string) => {
    return new Promise((resolve, reject) => {
      const tempAssistantResponse: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, tempAssistantResponse]);

      const stream = new EventSource(`${URL}/api/chat/stream-response/${query_id}`);

      stream.onmessage = (event) => {
        setTyping(false);
        if (event.data == "[DONE]") {
          stream.close();
          setResponseLoading(false);
          scrollToBottom();
          resolve("Stream complete");
          return;
        }

        setMessages((prev) => {
          const updatedMessages = [...prev];
          const last = updatedMessages[updatedMessages.length - 1];
          updatedMessages[updatedMessages.length - 1] = {
            ...last,
            content: last.content + event.data.replace(/\\n/g, "\n"),
          };
          return updatedMessages;
        });
      };

      stream.onerror = (err) => {
        stream.close();
        setError("Streaming failed. Please try again.");
        reject(err);
      };
    });
  };

  const sendUserQuery = async (inputText: string) => {
    try {
      let diagramString = null;
      let diagramType = null;
      let currCycle = null;

      if (window.location.pathname == "/single-processor") {
        diagramString = localStorage.getItem("singleDiagram");
        diagramType = "single";
      } else if (window.location.pathname == "/pipeline-processor") {
        diagramString = localStorage.getItem("pipelineDiagram");
        currCycle = localStorage.getItem("currCycle");
        diagramType = "pipeline";
      }

      const diagram = diagramString ? JSON.parse(diagramString) : null;
      const res = await api.post("/api/chat/query", {
        message: {
          role: "user",
          content: inputText,
        },
        diagram: diagram,
        diagram_type: diagramType,
        curr_cycle: currCycle,
      });
      
      return res.data.cache_key;
    } catch (err) {
      setError("Failed to cache user query.");
      return null;
    }
  };

  const getResponse = async (inputText: string) => {
    setResponseLoading(true);
    setTyping(true);
    setError(null);

    const userMessage: Message = { role: "user", content: inputText };
    setMessages((m) => {
      const next = [...m, userMessage];
      setTimeout(scrollToBottom, 0);
      return next;
    });

    const query_id = await sendUserQuery(inputText);
    if (query_id == null) return;
    await streamAssistantResponse(query_id);

    if (currentConversation?.title === "New Chat") {
      try {
        const res = await api.post("/api/chat/generate-title");
        setCurrentConversation({ ...currentConversation, title: res.data.title });
        await loadConversations();
      } catch (err) {
        console.error("failed to get new convo title", err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    getResponse(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "40px";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
      el.style.overflowY = el.scrollHeight > 120 ? "auto" : "hidden";
    }
  };

  // ───── Close menus when clicking outside ───────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside conversation menu
      if (conversationMenuOpen) {
        const isClickInConversationMenu = conversationMenuRef.current?.contains(target);
        const isClickOnConversationButton = conversationButtonRef.current?.contains(target);
        
        if (!isClickInConversationMenu && !isClickOnConversationButton) {
          setConversationMenuOpen(false);
        }
      }

      // Check if click is outside title menu
      if (titleMenuOpen) {
        const isClickInTitleMenu = titleMenuRef.current?.contains(target);
        const isClickOnTitleButton = titleButtonRef.current?.contains(target);
        
        if (!isClickInTitleMenu && !isClickOnTitleButton) {
          setTitleMenuOpen(false);
        }
      }
    };

    if (conversationMenuOpen || titleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [conversationMenuOpen, titleMenuOpen]);

  if (isLoadingDisclaimer) {
    return (
      <div className="w-full h-full border-l bg-[#D9D9D9] flex items-center justify-center">
      </div>
    );
  }

  if (!disclaimerAccepted) {
    return <DisclaimerScreen onAccept={() => setDisclaimerAccepted(true)} />;
  }

  // ───── UI ────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full max-h-screen border-l bg-[#D9D9D9] flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-500 relative">
        
        {/* Current conversation title or default */}
        <div className="relative" ref={titleMenuRef}>
          <button
            ref={titleButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              if (currentConversation) {
                setTitleMenuOpen(!titleMenuOpen);
                setConversationMenuOpen(false);
              }
            }}
            className={`text-lg text-gray-900 max-w-80 text-left flex items-center gap-1 cursor-pointer hover:bg-[#BFBFBF] ${
              currentConversation ? 'px-2 py-1 rounded' : ''
            }`}
            disabled={!currentConversation}
          >
            <span className="truncate">{currentConversation?.title || "New Chat"}</span>
            {currentConversation && (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            )}
          </button>

          {/* Title Menu */}
          <TitleMenu
            isOpen={titleMenuOpen}
            onClose={() => setTitleMenuOpen(false)}
            currentConversation={currentConversation}
            onRename={renameConversation}
            onDelete={deleteConversation}
            onSummarize={summarizeConversation}
            summarizing={summarizing}
          />

          {/* Summary Success Notification - positioned to the right of title */}
          {showSummaryNotification && (
            <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-[#36517d] text-white px-3 py-1 rounded-md shadow-lg flex items-center gap-2 z-50 text-sm whitespace-nowrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Summarized</span>
            </div>
          )}
        </div>

        {/* New chat button */}
        <div className="relative" ref={conversationMenuRef}>
          <button
            ref={conversationButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setConversationMenuOpen(!conversationMenuOpen);
              setTitleMenuOpen(false);
            }}
            className={`w-10 h-10 transition-colors duration-200 flex items-center justify-center cursor-pointer rounded ${
              conversationMenuOpen 
                ? 'bg-[#BFBFBF]' 
                : 'bg-[#D9D9D9] hover:bg-[#BFBFBF]'
            }`}
            title="See chats"
          >
            <svg width="30" height="30" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g strokeWidth="5"/>
              <g strokeLinecap="round" strokeLinejoin="round"/>
              <g>
                <path d="M7.5 16.5H9.5V20.5L13.5 16.5H17.5C18.6046 16.5 19.5 15.6046 19.5 14.5V8.5C19.5 7.39543 18.6046 6.5 17.5 6.5H7.5C6.39543 6.5 5.5 7.39543 5.5 8.5V14.5C5.5 15.6046 6.39543 16.5 7.5 16.5Z" stroke="#212121" strokeWidth="1.2"/>
              </g>
            </svg>
          </button>

          {/* Conversation Menu */}
          <ConversationMenu
            isOpen={conversationMenuOpen}
            onClose={() => setConversationMenuOpen(false)}
            conversations={conversations}
            onNewChat={createNewChat}
            onSelectConversation={selectConversation}
          />
        </div>
      </div>

      {/* Empty state */}
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center">
          <p className="mb-4 text-lg text-black">Hello, how can I help you today?</p>
          <div className="flex gap-2 w-full max-w-md">
            <textarea
              ref={textareaRef}
              className="flex-1 rounded-2xl border border-black text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36517d] resize-none min-h-[40px] max-h-[120px]"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask me a question…"
              disabled={responseLoading}
              rows={1}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-2xl px-4 py-2 bg-[#36517d] disabled:opacity-40 text-white self-end cursor-pointer"
              disabled={!input.trim() || responseLoading}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Messages container */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto space-y-3 py-2 pr-4"
            style={{ overscrollBehavior: "contain", overflowAnchor: "none" }}
          >
            {messages.map((m, i) => {
              if (m.role === "assistant") {
                return (
                  <div key={i} className="w-full flex justify-center p-2 pr-0">
                    <div className="prose max-w-[100%] text-left text-gray-900 break-words overflow-wrap-anywhere">
                      <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={i} className="w-full flex justify-end p-2 pr-0">
                    <div className="inline-block p-3 rounded-2xl shadow bg-[#3c5c91] text-white max-w-[75%] break-words overflow-wrap-anywhere word-break-break-word">
                      {m.content}
                    </div>
                  </div>
                );
              }
            })}

            {typing && (
              <div className="self-start text-gray-500">Typing…</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="mt-auto flex gap-2 p-4">
            <textarea
              ref={textareaRef}
              className="flex-1 rounded-2xl border border-black text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c5c91] resize-none min-h-[40px] max-h-[120px]"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask me a question…"
              disabled={responseLoading}
              rows={1}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-2xl px-4 py-2 bg-[#36517d] disabled:opacity-40 text-white self-end cursor-pointer"
              disabled={!input.trim() || responseLoading}
            >
              Send
            </button>
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-600 text-center mt-2">{error}</div>
      )}
    </div>
  );
});

export default ChatBot;