import { auth } from "@/lib/auth";
import { db } from "@vercel/postgres";
import { redirect } from "next/navigation";
import VocabularyClient from "@/components/VocabularyClient";

export default async function VocabularyPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  let vocabulary: any[] = [];
  try {
    const { rows } = await db.query(
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
    vocabulary = rows;
  } catch (error) {
    console.error("Failed to fetch vocabulary for user:", userId, error);
    vocabulary = [];
  }

  return <VocabularyClient vocabulary={vocabulary} />;
}
