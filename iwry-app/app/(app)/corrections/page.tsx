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

  const corrections = result.rows;

  return <CorrectionsClient initialCorrections={corrections as any} />;
}
