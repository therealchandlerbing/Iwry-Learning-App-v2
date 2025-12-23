import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { spokenText, targetPhrase, difficulty } = body;

    // Use Gemini to analyze pronunciation
    const prompt = `You are a Portuguese pronunciation expert. Analyze the following:

TARGET PHRASE (what they should have said): "${targetPhrase}"
WHAT THEY ACTUALLY SAID: "${spokenText}"
DIFFICULTY LEVEL: ${difficulty}

Provide pronunciation feedback in JSON format with:
1. score (0-100): Overall pronunciation accuracy
2. strengths: Array of things they did well
3. improvements: Array of specific pronunciation improvements needed
4. phonetic: IPA notation for correct pronunciation
5. tips: Practical tips for improving

Be encouraging but honest. Focus on the most important improvements for their level.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            score: { type: "NUMBER" },
            strengths: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            improvements: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            phonetic: { type: "STRING" },
            tips: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          required: ["score", "strengths", "improvements", "tips"]
        }
      }
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const analysis = JSON.parse(text);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Pronunciation analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze pronunciation",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
