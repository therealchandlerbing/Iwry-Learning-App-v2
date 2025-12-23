import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Support both env var names
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * English to Portuguese Dictionary Lookup API
 * Returns comprehensive Portuguese translation with definition, usage, and examples
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

    const prompt = `Translate this English word to Brazilian Portuguese and provide a comprehensive dictionary entry: "${word}"

Provide the response in the specified JSON format with:
1. The Portuguese translation (most common usage)
2. Part of speech (noun, verb, adjective, adverb, preposition, etc.)
3. Gender (for nouns: masculine or feminine)
4. A definition/explanation in Portuguese (for native Portuguese speakers)
5. A usage note in English explaining any nuances, common mistakes, or regional variations
6. For verbs: conjugations (present, past, future in first person singular "eu")
7. 2-3 example sentences with English translations`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            portugueseWord: { type: "STRING" },
            englishWord: { type: "STRING" },
            partOfSpeech: { type: "STRING" },
            gender: { type: "STRING" },
            pronunciation: { type: "STRING" },
            definition: { type: "STRING" },
            usageNote: { type: "STRING" },
            conjugations: {
              type: "OBJECT",
              properties: {
                present: { type: "STRING" },
                past: { type: "STRING" },
                future: { type: "STRING" }
              }
            },
            examples: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  portuguese: { type: "STRING" },
                  english: { type: "STRING" }
                },
                required: ["portuguese", "english"]
              }
            }
          },
          required: ["portugueseWord", "englishWord", "partOfSpeech", "definition", "examples"]
        }
      }
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const entry = JSON.parse(text);

    return NextResponse.json(entry);
  } catch (error) {
    console.error("English dictionary lookup error:", error);
    return NextResponse.json(
      { error: "Failed to lookup word" },
      { status: 500 }
    );
  }
}
