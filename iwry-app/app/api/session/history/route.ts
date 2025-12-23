import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

/**
 * Session History API
 * Returns the user's learning session history
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch conversations with their analysis data
    const { rows: conversations } = await sql`
      SELECT
        c.id,
        c.started_at,
        c.ended_at,
        c.difficulty_level,
        c.message_count,
        (
          SELECT COUNT(*)
          FROM vocabulary v
          WHERE v.user_id = c.user_id
          AND v.first_seen_at >= c.started_at
          AND (c.ended_at IS NULL OR v.first_seen_at <= c.ended_at)
        ) as vocab_count
      FROM conversations c
      WHERE c.user_id = ${session.user.id}
      AND c.ended_at IS NOT NULL
      ORDER BY c.started_at DESC
      LIMIT 30
    `;

    // Format sessions for frontend
    const sessions = await Promise.all(
      conversations.map(async (conv) => {
        // Get a sample of messages for summary
        const { rows: messages } = await sql`
          SELECT content, role
          FROM messages
          WHERE conversation_id = ${conv.id}
          ORDER BY created_at ASC
          LIMIT 5
        `;

        // Get vocabulary learned during this session
        const { rows: vocabRows } = await sql`
          SELECT word, translation
          FROM vocabulary
          WHERE user_id = ${session.user.id}
          AND first_seen_at >= ${conv.started_at}
          ${conv.ended_at ? sql`AND first_seen_at <= ${conv.ended_at}` : sql``}
          LIMIT 10
        `;

        // Generate a brief summary from the conversation
        const userMessages = messages.filter((m) => m.role === "user");
        const summary = userMessages.length > 0
          ? userMessages[0].content.substring(0, 100) + (userMessages[0].content.length > 100 ? "..." : "")
          : "Practice session completed";

        return {
          id: conv.id,
          date: conv.started_at,
          level: conv.difficulty_level || "beginner",
          summary,
          vocabCount: parseInt(conv.vocab_count) || 0,
          feedback: `Session completed with ${conv.message_count || 0} messages exchanged.`,
          vocabularyLearned: vocabRows.map((v) => ({
            word: v.word,
            translation: v.translation,
          })),
          nextStep: "Continue practicing to improve your fluency!",
        };
      })
    );

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Session history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch session history" },
      { status: 500 }
    );
  }
}
