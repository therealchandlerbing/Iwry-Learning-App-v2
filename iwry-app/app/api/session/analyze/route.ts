import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { analyzeSession } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schemas for runtime type validation (v1 Architecture - Type Safety)
const MessageSchema = z.object({
  role: z.string(),
  content: z.string(),
  created_at: z.date().optional(),
});

const CorrectionSchema = z.object({
  mistake: z.string(),
  correction: z.string(),
  explanation: z.string(),
  grammar_category: z.string(),
});

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

    // Validate database results with Zod for type safety
    const messages = messagesResult.rows.map((row) => {
      const validated = MessageSchema.parse(row);
      return {
        role: validated.role,
        content: validated.content,
      };
    });

    const corrections = correctionsResult.rows.map((row) => {
      const validated = CorrectionSchema.parse(row);
      return {
        mistake: validated.mistake,
        correction: validated.correction,
        explanation: validated.explanation,
        grammarCategory: validated.grammar_category,
      };
    });

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
