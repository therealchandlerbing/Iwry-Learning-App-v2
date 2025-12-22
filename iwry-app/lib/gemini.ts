import { GoogleGenerativeAI } from "@google/generative-ai";
import { DifficultyLevel, PortugueseAccent, Correction } from "@/types";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Accent-specific instructions
const accentInstructions: Record<PortugueseAccent, string> = {
  'sao-paulo': `Speak with São Paulo dialect characteristics:
- Use "você" (not "tu")
- Pronounce "r" strongly (retroflex)
- Slight Italian influence in vocabulary
- Professional, clear pronunciation
- Example phrases: "Tá bom", "Massa", "Da hora"`,

  'rio': `Speak with Rio de Janeiro (Carioca) dialect:
- Use "você" primarily
- Softer "s" sounds (like "sh")
- More relaxed pronunciation
- Beach/casual influence
- Example phrases: "Beleza?", "Tranquilo", "Legal"`,

  'northeast': `Speak with Northeast Brazil dialect:
- Can use "tu" more frequently
- Distinct intonation patterns
- Regional vocabulary
- Example phrases: "Oxente", "Visse?", "Massa demais"`,

  'portugal': `Speak with European Portuguese:
- Use "tu" more formally
- Closed vowel sounds
- Different vocabulary (autocarro vs ônibus)
- More formal structures
- Example phrases: "Pois é", "Está bem"`
};

// Difficulty-based system prompts
export function getSystemPrompt(
  difficulty: DifficultyLevel,
  accent: PortugueseAccent
): string {
  const accentInfo = accentInstructions[accent];

  const basePrompts: Record<DifficultyLevel, string> = {
    beginner: `You are a friendly Portuguese tutor speaking Brazilian Portuguese.

${accentInfo}

**Teaching approach:**
- Use simple vocabulary and clear grammar
- Speak in complete sentences (avoid abbreviations)
- Be patient and encouraging
- Keep conversations casual but educational
- Topics: greetings, family, food, daily routines, basic business

**Error correction:**
- Gently correct mistakes when they occur
- Explain WHY something is correct
- Provide the corrected version
- Categorize errors (verb conjugation, gender agreement, prepositions, etc.)

**Response format:**
- Respond naturally in Portuguese
- Keep responses 2-3 sentences maximum
- Ask follow-up questions to keep conversation going

When you detect a mistake in the user's Portuguese, note it mentally but continue the conversation naturally. Provide gentle corrections.`,

    intermediate: `You are a Brazilian friend chatting naturally in Portuguese.

${accentInfo}

**Communication style:**
- Use common abbreviations: vc (você), tbm (também), blz (beleza), td bem (tudo bem)
- Mix formal and informal language appropriately
- Use Brazilian slang naturally
- Topics: work, culture, travel, current events, sports, entertainment

**Error correction:**
- Correct mistakes more subtly
- Sometimes rephrase user's sentence correctly without explicitly pointing out the error
- Provide explanations when asked
- Categorize errors for tracking

**Response format:**
- Natural conversational flow
- 2-4 sentences
- Use emojis occasionally (🙂 😊 ✌️)
- Ask engaging questions`,

    advanced: `You are a Brazilian business colleague or friend having sophisticated conversations.

${accentInfo}

**Communication style:**
- Use professional vocabulary and business terms
- Complex sentence structures and subjunctive mood
- Regional expressions and cultural references
- Topics: business strategy, Brazilian economy, politics, philosophy, culture

**Error correction:**
- Subtle corrections (assume near-fluency)
- Only point out mistakes that would sound unnatural to natives
- Provide nuanced explanations
- Focus on advanced grammar (subjunctive, conditionals, idiomatic expressions)

**Response format:**
- Sophisticated, natural responses
- 3-5 sentences
- Challenge the user with advanced vocabulary
- Discuss abstract concepts`
  };

  return basePrompts[difficulty];
}

// Function declaration for error detection
const correctionFunctionDeclaration = {
  name: "recordCorrection",
  description: "Record a grammatical or vocabulary mistake made by the user for later review",
  parameters: {
    type: "OBJECT" as const,
    properties: {
      mistake: {
        type: "STRING" as const,
        description: "The exact incorrect phrase or sentence the user said"
      },
      correction: {
        type: "STRING" as const,
        description: "The correct version of what they should have said"
      },
      explanation: {
        type: "STRING" as const,
        description: "Clear explanation in English of why the correction is needed and the grammar rule"
      },
      category: {
        type: "STRING" as const,
        description: "Grammar category",
        enum: [
          "verb_conjugation",
          "gender_agreement",
          "prepositions",
          "subjunctive_mood",
          "word_choice",
          "pronunciation",
          "formal_informal",
          "other"
        ]
      },
      severity: {
        type: "NUMBER" as const,
        description: "How important is this mistake? 1=minor, 3=moderate, 5=critical"
      }
    },
    required: ["mistake", "correction", "explanation", "category", "severity"]
  }
};

export interface GeminiChatOptions {
  difficulty: DifficultyLevel;
  accent: PortugueseAccent;
  conversationHistory?: Array<{ role: string; parts: Array<{ text: string }> }>;
}

export async function sendMessage(
  userMessage: string,
  options: GeminiChatOptions
): Promise<{ response: string; corrections: Correction[] }> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: getSystemPrompt(options.difficulty, options.accent),
    tools: [{
      functionDeclarations: [correctionFunctionDeclaration]
    }]
  });

  const chat = model.startChat({
    history: options.conversationHistory || []
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;

  // Extract text response
  let textResponse = "";
  const corrections: Partial<Correction>[] = [];

  // Process all parts of the response
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if ('text' in part && part.text) {
      textResponse += part.text;
    }

    // Check for function calls (corrections)
    if ('functionCall' in part && part.functionCall) {
      const functionCall = part.functionCall;
      if (functionCall.name === 'recordCorrection') {
        corrections.push({
          mistake: functionCall.args?.mistake as string,
          correction: functionCall.args?.correction as string,
          explanation: functionCall.args?.explanation as string,
          grammarCategory: functionCall.args?.category as string,
          confidenceScore: functionCall.args?.severity as number
        });
      }
    }
  }

  return {
    response: textResponse,
    corrections: corrections as Correction[]
  };
}

// Function to translate a word/phrase from Portuguese to English
export async function translateWord(word: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp"
  });

  const prompt = `Translate this Portuguese word or phrase to English. Provide ONLY the translation, nothing else.

Portuguese: ${word}
English:`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text().trim();
}

// Generate conversation summary
export async function generateConversationSummary(
  messages: Array<{ role: string; content: string }>,
  corrections: Array<{ mistake: string; correction: string; explanation: string }>
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp"
  });

  const conversationText = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  const correctionsText = corrections.length > 0
    ? corrections.map(c => `- ${c.mistake} → ${c.correction} (${c.explanation})`).join('\n')
    : 'No corrections needed! Great job!';

  const prompt = `Create an encouraging summary of this Portuguese learning conversation in English.

CONVERSATION:
${conversationText}

CORRECTIONS MADE:
${correctionsText}

Provide:
1. Brief overview of topics discussed (1 sentence)
2. Encouraging feedback on their Portuguese
3. 1-2 key learning points from this session
4. Motivational closing

Keep it concise, warm, and encouraging. 3-4 sentences total.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
