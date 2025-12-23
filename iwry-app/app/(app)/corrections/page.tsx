import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import CorrectionsClient from "@/components/CorrectionsClient";

export default async function CorrectionsPage() {
  const session = await auth();
  const userId = session!.user.id;

  // Get all corrections for user with spaced repetition fields
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
  const corrections = result.rows.map((row) => ({
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
    times_practiced: row.times_practiced || null,
    last_practiced_at: row.last_practiced_at
      ? new Date(row.last_practiced_at).toISOString()
      : null,
    created_at: new Date(row.created_at).toISOString(),
    difficulty_level: row.difficulty_level,
  }));

  return <CorrectionsClient initialCorrections={corrections} />;
}
