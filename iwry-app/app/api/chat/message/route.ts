import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { sendMessage } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: any; // Declare outside try block for error logging

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    body = await request.json();
    const { conversationId, message, difficulty, accent, history } = body;

    // Save user message
    await sql`
      INSERT INTO messages (conversation_id, role, content)
      VALUES (${conversationId}, 'user', ${message})
    `;

    // Convert history to Gemini format
    const conversationHistory = history.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Get AI response
    const result = await sendMessage(message, {
      difficulty,
      accent,
      conversationHistory,
    });

    // Save AI message
    await sql`
      INSERT INTO messages (conversation_id, role, content)
      VALUES (${conversationId}, 'assistant', ${result.response})
    `;

    // Save corrections if any
    if (result.corrections && result.corrections.length > 0) {
      for (const correction of result.corrections) {
        await sql`
          INSERT INTO corrections (
            user_id,
            conversation_id,
            mistake,
            correction,
            explanation,
            grammar_category,
            confidence_score
          )
          VALUES (
            ${session.user.id},
            ${conversationId},
            ${correction.mistake},
            ${correction.correction},
            ${correction.explanation},
            ${correction.grammarCategory},
            ${correction.confidenceScore}
          )
        `;

        // Extract and save vocabulary words
        const words = correction.correction.split(" ");
        for (const word of words) {
          const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, "");
          if (cleanWord.length > 2) {
            // Check if word exists
            const existing = await sql`
              SELECT id, times_encountered FROM vocabulary
              WHERE user_id = ${session.user.id} AND word = ${cleanWord}
            `;

            if (existing.rows.length > 0) {
              // Update encounter count
              await sql`
                UPDATE vocabulary
                SET times_encountered = times_encountered + 1,
                    last_seen_at = NOW()
                WHERE id = ${existing.rows[0].id}
              `;
            } else {
              // Insert new word (translation will be added when user clicks it)
              await sql`
                INSERT INTO vocabulary (user_id, word, translation, context)
                VALUES (${session.user.id}, ${cleanWord}, '', ${correction.correction})
                ON CONFLICT (user_id, word) DO NOTHING
              `;
            }
          }
        }
      }
    }

    return NextResponse.json({
      response: result.response,
      corrections: result.corrections,
    });
  } catch (error) {
    console.error("Message error:", error);

    // Provide more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      conversationId: body?.conversationId,
      difficulty: body?.difficulty,
      accent: body?.accent,
    });

    return NextResponse.json(
      {
        error: "Failed to process message",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
