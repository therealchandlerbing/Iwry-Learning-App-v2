import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { sendMessage } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, difficulty, accent } = body;

    // Get AI greeting - use meta-instruction to generate initial greeting
    const result = await sendMessage("Please greet the user warmly to start this Portuguese learning conversation. Follow all formatting rules.", {
      difficulty,
      accent,
      conversationHistory: [],
    });

    // Save AI message
    await sql`
      INSERT INTO messages (conversation_id, role, content)
      VALUES (${conversationId}, 'assistant', ${result.response})
    `;

    return NextResponse.json({ message: result.response });
  } catch (error) {
    console.error("Greeting error:", error);

    // Provide detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json(
      {
        error: "Failed to get greeting",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
