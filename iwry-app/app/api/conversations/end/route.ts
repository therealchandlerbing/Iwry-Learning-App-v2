import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { generateConversationSummary } from "@/lib/gemini";
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
      SELECT mistake, correction, explanation
      FROM corrections
      WHERE conversation_id = ${conversationId}
    `;

    // Update conversation end time and message count
    await sql`
      UPDATE conversations
      SET ended_at = NOW(), message_count = ${messagesResult.rows.length}
      WHERE id = ${conversationId}
    `;

    // Generate summary using Gemini
    let summary = "";
    try {
      summary = await generateConversationSummary(
        messagesResult.rows as Array<{ role: string; content: string }>,
        correctionsResult.rows as Array<{ mistake: string; correction: string; explanation: string }>
      );
    } catch (error) {
      console.error("Failed to generate summary:", error);
      summary = "Great session! Keep practicing to improve your Portuguese.";
    }

    return NextResponse.json({
      summary,
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
