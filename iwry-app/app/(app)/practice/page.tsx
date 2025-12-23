"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { DifficultyLevel, PortugueseAccent } from "@/types";
import { SessionAnalysis } from "@/lib/gemini";
import { Sparkles, Trophy, Lightbulb } from "lucide-react";

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

  // Summary Screen
  if (showSummary) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-border bg-[#1e2433] p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center glow-green">
              <Trophy className="h-8 w-8 text-[#10b981]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Excellent Work!</h2>
            <p className="mt-2 text-muted-foreground">
              You've completed a Portuguese practice session
            </p>
          </div>

          {/* Performance Summary */}
          {summary && (
            <div className="mb-6 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 p-4">
              <h3 className="font-semibold text-[#10b981] mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Performance Summary
              </h3>
              <p className="text-sm text-foreground whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          {/* Enhanced Analysis */}
          {analysis && (
            <div className="space-y-4 mb-6">
              {/* Topics Discussed */}
              {analysis.topicsDiscussed && analysis.topicsDiscussed.length > 0 && (
                <div className="rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/30 p-4">
                  <h3 className="font-semibold text-[#00d9ff] mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topicsDiscussed.map((topic: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-[#00d9ff]/20 text-[#00d9ff] text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar Points */}
              {analysis.grammarPoints && analysis.grammarPoints.length > 0 && (
                <div className="rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 p-4">
                  <h3 className="font-semibold text-[#a855f7] mb-3">
                    Grammar Practiced
                  </h3>
                  <div className="space-y-2">
                    {analysis.grammarPoints.map((point: any, i: number) => (
                      <div key={i}>
                        <p className="text-sm font-medium text-foreground capitalize">
                          {point.category}
                        </p>
                        <ul className="ml-4 text-xs text-muted-foreground">
                          {point.examples.map((ex: string, j: number) => (
                            <li key={j}>• {ex}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary Learned */}
              {analysis.vocabularyLearned && analysis.vocabularyLearned.length > 0 && (
                <div className="rounded-lg bg-[#ec4899]/10 border border-[#ec4899]/30 p-4">
                  <h3 className="font-semibold text-[#ec4899] mb-3">
                    New Vocabulary ({analysis.vocabularyLearned.length} words)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysis.vocabularyLearned.slice(0, 6).map((vocab: any, i: number) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium text-foreground">{vocab.word}</span>
                        <span className="text-muted-foreground"> - {vocab.translation}</span>
                      </div>
                    ))}
                  </div>
                  {analysis.vocabularyLearned.length > 6 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      + {analysis.vocabularyLearned.length - 6} more words saved to your vocabulary
                    </p>
                  )}
                </div>
              )}

              {/* Recommended Next Steps */}
              {analysis.recommendedNextSteps && analysis.recommendedNextSteps.length > 0 && (
                <div className="rounded-lg bg-[#f97316]/10 border border-[#f97316]/30 p-4">
                  <h3 className="font-semibold text-[#f97316] mb-2">
                    What to Focus On Next
                  </h3>
                  <ul className="space-y-1 text-sm text-foreground">
                    {analysis.recommendedNextSteps.map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#f97316] mt-0.5">→</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={finishSession}
              className="w-full rounded-lg bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] px-4 py-3 font-semibold text-[#0f1419] shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40 transition-all duration-300"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                setIsStarted(false);
                setShowSummary(false);
                setConversationId(null);
                setAnalysis(null);
                startConversation();
              }}
              className="w-full rounded-lg border border-border bg-[#1e2433] px-4 py-3 font-semibold text-foreground hover:border-[#00d9ff]/50 hover:bg-[#00d9ff]/10 transition-all duration-300"
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
