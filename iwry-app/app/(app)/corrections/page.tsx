import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { formatDate } from "@/lib/utils";
import { CheckCircle, AlertCircle, BookOpen, Target } from "lucide-react";
import StatCard from "@/components/StatCard";

export default async function CorrectionsPage() {
  const session = await auth();
  const userId = session!.user.id;

  // Get all corrections for user
  const result = await sql`
    SELECT
      c.id,
      c.mistake,
      c.correction,
      c.explanation,
      c.grammar_category,
      c.confidence_score,
      c.created_at,
      conv.difficulty_level
    FROM corrections c
    JOIN conversations conv ON c.conversation_id = conv.id
    WHERE c.user_id = ${userId}
    ORDER BY c.created_at DESC
    LIMIT 100
  `;

  const corrections = result.rows;

  // Group by category
  const categories: Record<string, any[]> = {};
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
    other: "bg-[#64748b]/10 text-[#64748b] border-[#64748b]/30",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Corrections</h1>
        <p className="mt-2 text-muted-foreground">
          Review your mistakes and learn from them
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
          label="Categories"
          value={Object.keys(categories).length}
          icon={Target}
          color="bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30"
        />
        <StatCard
          label="Most Common"
          value={
            Object.keys(categories).length > 0
              ? categoryLabels[Object.keys(categories).sort((a, b) => categories[b].length - categories[a].length)[0]]
              : "N/A"
          }
          icon={BookOpen}
          color="bg-[#00d9ff]/10 text-[#00d9ff] border-[#00d9ff]/30"
        />
      </div>

      {/* Corrections List */}
      {corrections.length === 0 ? (
        <div className="rounded-2xl border border-border bg-[#1e2433] p-12 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center glow-green">
            <CheckCircle className="h-8 w-8 text-[#10b981]" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No corrections yet!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start practicing to get personalized feedback on your Portuguese
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${categoryColors[category] || categoryColors.other}`}
                >
                  {categoryLabels[category] || category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {items.length} correction{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {items.map((correction) => (
                  <div
                    key={correction.id}
                    className="rounded-xl border border-border bg-[#1e2433] p-4 hover:border-border-glow transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Mistake vs Correction */}
                        <div className="mb-3">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-xs font-medium text-[#ef4444] mt-1">✗</span>
                            <p className="text-sm text-[#ef4444] line-through">
                              {correction.mistake}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-[#10b981] mt-1">✓</span>
                            <p className="text-sm font-medium text-[#10b981]">
                              {correction.correction}
                            </p>
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/30 p-3">
                          <p className="text-xs font-medium text-[#00d9ff] mb-1 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Explanation
                          </p>
                          <p className="text-sm text-foreground">{correction.explanation}</p>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
                        <span className="capitalize px-2 py-1 rounded bg-[#1e2433] border border-border">{correction.difficulty_level}</span>
                        <span>{formatDate(correction.created_at)}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={star <= correction.confidence_score ? "text-[#fbbf24]" : "text-[#64748b]"}
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
          ))}
        </div>
      )}
    </div>
  );
}
