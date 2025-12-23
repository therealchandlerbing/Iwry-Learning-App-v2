"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { DifficultyLevel, PortugueseAccent } from "@/types";
import { SessionAnalysis } from "@/lib/gemini";
import { Sparkles, Trophy, Lightbulb, X, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

export default function PracticePage() {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [accent, setAccent] = useState<PortugueseAccent>("sao-paulo");
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");
  const [analysis, setAnalysis] = useState<SessionAnalysis | null>(null);

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
        setAnalysis(data.analysis);
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

  // Save session to learning log
  const saveToLearningLog = () => {
    if (analysis) {
      try {
        const existingSessions = JSON.parse(localStorage.getItem("iwry_learning_sessions") || "[]");
        const newSession = {
          id: conversationId || Date.now().toString(),
          date: new Date().toISOString(),
          level: difficulty,
          summary: summary || analysis.performanceSummary || "Practice session completed",
          vocabCount: analysis.vocabularyLearned?.length || 0,
          feedback: analysis.performanceSummary,
          vocabularyLearned: analysis.vocabularyLearned?.slice(0, 5),
          nextStep: analysis.recommendedNextSteps?.[0] || "Continue practicing to improve your fluency!",
        };
        const updatedSessions = [newSession, ...existingSessions].slice(0, 30);
        localStorage.setItem("iwry_learning_sessions", JSON.stringify(updatedSessions));
      } catch (error) {
        console.error("Failed to save to learning log:", error);
      }
    }
  };

  // Summary Screen - Modal Style
  if (showSummary) {
    // Save to learning log when summary is shown
    if (analysis && conversationId) {
      saveToLearningLog();
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-[#1e2433] overflow-hidden shadow-2xl">
          {/* Modal Header - Green */}
          <div className="bg-[#10b981] p-6 relative">
            <button
              onClick={finishSession}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Mandou bem!</h2>
                <p className="text-white/80 text-sm">Session Summary</p>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Iwry's Feedback */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#fbbf24]" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Iwry's Feedback
                </h3>
              </div>
              <div className="rounded-lg bg-[#0f1419] border border-border p-4">
                <p className="text-foreground text-sm leading-relaxed">
                  "{summary || analysis?.performanceSummary || "Great effort today! Keep practicing to improve your fluency."}"
                </p>
              </div>
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* New Vocabulary */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    New Vocabulary
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis?.vocabularyLearned?.slice(0, 5).map((vocab: any, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-sm border border-[#10b981]/30"
                    >
                      {vocab.word}
                    </span>
                  ))}
                  {(!analysis?.vocabularyLearned || analysis.vocabularyLearned.length === 0) && (
                    <span className="text-sm text-muted-foreground">Keep practicing!</span>
                  )}
                </div>
              </div>

              {/* Next Step */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-4 w-4 text-[#00d9ff]" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Next Step
                  </h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {analysis?.recommendedNextSteps?.[0] || "Continue practicing to build your vocabulary and improve fluency."}
                </p>
              </div>
            </div>

            {/* Go to Dashboard Button */}
            <button
              onClick={finishSession}
              className="w-full rounded-lg bg-[#0f1419] border border-border px-4 py-3 font-semibold text-foreground hover:border-[#10b981]/50 hover:bg-[#10b981]/10 transition-all flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
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
        <div className="rounded-2xl border border-border bg-[#1e2433] p-8">
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
                    className={`rounded-lg border-2 px-4 py-3 text-center font-medium capitalize transition-all duration-300 ${
                      difficulty === level
                        ? "border-[#00d9ff] bg-[#00d9ff]/10 text-[#00d9ff] glow-cyan-sm"
                        : "border-border bg-[#0f1419] text-foreground hover:border-[#00d9ff]/50"
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
                    className={`rounded-lg border-2 px-4 py-3 text-center font-medium transition-all duration-300 ${
                      accent === option.value
                        ? "border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7] glow-purple-sm"
                        : "border-border bg-[#0f1419] text-foreground hover:border-[#a855f7]/50"
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
              className="w-full rounded-lg bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] px-4 py-4 text-lg font-semibold text-[#0f1419] shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Begin Lesson
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-[#a855f7]" />
              <h3 className="font-semibold text-[#a855f7]">Quick Tips</h3>
            </div>
            <ul className="text-sm text-foreground space-y-1">
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
        <div className="h-full rounded-t-2xl md:rounded-2xl overflow-hidden border border-border bg-[#0f1419]">
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
