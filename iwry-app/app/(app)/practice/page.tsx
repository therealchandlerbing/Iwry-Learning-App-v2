"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { DifficultyLevel, PortugueseAccent } from "@/types";

export default function PracticePage() {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [accent, setAccent] = useState<PortugueseAccent>("sao-paulo");
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    // Load user preferences
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const data = await response.json();
        setDifficulty(data.difficultyLevel || "beginner");
        setAccent(data.preferredAccent || "sao-paulo");
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const startConversation = async () => {
    try {
      const response = await fetch("/api/conversations/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, accent }),
      });

      const data = await response.json();

      if (response.ok) {
        setConversationId(data.conversationId);
        setIsStarted(true);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const endConversation = async () => {
    if (!conversationId) return;

    try {
      const response = await fetch("/api/conversations/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
        setShowSummary(true);
      }
    } catch (error) {
      console.error("Failed to end conversation:", error);
      // Still show summary screen
      setShowSummary(true);
    }
  };

  const finishSession = () => {
    router.push("/dashboard");
  };

  // Summary Screen
  if (showSummary) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-4xl">
              ✅
            </div>
            <h2 className="text-2xl font-bold text-foreground">Great job!</h2>
            <p className="mt-2 text-muted-foreground">
              You've completed a Portuguese practice session
            </p>
          </div>

          {summary && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
              <h3 className="font-semibold text-green-900 mb-2">Session Summary</h3>
              <p className="text-sm text-green-800 whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={finishSession}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-[#00852f] transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                setIsStarted(false);
                setShowSummary(false);
                setConversationId(null);
                startConversation();
              }}
              className="w-full rounded-lg border-2 border-border bg-white px-4 py-3 font-semibold text-foreground hover:border-primary transition-colors"
            >
              Start Another Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Setup Screen
  if (!isStarted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Start Practicing</h1>
            <p className="mt-2 text-muted-foreground">
              Choose your settings and begin a conversation
            </p>
          </div>

          <div className="space-y-6">
            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["beginner", "intermediate", "advanced"] as DifficultyLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`rounded-lg border-2 px-4 py-3 text-center font-medium capitalize transition-all ${
                      difficulty === level
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-white text-foreground hover:border-primary/50"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {difficulty === "beginner" && "Simple vocabulary, clear grammar, full sentences"}
                {difficulty === "intermediate" && "Common abbreviations, Brazilian slang, mixed formality"}
                {difficulty === "advanced" && "Professional vocabulary, complex structures, cultural references"}
              </p>
            </div>

            {/* Accent Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Portuguese Accent
              </label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "sao-paulo", label: "São Paulo" },
                  { value: "rio", label: "Rio de Janeiro" },
                  { value: "northeast", label: "Northeast" },
                  { value: "portugal", label: "European" },
                ] as Array<{value: PortugueseAccent, label: string}>).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAccent(option.value)}
                    className={`rounded-lg border-2 px-4 py-3 text-center font-medium transition-all ${
                      accent === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-white text-foreground hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {accent === "sao-paulo" && "Professional, clear pronunciation with Italian influence"}
                {accent === "rio" && "Relaxed pronunciation, softer 's' sounds (Carioca)"}
                {accent === "northeast" && "Distinct intonation, regional vocabulary"}
                {accent === "portugal" && "European Portuguese with formal structures"}
              </p>
            </div>

            {/* Start Button */}
            <button
              onClick={startConversation}
              className="w-full rounded-lg bg-primary px-4 py-4 text-lg font-semibold text-primary-foreground hover:bg-[#00852f] transition-colors shadow-lg hover:shadow-xl"
            >
              Start Conversation 💬
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tap any Portuguese word for instant translation</li>
              <li>• Mistakes are automatically tracked for review</li>
              <li>• Be natural - make mistakes and learn from them!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Chat Screen
  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      <div className="mx-auto h-full max-w-4xl">
        <div className="h-full rounded-t-2xl md:rounded-2xl overflow-hidden border border-border bg-white shadow-lg">
          {conversationId && (
            <ChatInterface
              conversationId={conversationId}
              difficulty={difficulty}
              accent={accent}
              onEndConversation={endConversation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
