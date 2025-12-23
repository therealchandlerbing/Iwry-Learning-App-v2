"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Search, BookOpen, Filter, X } from "lucide-react";
import StatCard from "@/components/StatCard";

interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  context: string | null;
  difficulty_level: string;
  created_at: string;
}

interface VocabularyClientProps {
  vocabulary: VocabularyWord[];
}

export default function VocabularyClient({ vocabulary }: VocabularyClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const filteredVocabulary = vocabulary.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "all" || word.difficulty_level === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

  const difficultyCount = {
    beginner: vocabulary.filter((w) => w.difficulty_level === "beginner").length,
    intermediate: vocabulary.filter((w) => w.difficulty_level === "intermediate")
      .length,
    advanced: vocabulary.filter((w) => w.difficulty_level === "advanced").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Vocabulary Library</h1>
        <p className="mt-2 text-muted-foreground">
          Browse and review all the Portuguese words you've learned
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Words"
          value={vocabulary.length}
          icon={BookOpen}
          color="bg-[#00d9ff]/10 text-[#00d9ff] border-[#00d9ff]/30"
        />
        <StatCard
          label="Beginner"
          value={difficultyCount.beginner}
          icon={BookOpen}
          color="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
        />
        <StatCard
          label="Intermediate"
          value={difficultyCount.intermediate}
          icon={BookOpen}
          color="bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30"
        />
        <StatCard
          label="Advanced"
          value={difficultyCount.advanced}
          icon={BookOpen}
          color="bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30"
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search words or translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-[#1e2433] pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00d9ff]/50 focus:border-[#00d9ff]/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setDifficultyFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              difficultyFilter === "all"
                ? "bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/50"
                : "bg-[#1e2433] text-muted-foreground border border-border hover:border-[#00d9ff]/30"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDifficultyFilter("beginner")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              difficultyFilter === "beginner"
                ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50"
                : "bg-[#1e2433] text-muted-foreground border border-border hover:border-[#10b981]/30"
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setDifficultyFilter("intermediate")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              difficultyFilter === "intermediate"
                ? "bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/50"
                : "bg-[#1e2433] text-muted-foreground border border-border hover:border-[#f97316]/30"
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setDifficultyFilter("advanced")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              difficultyFilter === "advanced"
                ? "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/50"
                : "bg-[#1e2433] text-muted-foreground border border-border hover:border-[#ef4444]/30"
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredVocabulary.length} of {vocabulary.length} words
      </div>

      {/* Vocabulary List */}
      {filteredVocabulary.length === 0 ? (
        <div className="rounded-2xl border border-border bg-[#1e2433] p-12 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#00d9ff]/10 border border-[#00d9ff]/30 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-[#00d9ff]" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {vocabulary.length === 0
              ? "No vocabulary yet!"
              : "No words match your search"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {vocabulary.length === 0
              ? "Start practicing to build your vocabulary"
              : "Try adjusting your filters or search term"}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVocabulary.map((word) => (
            <div
              key={word.id}
              className="rounded-xl border border-border bg-[#1e2433] p-4 hover:border-border-glow transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {word.word}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {word.translation}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                    word.difficulty_level === "beginner"
                      ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                      : word.difficulty_level === "intermediate"
                      ? "bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30"
                      : "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30"
                  }`}
                >
                  {word.difficulty_level}
                </span>
              </div>

              {word.context && (
                <div className="rounded-lg bg-[#00d9ff]/5 border border-[#00d9ff]/20 p-2 mb-2">
                  <p className="text-xs text-muted-foreground italic">
                    "{word.context}"
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Learned {formatDate(word.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
