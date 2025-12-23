import { auth } from "@/lib/auth";
import { getDictionaryDefinition } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

/**
 * Dictionary Lookup API - v1 Architecture
 * Uses structured JSON schema for guaranteed format
 * Model: Gemini 3 Flash Preview (optimized for instant, accurate lookups)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { word } = body;

    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Word parameter is required" },
        { status: 400 }
      );
    }

    // Get comprehensive dictionary definition with structured output
    const definition = await getDictionaryDefinition(word);

    return NextResponse.json(definition);
  } catch (error) {
    console.error("Dictionary lookup error:", error);
    return NextResponse.json(
      { error: "Failed to lookup word" },
      { status: 500 }
    );
  }
}
