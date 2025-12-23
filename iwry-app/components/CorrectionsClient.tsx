"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  MessageSquare,
  CreditCard,
  CheckSquare,
  Calendar,
} from "lucide-react";
import StatCard from "@/components/StatCard";

interface Correction {
  id: string;
  mistake: string;
  correction: string;
  explanation: string;
  grammar_category: string;
  confidence_score: number;
  created_at: string;
  difficulty_level: string;
  next_review_date?: string | null;
  mastery_status?: string | null;
  times_practiced?: number | null;
  last_practiced_at?: string | null;
}

interface CorrectionsClientProps {
  initialCorrections: Correction[];
}

export default function CorrectionsClient({
  initialCorrections,
}: CorrectionsClientProps) {
  const [corrections, setCorrections] = useState<Correction[]>(initialCorrections);
  const [filter, setFilter] = useState<string>("all");

  // Group by category
  const categories: Record<string, Correction[]> = {};
  corrections.forEach((correction) => {
    const category = correction.grammar_category || "other";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(correction);
  });

  const categoryLabels: Record<string, string> = {
    verb_conjugation: "Verb Conjugation",
    gender_agreement: "Gender Agreement",
    prepositions: "Prepositions",
    subjunctive_mood: "Subjunctive Mood",
    word_choice: "Word Choice",
    pronunciation: "Pronunciation",
    formal_informal: "Formal/Informal",
    verb_tenses: "Verb Tenses",
    pronouns: "Pronouns",
    article_usage: "Article Usage",
    word_order: "Word Order",
    other: "Other",
  };

  const categoryColors: Record<string, string> = {
    verb_conjugation: "bg-[#00d9ff]/10 text-[#00d9ff] border-[#00d9ff]/30",
    gender_agreement: "bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/30",
    prepositions: "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30",
    subjunctive_mood: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30",
    word_choice: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30",
    pronunciation: "bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/30",
    formal_informal: "bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/30",
    verb_tenses: "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/30",
    pronouns: "bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/30",
    article_usage: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30",
    word_order: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30",
    other: "bg-[#64748b]/10 text-[#64748b] border-[#64748b]/30",
  };

  const handlePracticeRoute = async (
    correctionId: string,
    practiceType: string
  ) => {
    try {
      const response = await fetch("/api/corrections/practice-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correctionId,
          practiceType,
          wasCorrect: false, // Will be updated based on actual practice
        }),
      });

      if (response.ok) {
        // Update local state
        setCorrections((prev) =>
          prev.map((c) =>
            c.id === correctionId
              ? { ...c, times_practiced: (c.times_practiced || 0) + 1 }
              : c
          )
        );

        // Show feedback
        alert(`Routed to ${practiceType} practice!`);
      }
    } catch (error) {
      console.error("Failed to route practice:", error);
      alert("Failed to route practice. Please try again.");
    }
  };

  const handleMarkMastered = async (correctionId: string) => {
    try {
      const response = await fetch("/api/corrections/mark-mastered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correctionId }),
      });

      if (response.ok) {
        // Update local state
        setCorrections((prev) =>
          prev.map((c) =>
            c.id === correctionId ? { ...c, mastery_status: "mastered" } : c
          )
        );

        alert("Correction marked as mastered! 🎉");
      }
    } catch (error) {
      console.error("Failed to mark mastered:", error);
      alert("Failed to mark as mastered. Please try again.");
    }
  };

  const filteredCorrections =
    filter === "all"
      ? corrections
      : corrections.filter((c) => c.mastery_status === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Corrections Hub</h1>
        <p className="mt-2 text-muted-foreground">
          Review your mistakes and practice them to mastery
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Corrections"
          value={corrections.length}
          icon={AlertCircle}
          color="bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30"
        />
        <StatCard
          label="Learning"
          value={
            corrections.filter((c) => c.mastery_status !== "mastered").length
          }
          icon={Target}
          color="bg-[#00d9ff]/10 text-[#00d9ff] border-[#00d9ff]/30"
        />
        <StatCard
          label="Mastered"
          value={
            corrections.filter((c) => c.mastery_status === "mastered").length
          }
          icon={CheckCircle}
          color="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
        />
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === "all"
              ? "bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/50"
              : "bg-[#1e2433] text-muted-foreground border border-border hover:border-[#00d9ff]/30"
          }`}
        >
          All ({corrections.length})
        </button>
        <button
          onClick={() => setFilter("learning")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === "learning"
              ? "bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/50"
              : "bg-[#1e2433] text-muted-foreground border border-border hover:border-[#f97316]/30"
          }`}
        >
          Learning (
          {corrections.filter((c) => c.mastery_status !== "mastered").length})
        </button>
        <button
          onClick={() => setFilter("mastered")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === "mastered"
              ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50"
              : "bg-[#1e2433] text-muted-foreground border border-border hover:border-[#10b981]/30"
          }`}
        >
          Mastered (
          {corrections.filter((c) => c.mastery_status === "mastered").length})
        </button>
      </div>

      {/* Corrections List */}
      {filteredCorrections.length === 0 ? (
        <div className="rounded-2xl border border-border bg-[#1e2433] p-12 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center glow-green">
            <CheckCircle className="h-8 w-8 text-[#10b981]" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {filter === "all"
              ? "No corrections yet!"
              : filter === "mastered"
              ? "No mastered corrections yet"
              : "All corrections mastered!"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {filter === "all"
              ? "Start practicing to get personalized feedback on your Portuguese"
              : "Keep practicing to master more corrections"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(categories)
            .filter(([_, items]) =>
              filter === "all"
                ? true
                : items.some((c) => c.mastery_status === filter)
            )
            .map(([category, items]) => {
              const filteredItems =
                filter === "all"
                  ? items
                  : items.filter((c) => c.mastery_status === filter);

              if (filteredItems.length === 0) return null;

              return (
                <div key={category}>
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        categoryColors[category] || categoryColors.other
                      }`}
                    >
                      {categoryLabels[category] || category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {filteredItems.length} correction
                      {filteredItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {filteredItems.map((correction) => (
                      <div
                        key={correction.id}
                        className="rounded-xl border border-border bg-[#1e2433] p-4 hover:border-border-glow transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Mistake vs Correction */}
                            <div className="mb-3">
                              <div className="flex items-start gap-2 mb-2">
                                <span className="text-xs font-medium text-[#ef4444] mt-1">
                                  ✗
                                </span>
                                <p className="text-sm text-[#ef4444] line-through">
                                  {correction.mistake}
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-medium text-[#10b981] mt-1">
                                  ✓
                                </span>
                                <p className="text-sm font-medium text-[#10b981]">
                                  {correction.correction}
                                </p>
                              </div>
                            </div>

                            {/* Explanation */}
                            <div className="rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/30 p-3 mb-3">
                              <p className="text-xs font-medium text-[#00d9ff] mb-1 flex items-center gap-1">
                                <BookOpen className="h-3 w-3" /> Explanation
                              </p>
                              <p className="text-sm text-foreground">
                                {correction.explanation}
                              </p>
                            </div>

                            {/* Practice Routing Buttons */}
                            {correction.mastery_status !== "mastered" && (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() =>
                                    handlePracticeRoute(
                                      correction.id,
                                      "flashcard"
                                    )
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] text-xs font-medium hover:bg-[#a855f7]/20 transition-all"
                                >
                                  <CreditCard className="h-3 w-3" />
                                  Flashcard
                                </button>
                                <button
                                  onClick={() =>
                                    handlePracticeRoute(
                                      correction.id,
                                      "conversation"
                                    )
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] text-xs font-medium hover:bg-[#00d9ff]/20 transition-all"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  Use in Chat
                                </button>
                                <button
                                  onClick={() => handleMarkMastered(correction.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-xs font-medium hover:bg-[#10b981]/20 transition-all"
                                >
                                  <CheckSquare className="h-3 w-3" />
                                  Mark Mastered
                                </button>
                              </div>
                            )}

                            {correction.mastery_status === "mastered" && (
                              <div className="flex items-center gap-2 text-[#10b981] text-xs">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">Mastered!</span>
                                {correction.next_review_date && (
                                  <span className="text-muted-foreground">
                                    Next review:{" "}
                                    {formatDate(correction.next_review_date)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Metadata */}
                          <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
                            <span className="capitalize px-2 py-1 rounded bg-[#1e2433] border border-border">
                              {correction.difficulty_level}
                            </span>
                            <span>{formatDate(correction.created_at)}</span>
                            {(correction.times_practiced ?? 0) > 0 && (
                              <span className="text-[#00d9ff]">
                                Practiced: {correction.times_practiced}x
                              </span>
                            )}
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={
                                    star <= correction.confidence_score
                                      ? "text-[#fbbf24]"
                                      : "text-[#64748b]"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
