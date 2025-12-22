import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { difficulty, accent } = body;

    // Create new conversation
    const result = await sql`
      INSERT INTO conversations (user_id, difficulty_level, preferred_accent)
      VALUES (${session.user.id}, ${difficulty}, ${accent})
      RETURNING id
    `;

    const conversationId = result.rows[0].id;

    return NextResponse.json({ conversationId }, { status: 201 });
  } catch (error) {
    console.error("Start conversation error:", error);
    return NextResponse.json(
      { error: "Failed to start conversation" },
      { status: 500 }
    );
  }
}
