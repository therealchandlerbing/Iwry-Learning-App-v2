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
    const { correctionId } = body;

    // Mark correction as mastered
    const result = await sql`
      UPDATE corrections
      SET
        mastery_status = 'mastered',
        next_review_date = NOW() + INTERVAL '90 days'
      WHERE id = ${correctionId} AND user_id = ${session.user.id}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Correction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      correction: result.rows[0],
      message: "Correction marked as mastered! Next review in 90 days.",
    });
  } catch (error) {
    console.error("Mark mastered error:", error);
    return NextResponse.json(
      { error: "Failed to mark correction as mastered" },
      { status: 500 }
    );
  }
}
