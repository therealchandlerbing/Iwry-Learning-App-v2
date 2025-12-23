import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

// Calculate next review date based on spaced repetition algorithm (SM-2 inspired)
function calculateNextReviewDate(timesPracticed: number, wasCorrect: boolean): Date {
  const now = new Date();
  let daysToAdd = 1;

  if (wasCorrect) {
    // Successful review - increase interval
    if (timesPracticed === 0) daysToAdd = 1;
    else if (timesPracticed === 1) daysToAdd = 3;
    else if (timesPracticed === 2) daysToAdd = 7;
    else if (timesPracticed === 3) daysToAdd = 14;
    else daysToAdd = 30;
  } else {
    // Failed review - reset to beginning
    daysToAdd = 1;
  }

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + daysToAdd);
  return nextReview;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { correctionId, practiceType, wasCorrect } = body;

    // Update correction practice stats
    const result = await sql`
      UPDATE corrections
      SET
        times_practiced = times_practiced + 1,
        last_practiced_at = NOW(),
        next_review_date = ${calculateNextReviewDate(
          0,
          wasCorrect || false
        ).toISOString()},
        mastery_status = CASE
          WHEN times_practiced >= 2 AND ${wasCorrect} THEN 'mastered'
          ELSE 'learning'
        END
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
      message: `Routed to ${practiceType} practice`,
    });
  } catch (error) {
    console.error("Practice routing error:", error);
    return NextResponse.json(
      { error: "Failed to route correction to practice" },
      { status: 500 }
    );
  }
}
