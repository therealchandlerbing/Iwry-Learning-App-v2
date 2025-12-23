import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { analyzeSession } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

/**
 * Session Analysis API - v1 Architecture
 * Uses structured JSON schema for consistent vocabulary extraction and summaries
 * Model: Gemini 3 Flash Preview (optimized for fast analysis)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    // Fetch messages from the conversation
    const messagesResult = await sql`
      SELECT role, content, created_at
      FROM messages
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
    `;

    // Fetch corrections from the conversation
    const correctionsResult = await sql`
      SELECT mistake, correction, explanation, grammar_category
      FROM corrections
      WHERE conversation_id = ${conversationId}
    `;

    const messages = messagesResult.rows.map((row) => ({
      role: row.role as string,
      content: row.content as string,
    }));

    const corrections = correctionsResult.rows.map((row) => ({
      mistake: row.mistake as string,
      correction: row.correction as string,
      explanation: row.explanation as string,
      grammarCategory: row.grammar_category as string,
    }));

    // Analyze session with structured output
    const analysis = await analyzeSession(messages, corrections);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Session analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze session" },
      { status: 500 }
    );
  }
}
