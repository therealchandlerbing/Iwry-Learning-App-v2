"use client";

import { useState, useEffect } from "react";
import { FileText, ChevronRight, BookOpen, X, Trophy, Lightbulb, Sparkles } from "lucide-react";

const MAX_SESSIONS = 30;

interface SessionEntry {
  id: string;
  date: string;
  level: string;
  summary: string;
  vocabCount: number;
  feedback?: string;
  vocabularyLearned?: Array<{
    word: string;
    translation: string;
  }>;
  nextStep?: string;
}

export default function LearningLogPage() {
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<SessionEntry | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      // First try to load from localStorage
      const localSessions = localStorage.getItem("iwry_learning_sessions");
      if (localSessions) {
        const parsed = JSON.parse(localSessions);
        setSessions(parsed);
      }

      // Then try to fetch from API to sync
      const response = await fetch("/api/session/history");
      if (response.ok) {
        const data = await response.json();
        if (data.sessions && data.sessions.length > 0) {
          // Merge with local storage, keeping last 30
          const merged = [...data.sessions].slice(0, MAX_SESSIONS);
          setSessions(merged);
          localStorage.setItem("iwry_learning_sessions", JSON.stringify(merged));
        }
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
      // Fall back to local storage only
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30",
      intermediate: "bg-[#f97316]/20 text-[#f97316] border-[#f97316]/30",
      advanced: "bg-[#a855f7]/20 text-[#a855f7] border-[#a855f7]/30",
    };
    return colors[level.toLowerCase()] || colors.beginner;
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#1e2433] border border-border flex items-center justify-center">
            <FileText className="h-8 w-8 text-[#10b981]" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Learning Log
          </h1>
          <p className="text-muted-foreground">
            Seu histórico de evolução arquivado.
          </p>
        </div>

        {/* Sessions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-[#1e2433] p-6 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-full bg-[#2d3548]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-[#2d3548] rounded" />
                    <div className="h-4 w-full bg-[#2d3548] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className="w-full text-left rounded-2xl border border-border bg-[#1e2433] p-5 hover:border-[#10b981]/50 hover:bg-[#1e2433]/80 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox/Radio style indicator */}
                  <div className="h-6 w-6 rounded-full border-2 border-border group-hover:border-[#10b981]/50 transition-colors" />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(session.date)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border uppercase ${getLevelColor(session.level)}`}>
                        {session.level}
                      </span>
                    </div>
                    <p className="text-foreground truncate">
                      {session.summary}
                    </p>
                  </div>

                  {/* Vocab Count */}
                  {session.vocabCount > 0 && (
                    <span className="text-sm font-medium text-[#10b981] whitespace-nowrap">
                      +{session.vocabCount} VOCAB
                    </span>
                  )}

                  {/* Arrow */}
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#10b981] transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-[#1e2433] border border-border flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No sessions yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start practicing to see your learning history here.
            </p>
            <a
              href="/practice"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold shadow-lg shadow-[#10b981]/30 hover:shadow-xl hover:shadow-[#10b981]/40 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              Start Practicing
            </a>
          </div>
        )}

        {/* Footer Note */}
        {sessions.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Armazenamos suas últimas 30 sessões localmente.
            </p>
          </div>
        )}

        {/* Session Detail Modal */}
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-[#1e2433] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-[#10b981] p-6 relative">
                <button
                  onClick={() => setSelectedSession(null)}
                  aria-label="Close session details"
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Mandou bem!</h2>
                    <p className="text-white/80 text-sm">Session Summary</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Feedback */}
                {selectedSession.feedback && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-[#fbbf24]" />
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Iwry's Feedback
                      </h3>
                    </div>
                    <div className="rounded-lg bg-[#0f1419] border border-border p-4">
                      <p className="text-foreground text-sm leading-relaxed">
                        "{selectedSession.feedback}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Two Column Section */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Vocabulary */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-[#10b981]" />
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        New Vocabulary
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSession.vocabularyLearned?.slice(0, 5).map((vocab, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-sm border border-[#10b981]/30"
                        >
                          {vocab.word}
                        </span>
                      ))}
                      {(!selectedSession.vocabularyLearned || selectedSession.vocabularyLearned.length === 0) && (
                        <span className="text-sm text-muted-foreground">No new vocabulary</span>
                      )}
                    </div>
                  </div>

                  {/* Next Step */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-[#00d9ff]" />
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Next Step
                      </h3>
                    </div>
                    <p className="text-sm text-foreground">
                      {selectedSession.nextStep || "Continue practicing to improve your fluency!"}
                    </p>
                  </div>
                </div>

                {/* Go to Dashboard Button */}
                <button
                  onClick={() => setSelectedSession(null)}
                  className="w-full rounded-lg bg-[#0f1419] border border-border px-4 py-3 font-semibold text-foreground hover:border-[#10b981]/50 hover:bg-[#10b981]/10 transition-all flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
