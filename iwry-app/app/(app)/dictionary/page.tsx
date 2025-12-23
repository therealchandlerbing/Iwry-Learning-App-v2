"use client";

import { useState } from "react";
import { Search, Volume2, Heart, ArrowRight, Sparkles, Info, Languages } from "lucide-react";

interface DictionaryEntry {
  portugueseWord: string;
  englishWord: string;
  partOfSpeech: string;
  gender?: string;
  pronunciation?: string;
  definition: string;
  usageNote?: string;
  conjugations?: {
    present?: string;
    past?: string;
    future?: string;
  };
  examples: Array<{
    portuguese: string;
    english: string;
  }>;
}

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setEntry(null);

    try {
      const response = await fetch("/api/dictionary/english-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: searchTerm.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setEntry(data);
        setIsFavorited(false);
      } else {
        setError(data.error || "Failed to find word");
      }
    } catch (err) {
      console.error("Dictionary lookup error:", err);
      setError("Failed to lookup word. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getPartOfSpeechColor = (pos: string) => {
    const colors: Record<string, string> = {
      noun: "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30",
      verb: "bg-[#a855f7]/20 text-[#a855f7] border-[#a855f7]/30",
      adjective: "bg-[#f97316]/20 text-[#f97316] border-[#f97316]/30",
      adverb: "bg-[#ec4899]/20 text-[#ec4899] border-[#ec4899]/30",
      preposition: "bg-[#00d9ff]/20 text-[#00d9ff] border-[#00d9ff]/30",
      default: "bg-[#64748b]/20 text-[#64748b] border-[#64748b]/30",
    };
    return colors[pos.toLowerCase()] || colors.default;
  };

  const getGenderColor = (gender: string) => {
    if (gender.toLowerCase().includes("feminine") || gender.toLowerCase().includes("feminino")) {
      return "bg-[#ec4899]/20 text-[#ec4899] border-[#ec4899]/30";
    }
    return "bg-[#00d9ff]/20 text-[#00d9ff] border-[#00d9ff]/30";
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Languages className="h-8 w-8 text-[#10b981]" />
            <h1 className="text-3xl font-bold text-foreground">
              Dicionario Ingles-Portugues
            </h1>
          </div>
          <p className="text-muted-foreground">
            Find the perfect Brazilian Portuguese equivalent for any English word.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center rounded-full border-2 border-border bg-[#1e2433] overflow-hidden transition-all duration-300 focus-within:border-[#10b981]/50 focus-within:shadow-lg focus-within:shadow-[#10b981]/10">
              <div className="pl-5 text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter an English word..."
                className="flex-1 bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !searchTerm.trim()}
                className="h-12 w-12 mr-2 flex items-center justify-center rounded-full bg-[#10b981] text-white hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 p-4">
            <p className="text-[#ef4444] text-center">{error}</p>
          </div>
        )}

        {/* Results */}
        {entry && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Main Word Card */}
            <div className="rounded-2xl border border-border bg-[#1e2433] p-6">
              <div className="flex items-start justify-between">
                {/* Left: Portuguese Word */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h2 className="text-4xl font-bold text-foreground">
                      {entry.portugueseWord}
                    </h2>
                    <button
                      onClick={() => speakWord(entry.portugueseWord)}
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/20 transition-all"
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={`h-10 w-10 flex items-center justify-center rounded-full border transition-all ${
                        isFavorited
                          ? "bg-[#ec4899]/20 border-[#ec4899]/50 text-[#ec4899]"
                          : "bg-transparent border-border text-muted-foreground hover:border-[#ec4899]/50 hover:text-[#ec4899]"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border uppercase ${getPartOfSpeechColor(entry.partOfSpeech)}`}>
                      {entry.partOfSpeech}
                    </span>
                    {entry.gender && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border uppercase ${getGenderColor(entry.gender)}`}>
                        {entry.gender}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: English Source */}
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    English Source
                  </p>
                  <p className="text-2xl font-semibold text-[#10b981]">
                    {entry.englishWord}
                  </p>
                </div>
              </div>
            </div>

            {/* Definition & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Significado & Notas */}
              <div className="rounded-2xl border border-border bg-[#1e2433] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-[#10b981]" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Significado & Notas
                  </h3>
                </div>
                <p className="text-foreground mb-4 leading-relaxed">
                  {entry.definition}
                </p>
                {entry.usageNote && (
                  <div className="rounded-lg bg-[#0f1419] border border-border p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground italic">
                        {entry.usageNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Conjugation or No Conjugation */}
              <div className="rounded-2xl border border-border bg-[#1e2433] p-6">
                {entry.conjugations && (entry.conjugations.present || entry.conjugations.past || entry.conjugations.future) ? (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <Languages className="h-5 w-5 text-[#a855f7]" />
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Conjugacao
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {entry.conjugations.present && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Presente</p>
                          <p className="text-foreground font-medium">{entry.conjugations.present}</p>
                        </div>
                      )}
                      {entry.conjugations.past && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Passado</p>
                          <p className="text-foreground font-medium">{entry.conjugations.past}</p>
                        </div>
                      )}
                      {entry.conjugations.future && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Futuro</p>
                          <p className="text-foreground font-medium">{entry.conjugations.future}</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-4">
                    <Languages className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Sem Conjugacao
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Esta palavra nao e um verbo conjugavel.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Examples */}
            {entry.examples && entry.examples.length > 0 && (
              <div className="rounded-2xl border border-border bg-[#1e2433] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-[#f97316]" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Exemplos de Uso
                  </h3>
                </div>
                <div className="space-y-4">
                  {entry.examples.map((example, index) => (
                    <div key={index} className="border-l-2 border-[#f97316]/50 pl-4">
                      <p className="text-foreground font-medium mb-1">
                        {example.portuguese}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ({example.english})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!entry && !error && !isLoading && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center">
              <Search className="h-10 w-10 text-[#10b981]/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Search for a word
            </h3>
            <p className="text-muted-foreground">
              Enter an English word above to find its Portuguese translation, definition, and examples.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
