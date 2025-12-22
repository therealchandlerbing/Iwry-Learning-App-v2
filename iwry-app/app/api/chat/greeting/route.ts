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

    // Get AI greeting
    const result = await sendMessage("", {
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
    return NextResponse.json(
      { error: "Failed to get greeting" },
      { status: 500 }
    );
  }
}
