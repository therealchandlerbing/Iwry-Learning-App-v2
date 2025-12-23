import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Add spaced repetition fields to corrections table
    await sql`
      ALTER TABLE corrections
      ADD COLUMN IF NOT EXISTS next_review_date TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS mastery_status VARCHAR(20) DEFAULT 'learning',
      ADD COLUMN IF NOT EXISTS times_practiced INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_practiced_at TIMESTAMPTZ
    `;

    // Set default values for existing records
    await sql`
      UPDATE corrections
      SET
        next_review_date = created_at + INTERVAL '1 day',
        mastery_status = 'learning',
        times_practiced = 0
      WHERE next_review_date IS NULL
    `;

    return NextResponse.json({
      success: true,
      message: "Database migrated successfully"
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Failed to migrate database", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
