import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { analyzeSession } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId } = body;

    // Get conversation messages
    const messagesResult = await sql`
      SELECT role, content FROM messages
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
    `;

    // Get corrections from this conversation
    const correctionsResult = await sql`
      SELECT
        mistake,
        correction,
        explanation,
        grammar_category AS "grammarCategory"
      FROM corrections
      WHERE conversation_id = ${conversationId}
    `;

    // Update conversation end time and message count
    await sql`
      UPDATE conversations
      SET ended_at = NOW(), message_count = ${messagesResult.rows.length}
      WHERE id = ${conversationId}
    `;

    // Generate enhanced summary using Gemini with structured analysis
    let analysis: any = null;
    try {
      analysis = await analyzeSession(
        messagesResult.rows as Array<{ role: string; content: string }>,
        correctionsResult.rows as Array<{
          mistake: string;
          correction: string;
          explanation: string;
          grammarCategory: string;
        }>
      );

      // Save vocabulary learned to the database
      if (analysis.vocabularyLearned && analysis.vocabularyLearned.length > 0) {
        for (const vocab of analysis.vocabularyLearned) {
          await sql`
            INSERT INTO vocabulary (user_id, word, translation, context)
            VALUES (${session.user.id}, ${vocab.word}, ${vocab.translation}, ${vocab.context})
            ON CONFLICT (user_id, word)
            DO UPDATE SET
              times_encountered = vocabulary.times_encountered + 1,
              last_seen_at = NOW()
          `;
        }
      }
    } catch (error) {
      console.error("Failed to generate analysis:", error);
      analysis = {
        duration: messagesResult.rows.length * 0.5, // Estimate 30 seconds per message
        topicsDiscussed: ["General conversation"],
        vocabularyLearned: [],
        grammarPoints: [],
        performanceSummary: "Great session! Keep practicing to improve your Portuguese.",
        recommendedNextSteps: [
          "Continue practicing regularly",
          "Review the corrections from this session",
          "Try using new vocabulary in your next conversation",
        ],
      };
    }

    return NextResponse.json({
      summary: analysis.performanceSummary,
      analysis,
      messageCount: messagesResult.rows.length,
      correctionsCount: correctionsResult.rows.length,
    });
  } catch (error) {
    console.error("End conversation error:", error);
    return NextResponse.json(
      { error: "Failed to end conversation" },
      { status: 500 }
    );
  }
}
