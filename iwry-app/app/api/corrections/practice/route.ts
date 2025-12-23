import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@vercel/postgres";

// Calculate next review date using spaced repetition algorithm
const calculateNextReview = (
  timesPracticed: number,
  wasCorrect: boolean
): Date => {
  const now = new Date();
  if (!wasCorrect) {
    // Review again in 1 day if incorrect
    now.setDate(now.getDate() + 1);
    return now;
  }

  // Spaced repetition intervals: 1, 3, 7, 14, 30 days
  const intervals = [1, 3, 7, 14, 30];
  const intervalIndex = Math.min(timesPracticed, intervals.length - 1);
  now.setDate(now.getDate() + intervals[intervalIndex]);
  return now;
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { correctionId, wasCorrect } = await request.json();

    if (!correctionId || typeof wasCorrect !== "boolean") {
      return NextResponse.json(
        { error: "Missing correctionId or wasCorrect" },
        { status: 400 }
      );
    }

    // Get current correction data
    const { rows: corrections } = await db.query(
      `SELECT times_practiced, mastery_status FROM corrections WHERE id = $1 AND user_id = $2`,
      [correctionId, session.user.id]
    );

    if (corrections.length === 0) {
      return NextResponse.json(
        { error: "Correction not found" },
        { status: 404 }
      );
    }

    const correction = corrections[0];
    const oldTimesPracticed = correction.times_practiced || 0;

    // Reset counter to 0 on incorrect answers for proper spaced repetition
    const timesPracticed = wasCorrect ? oldTimesPracticed + 1 : 0;

    const nextReviewDate = calculateNextReview(
      oldTimesPracticed,
      wasCorrect
    );

    // Determine mastery status
    let masteryStatus: string;
    if (wasCorrect && timesPracticed >= 5) {
      masteryStatus = "mastered";
    } else {
      masteryStatus = "learning";
    }

    // Update correction
    await db.query(
      `UPDATE corrections
       SET times_practiced = $1,
           last_practiced_at = NOW(),
           next_review_date = $2,
           mastery_status = $3
       WHERE id = $4 AND user_id = $5`,
      [timesPracticed, nextReviewDate, masteryStatus, correctionId, session.user.id]
    );

    return NextResponse.json({
      success: true,
      timesPracticed,
      nextReviewDate,
      masteryStatus,
    });
  } catch (error) {
    console.error("Failed to record practice:", error);
    return NextResponse.json(
      { error: "Failed to record practice" },
      { status: 500 }
    );
  }
}
