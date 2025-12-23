"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  RotateCw,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Trophy,
} from "lucide-react";

interface Correction {
  id: string;
  mistake: string;
  correction: string;
  explanation: string;
  grammar_category: string;
  confidence_score: number;
  difficulty_level: string;
  times_practiced: number | null;
  mastery_status: string | null;
  next_review_date: string | null;
}

interface FlashcardReviewProps {
  corrections: Correction[];
}

export default function FlashcardReview({ corrections }: FlashcardReviewProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!corrections || corrections.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push("/corrections")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Corrections
          </button>
        </div>
        <div className="rounded-2xl border border-border bg-[#1e2433] p-12 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center glow-green">
            <CheckCircle className="h-8 w-8 text-[#10b981]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            No Flashcards Available
          </h2>
          <p className="text-muted-foreground mb-6">
            You've mastered all your corrections! Start a new practice session to learn more.
          </p>
          <button
            onClick={() => router.push("/practice")}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] px-6 py-3 font-semibold text-[#0f1419] shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40 transition-all duration-300"
          >
            Start Practicing
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const currentCard = corrections[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (wasCorrect: boolean) => {
    try {
      setError(null);

      // Update the correction's practice status
      const response = await fetch("/api/corrections/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correctionId: currentCard.id,
          wasCorrect,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      if (wasCorrect) {
        setCorrectCount(correctCount + 1);
      } else {
        setIncorrectCount(incorrectCount + 1);
      }

      // Move to next card
      if (currentIndex < corrections.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Failed to record practice:", error);
      setError("Failed to save your progress. Your answer was not recorded.");
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsComplete(false);
    setError(null);
  };

  const categoryColors: Record<string, string> = {
    verb_conjugation: "from-[#00d9ff] to-[#00b8d9]",
    gender_agreement: "from-[#ec4899] to-[#d946ef]",
    prepositions: "from-[#a855f7] to-[#9333ea]",
    subjunctive_mood: "from-[#f97316] to-[#ea580c]",
    word_choice: "from-[#10b981] to-[#059669]",
    pronunciation: "from-[#fbbf24] to-[#f59e0b]",
    formal_informal: "from-[#6366f1] to-[#4f46e5]",
    verb_tenses: "from-[#8b5cf6] to-[#7c3aed]",
    pronouns: "from-[#14b8a6] to-[#0d9488]",
    article_usage: "from-[#f59e0b] to-[#d97706]",
    word_order: "from-[#ef4444] to-[#dc2626]",
    other: "from-[#64748b] to-[#475569]",
  };

  if (isComplete) {
    const accuracy = Math.round((correctCount / corrections.length) * 100);

    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-[#10b981]/30 bg-gradient-to-br from-[#10b981]/10 via-[#00d9ff]/10 to-[#a855f7]/10 p-12 text-center">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center glow-green">
            <Trophy className="h-10 w-10 text-[#10b981]" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Review Complete! 🎉
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 mb-8 max-w-2xl mx-auto">
            <div className="rounded-xl border border-border bg-[#1e2433] p-4">
              <p className="text-sm text-muted-foreground mb-1">Cards Reviewed</p>
              <p className="text-3xl font-bold text-foreground">{corrections.length}</p>
            </div>
            <div className="rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 p-4">
              <p className="text-sm text-[#10b981] mb-1">Correct</p>
              <p className="text-3xl font-bold text-[#10b981]">{correctCount}</p>
            </div>
            <div className="rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/10 p-4">
              <p className="text-sm text-[#ef4444] mb-1">Review Again</p>
              <p className="text-3xl font-bold text-[#ef4444]">{incorrectCount}</p>
            </div>
          </div>
          <div className="mb-8">
            <p className="text-lg text-muted-foreground mb-2">Accuracy</p>
            <div className="relative h-4 bg-[#1e2433] rounded-full overflow-hidden max-w-md mx-auto border border-border">
              <div
                className="h-full bg-gradient-to-r from-[#10b981] to-[#00d9ff] transition-all duration-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className="text-2xl font-bold text-[#10b981] mt-2">{accuracy}%</p>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30 px-6 py-3 font-semibold text-[#a855f7] hover:bg-[#a855f7]/20 transition-all duration-300"
            >
              <RotateCw className="h-4 w-4" />
              Review Again
            </button>
            <button
              onClick={() => router.push("/corrections")}
              className="inline-flex items-center gap-2 rounded-full bg-[#00d9ff]/10 border border-[#00d9ff]/30 px-6 py-3 font-semibold text-[#00d9ff] hover:bg-[#00d9ff]/20 transition-all duration-300"
            >
              Back to Corrections
            </button>
            <button
              onClick={() => router.push("/practice")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] px-6 py-3 font-semibold text-[#0f1419] shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40 transition-all duration-300"
            >
              Start New Practice
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/corrections")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Corrections
        </button>
        <div className="text-sm font-medium text-muted-foreground">
          Card {currentIndex + 1} of {corrections.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-[#1e2433] rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-[#00d9ff] to-[#a855f7] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / corrections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div
          onClick={handleFlip}
          className="relative min-h-[400px] cursor-pointer perspective-1000"
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            {/* Front of card - Show the mistake */}
            <div
              className={`absolute w-full h-full backface-hidden ${
                isFlipped ? "hidden" : "block"
              }`}
            >
              <div className={`rounded-2xl border-2 bg-gradient-to-br ${categoryColors[currentCard.grammar_category] || categoryColors.other} p-1 glow-cyan`}>
                <div className="rounded-xl bg-[#0f1419] p-8 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                  <div className="mb-4 inline-block rounded-full px-4 py-1 text-xs font-medium bg-[#1e2433] border border-border text-muted-foreground capitalize">
                    {currentCard.grammar_category.replace(/_/g, " ")}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">What's wrong with this?</p>
                  <p className="text-2xl font-medium text-foreground mb-6">
                    {currentCard.mistake}
                  </p>
                  <div className="mt-auto pt-6">
                    <p className="text-sm text-[#00d9ff] flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Tap to reveal the answer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back of card - Show the correction and explanation */}
            <div
              className={`absolute w-full h-full backface-hidden ${
                isFlipped ? "block" : "hidden"
              }`}
            >
              <div className={`rounded-2xl border-2 bg-gradient-to-br ${categoryColors[currentCard.grammar_category] || categoryColors.other} p-1 glow-purple`}>
                <div className="rounded-xl bg-[#0f1419] p-8 h-full min-h-[400px]">
                  <div className="mb-6">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-xs font-medium text-[#ef4444] mt-1">✗</span>
                      <p className="text-lg text-[#ef4444] line-through">
                        {currentCard.mistake}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-[#10b981] mt-1">✓</span>
                      <p className="text-xl font-semibold text-[#10b981]">
                        {currentCard.correction}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/30 p-4">
                    <p className="text-xs font-medium text-[#00d9ff] mb-2 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Explanation
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {currentCard.explanation}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="capitalize">
                      {currentCard.difficulty_level} level
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= currentCard.confidence_score
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
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isFlipped && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleRating(false)}
            className="flex items-center gap-2 rounded-full bg-[#ef4444]/10 border-2 border-[#ef4444]/30 px-8 py-4 font-semibold text-[#ef4444] hover:bg-[#ef4444]/20 transition-all duration-300 hover:scale-105"
          >
            <XCircle className="h-5 w-5" />
            Need More Practice
          </button>
          <button
            onClick={() => handleRating(true)}
            className="flex items-center gap-2 rounded-full bg-[#10b981]/10 border-2 border-[#10b981]/30 px-8 py-4 font-semibold text-[#10b981] hover:bg-[#10b981]/20 transition-all duration-300 hover:scale-105"
          >
            <CheckCircle className="h-5 w-5" />
            Got It Right!
          </button>
        </div>
      )}

      {!isFlipped && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Try to recall the correct form before flipping
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 p-4 text-center">
          <p className="text-sm text-[#ef4444] font-medium">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Arrows */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setIsFlipped(false);
            }
          }}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          onClick={() => {
            if (currentIndex < corrections.length - 1) {
              setCurrentIndex(currentIndex + 1);
              setIsFlipped(false);
            }
          }}
          disabled={currentIndex === corrections.length - 1}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
