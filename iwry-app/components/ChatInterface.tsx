"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Mic, Languages } from "lucide-react";
import { ChatMessage } from "@/types";
import { formatTime } from "@/lib/utils";

interface ChatInterfaceProps {
  conversationId: string;
  difficulty: string;
  accent: string;
  onEndConversation: () => void;
}

export default function ChatInterface({
  conversationId,
  difficulty,
  accent,
  onEndConversation,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState<{word: string, translation: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea (client-side only)
  useEffect(() => {
    // Ensure we're on the client side and the element exists
    if (typeof window === 'undefined') return;

    const textarea = inputRef.current;
    if (!textarea || !(textarea instanceof HTMLTextAreaElement)) return;

    const adjustHeight = () => {
      try {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
      } catch (error) {
        // Gracefully handle any errors during height adjustment
        console.error('Error adjusting textarea height:', error);
      }
    };

    adjustHeight();
  }, [input]);

  // Send first AI message
  useEffect(() => {
    if (messages.length === 0) {
      sendAIGreeting();
    }
  }, []);

  const sendAIGreeting = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/greeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, difficulty, accent }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([{
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error("Failed to get greeting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: input.trim(),
          difficulty,
          accent,
          history: messages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          corrections: data.corrections || [],
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, there was an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleWordClick = async (word: string) => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowTranslation({ word, translation: data.translation });
      }
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === "user";
    const words = message.content.split(" ");

    return (
      <div
        key={index}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 px-4`}
      >
        {/* AI Avatar */}
        {!isUser && (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 glow-purple-sm">
            AI
          </div>
        )}

        <div className={`max-w-[75%] ${isUser ? "order-2" : "order-1"}`}>
          {/* Message bubble */}
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-[#00d9ff]/20 border border-[#00d9ff]/50 text-foreground rounded-br-sm"
                : "bg-[#1e2433] border border-[#a855f7]/30 text-foreground rounded-bl-sm"
            }`}
          >
            <p className="text-sm leading-relaxed">
              {!isUser ? (
                <span>
                  {words.map((word, i) => (
                    <span key={i}>
                      <button
                        onClick={() => handleWordClick(word.replace(/[.,!?;:]/g, ""))}
                        className="hover:text-[#a855f7] hover:underline rounded px-0.5 transition-colors"
                      >
                        {word}
                      </button>
                      {i < words.length - 1 ? " " : ""}
                    </span>
                  ))}
                </span>
              ) : (
                message.content
              )}
            </p>
          </div>

          {/* Timestamp */}
          <p
            className={`mt-1 text-xs text-muted-foreground ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {formatTime(message.timestamp)}
          </p>

          {/* Corrections indicator */}
          {message.corrections && message.corrections.length > 0 && (
            <div className="mt-2 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 p-3 text-xs">
              <p className="font-medium text-[#10b981] mb-2 flex items-center gap-1">
                <span className="text-base">✓</span> Grammar Check:
              </p>
              {message.corrections.map((correction, i) => (
                <div key={i} className="text-foreground mt-1">
                  <span className="line-through text-[#ef4444]">{correction.mistake}</span>
                  {" → "}
                  <span className="font-medium text-[#10b981]">{correction.correction}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-[#0f1419]">
      {/* Chat Header */}
      <div className="border-b border-border bg-[#1e2433] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] flex items-center justify-center text-white text-sm font-bold glow-purple-sm">
              AI
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Portuguese Practice</h2>
              <p className="text-xs text-muted-foreground capitalize">
                {difficulty} • {accent.replace("-", " ")}
              </p>
            </div>
          </div>
          <button
            onClick={onEndConversation}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground border border-border hover:border-[#ef4444]/50 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-300"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#0f1419] py-4">
        {messages.map(renderMessage)}

        {isLoading && (
          <div className="flex justify-start mb-4 px-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 glow-purple-sm">
              AI
            </div>
            <div className="max-w-[75%]">
              <div className="rounded-2xl rounded-bl-sm border border-[#a855f7]/30 bg-[#1e2433] px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-[#a855f7] animate-typing-1"></div>
                    <div className="h-2 w-2 rounded-full bg-[#a855f7] animate-typing-2"></div>
                    <div className="h-2 w-2 rounded-full bg-[#a855f7] animate-typing-3"></div>
                  </div>
                  <span className="text-sm">Typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Translation Tooltip */}
      {showTranslation && (
        <div className="border-t border-border bg-[#a855f7]/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#a855f7]/20 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7]">
                <Languages className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#a855f7]">
                  {showTranslation.word}
                </p>
                <p className="text-sm text-foreground">{showTranslation.translation}</p>
              </div>
            </div>
            <button
              onClick={() => setShowTranslation(null)}
              className="text-muted-foreground hover:text-[#ef4444] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-[#1e2433] px-4 py-3">
        <form onSubmit={sendMessage} className="flex items-end gap-3">
          {/* Keyboard icon */}
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="2" />
              <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Type in Portuguese..."
            rows={1}
            className="flex-1 resize-none rounded-full border border-border bg-[#0f1419] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#00d9ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00d9ff]/20"
            style={{ maxHeight: "100px" }}
          />

          {/* SPEAK button */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ec4899] to-[#d946ef] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#ec4899]/30 hover:shadow-xl hover:shadow-[#ec4899]/40 transition-all duration-300"
          >
            <Mic className="h-4 w-4" />
            SPEAK
            <Mic className="h-4 w-4" />
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] text-[#0f1419] hover:shadow-lg hover:shadow-[#00d9ff]/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>

          {/* Translate icon */}
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-[#a855f7] transition-colors"
          >
            <Languages className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
