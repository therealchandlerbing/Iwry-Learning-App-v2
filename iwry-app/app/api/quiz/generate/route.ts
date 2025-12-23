import { auth } from "@/lib/auth";
import { generateQuiz } from "@/lib/gemini";
import { DifficultyLevel } from "@/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * Quiz Generation API - v1 Architecture
 * Uses structured JSON schema for properly formatted multiple-choice questions
 * Model: Gemini 3 Pro Preview (optimized for deep reasoning)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, difficulty, questionCount = 5 } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic parameter is required" },
        { status: 400 }
      );
    }

    const validDifficulties: DifficultyLevel[] = ["beginner", "intermediate", "advanced"];
    if (!difficulty || !validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: "Valid difficulty level is required (beginner, intermediate, advanced)" },
        { status: 400 }
      );
    }

    // Generate quiz with structured JSON output
    const quiz = await generateQuiz(topic, difficulty, questionCount);

    return NextResponse.json({ questions: quiz });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
