import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import CorrectionsClient from "@/components/CorrectionsClient";

interface CorrectionData {
  id: string;
  mistake: string;
  correction: string;
  explanation: string;
  grammar_category: string;
  confidence_score: number;
  next_review_date: string | null;
  mastery_status: string | null;
  times_practiced: number | null;
  last_practiced_at: string | null;
  created_at: string;
  difficulty_level: string;
}

export default async function CorrectionsPage() {
  const session = await auth();
  const userId = session!.user.id;

  let corrections: CorrectionData[] = [];

  try {
    // Try to get corrections with new spaced repetition fields
    const result = await sql`
      SELECT
        c.id,
        c.mistake,
        c.correction,
        c.explanation,
        c.grammar_category,
        c.confidence_score,
        c.next_review_date,
        c.mastery_status,
        c.times_practiced,
        c.last_practiced_at,
        c.created_at,
        conv.difficulty_level
      FROM corrections c
      JOIN conversations conv ON c.conversation_id = conv.id
      WHERE c.user_id = ${userId}
      ORDER BY c.created_at DESC
      LIMIT 100
    `;

    // Serialize dates for client component (Next.js requires serializable props)
    corrections = result.rows.map((row) => ({
      id: row.id,
      mistake: row.mistake,
      correction: row.correction,
      explanation: row.explanation,
      grammar_category: row.grammar_category,
      confidence_score: row.confidence_score,
      next_review_date: row.next_review_date
        ? new Date(row.next_review_date).toISOString()
        : null,
      mastery_status: row.mastery_status || null,
      times_practiced: row.times_practiced ?? null,
      last_practiced_at: row.last_practiced_at
        ? new Date(row.last_practiced_at).toISOString()
        : null,
      created_at: new Date(row.created_at).toISOString(),
      difficulty_level: row.difficulty_level,
    }));
  } catch (error) {
    console.error("Error fetching corrections (migration may be needed):", error);

    // Fallback: Get corrections without new fields if migration hasn't run yet
    try {
      const fallbackResult = await sql`
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

      corrections = fallbackResult.rows.map((row) => ({
        id: row.id,
        mistake: row.mistake,
        correction: row.correction,
        explanation: row.explanation,
        grammar_category: row.grammar_category,
        confidence_score: row.confidence_score,
        next_review_date: null,
        mastery_status: null,
        times_practiced: null,
        last_practiced_at: null,
        created_at: new Date(row.created_at).toISOString(),
        difficulty_level: row.difficulty_level,
      }));
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError);
      // Return empty array if both queries fail
      corrections = [];
    }
  }

  return <CorrectionsClient initialCorrections={corrections} />;
}
