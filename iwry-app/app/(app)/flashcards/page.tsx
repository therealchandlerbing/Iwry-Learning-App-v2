import { auth } from "@/lib/auth";
import { db } from "@vercel/postgres";
import { redirect } from "next/navigation";
import FlashcardReview from "@/components/FlashcardReview";

export default async function FlashcardsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  let corrections: any[] = [];
  try {
    const { rows } = await db.query(
      `SELECT
        id,
        mistake,
        correction,
        explanation,
        grammar_category,
        confidence_score,
        difficulty_level,
        times_practiced,
        mastery_status,
        next_review_date
      FROM corrections
      WHERE user_id = $1
        AND (mastery_status IS NULL OR mastery_status != 'mastered')
      ORDER BY
        CASE
          WHEN next_review_date IS NULL THEN 0
          WHEN next_review_date <= NOW() THEN 1
          ELSE 2
        END,
        next_review_date ASC,
        created_at DESC
      LIMIT 20`,
      [userId]
    );
    corrections = rows;
  } catch (error) {
    console.error("Failed to load flashcard corrections:", error);
    corrections = [];
  }

  return <FlashcardReview corrections={corrections} />;
}
