import { auth } from "@/lib/auth";
import { db } from "@vercel/postgres";
import VocabularyClient from "@/components/VocabularyClient";

export default async function VocabularyPage() {
  const session = await auth();
  const userId = session!.user.id;

  // Get all vocabulary words
  const { rows: vocabulary } = await db.query(
    `SELECT
      id,
      word,
      translation,
      context,
      difficulty_level,
      created_at
    FROM vocabulary
    WHERE user_id = $1
    ORDER BY created_at DESC`,
    [userId]
  );

  return <VocabularyClient vocabulary={vocabulary} />;
}
