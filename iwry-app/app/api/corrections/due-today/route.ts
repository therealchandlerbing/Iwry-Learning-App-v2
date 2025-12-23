import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get corrections due for review today
    const result = await sql`
      SELECT
        c.id,
        c.mistake,
        c.correction,
        c.explanation,
        c.grammar_category,
        c.confidence_score,
        c.times_practiced,
        c.next_review_date,
        c.mastery_status,
        c.created_at
      FROM corrections c
      WHERE c.user_id = ${session.user.id}
        AND c.mastery_status != 'mastered'
        AND (c.next_review_date IS NULL OR c.next_review_date <= NOW())
      ORDER BY c.next_review_date ASC NULLS FIRST
      LIMIT 20
    `;

    return NextResponse.json({
      corrections: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Get due corrections error:", error);
    return NextResponse.json(
      { error: "Failed to get due corrections" },
      { status: 500 }
    );
  }
}
