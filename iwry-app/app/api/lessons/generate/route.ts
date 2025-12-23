import { auth } from "@/lib/auth";
import { generateCustomLesson } from "@/lib/gemini";
import { VALID_DIFFICULTY_LEVELS } from "@/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * Custom Lesson Generation API - v1 Architecture
 * Uses structured JSON schema for standardized lesson structure
 * Model: Gemini 3 Pro Preview (optimized for curriculum design)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, difficulty, userGoals } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic parameter is required" },
        { status: 400 }
      );
    }

    if (!difficulty || !VALID_DIFFICULTY_LEVELS.includes(difficulty)) {
      return NextResponse.json(
        { error: "Valid difficulty level is required (beginner, intermediate, advanced)" },
        { status: 400 }
      );
    }

    // Generate custom lesson with structured output
    const lesson = await generateCustomLesson(
      topic,
      difficulty,
      userGoals && Array.isArray(userGoals) ? userGoals : undefined
    );

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Lesson generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson" },
      { status: 500 }
    );
  }
}
