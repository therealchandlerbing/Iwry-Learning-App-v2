"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, X } from "lucide-react";
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
        <div className={`max-w-[75%] ${isUser ? "order-2" : "order-1"}`}>
          {/* Message bubble */}
          <div
            className={`rounded-2xl px-4 py-2.5 ${
              isUser
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-white border border-border text-foreground rounded-bl-sm"
            }`}
          >
            <p className="text-sm leading-relaxed">
              {!isUser ? (
                <span>
                  {words.map((word, i) => (
                    <span key={i}>
                      <button
                        onClick={() => handleWordClick(word.replace(/[.,!?;:]/g, ""))}
                        className="hover:underline hover:bg-yellow-100/50 rounded px-0.5 transition-colors"
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
            <div className="mt-2 rounded-lg bg-yellow-50 border border-yellow-200 p-2 text-xs">
              <p className="font-medium text-yellow-800 mb-1">
                💡 Corrections available
              </p>
              {message.corrections.map((correction, i) => (
                <div key={i} className="text-yellow-700 mt-1">
                  <span className="line-through">{correction.mistake}</span>
                  {" → "}
                  <span className="font-medium">{correction.correction}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="border-b border-border bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Portuguese Practice</h2>
            <p className="text-xs text-muted-foreground capitalize">
              {difficulty} • {accent.replace("-", " ")}
            </p>
          </div>
          <button
            onClick={onEndConversation}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-green-50/30 to-green-50/10 py-4">
        {messages.map(renderMessage)}

        {isLoading && (
          <div className="flex justify-start mb-4 px-4">
            <div className="max-w-[75%]">
              <div className="rounded-2xl rounded-bl-sm border border-border bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
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
        <div className="border-t border-border bg-blue-50 px-4 py-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                {showTranslation.word}
              </p>
              <p className="text-sm text-blue-700">{showTranslation.translation}</p>
            </div>
            <button
              onClick={() => setShowTranslation(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-white px-4 py-3">
        <form onSubmit={sendMessage} className="flex items-end gap-2">
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
            className="flex-1 resize-none rounded-full border border-input bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            style={{ maxHeight: "100px" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-[#00852f] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
