import { GoogleGenerativeAI, SchemaType, FunctionDeclaration } from "@google/generative-ai";
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
    beginner: `You are Iwry, a friendly Portuguese tutor speaking Brazilian Portuguese.

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
- Categorize errors (verb tenses, gender agreement, prepositions, pronouns, article usage, word order)

**Response format:**
- Write Portuguese text in **bold** using markdown
- Write English translations in *italics* using markdown
- Include a 💡 Fluency Tip with cultural insights after most responses
- Keep responses 2-3 sentences maximum
- Ask follow-up questions to keep conversation going

Example:
**Olá! Como você está?** *Hello! How are you?*

💡 Fluency Tip: Brazilians often use "tudo bem?" as a casual greeting!

When you detect a mistake in the user's Portuguese, note it mentally but continue the conversation naturally. Provide gentle corrections.`,

    intermediate: `You are Iwry, a Brazilian friend chatting naturally in Portuguese.

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
- Write Portuguese text in **bold** using markdown
- Write English translations in *italics* using markdown
- Include a 💡 Fluency Tip with cultural insights or slang explanations when helpful
- Natural conversational flow, 2-4 sentences
- Use emojis occasionally (🙂 😊 ✌️)
- Ask engaging questions

Example:
**E aí, cara! Tudo na paz?** *Hey, dude! Everything cool?*

💡 Fluency Tip: "Cara" is Brazilian slang like "dude" in English!`,

    advanced: `You are Iwry, a Brazilian business colleague or friend having sophisticated conversations.

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
- Write Portuguese text in **bold** using markdown
- Write English translations in *italics* using markdown
- Include a 💡 Fluency Tip with advanced cultural nuances or business etiquette when relevant
- Sophisticated, natural responses (3-5 sentences)
- Challenge the user with advanced vocabulary
- Discuss abstract concepts

Example:
**Precisamos alinhar as expectativas antes da reunião.** *We need to align expectations before the meeting.*

💡 Fluency Tip: "Alinhar" is commonly used in Brazilian business for getting everyone on the same page!`
  };

  return basePrompts[difficulty];
}

// Function declaration for error detection (aligned with v1 architecture)
const correctionFunctionDeclaration: FunctionDeclaration = {
  name: "recordCorrection",
  description: "Record a grammatical or vocabulary mistake made by the user for later review",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      mistake: {
        type: SchemaType.STRING,
        description: "The exact incorrect phrase or sentence the user said"
      },
      correction: {
        type: SchemaType.STRING,
        description: "The correct version of what they should have said"
      },
      explanation: {
        type: SchemaType.STRING,
        description: "Clear explanation in English of why the correction is needed and the grammar rule"
      },
      category: {
        type: SchemaType.STRING,
        description: "Grammar category - aligned with v1 architecture",
        format: "enum",
        enum: [
          "verb_tenses",
          "prepositions",
          "pronouns",
          "gender_agreement",
          "article_usage",
          "word_order"
        ]
      },
      severity: {
        type: SchemaType.NUMBER,
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

// AI Models Configuration (v1 Architecture)
const AI_MODELS = {
  // Chat Conversations - Fast responses, great for dialogue
  CHAT: "gemini-2.0-flash-exp", // Gemini 3 Flash Preview equivalent
  // Custom Lessons - Deep reasoning for curriculum design
  LESSONS: "gemini-1.5-pro-latest", // Gemini 3 Pro Preview equivalent
  // Dictionary Lookup - Instant, accurate translations
  DICTIONARY: "gemini-2.0-flash-exp", // Gemini 3 Flash Preview equivalent
  // Real-Time Voice - Optimized for live voice streaming
  VOICE: "gemini-2.0-flash-exp", // Gemini 2.5 Flash Native Audio equivalent
  // Text-to-Speech - Natural Brazilian Portuguese voice
  TTS: "gemini-2.0-flash-exp" // Gemini 2.5 Flash TTS equivalent
} as const;

export async function sendMessage(
  userMessage: string,
  options: GeminiChatOptions
): Promise<{ response: string; corrections: Correction[] }> {
  const model = genAI.getGenerativeModel({
    model: AI_MODELS.CHAT, // Using optimized chat model from v1 architecture
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
        const args = functionCall.args as Record<string, unknown> | undefined;
        if (
          args &&
          typeof args.mistake === 'string' &&
          typeof args.correction === 'string' &&
          typeof args.explanation === 'string' &&
          typeof args.category === 'string' &&
          typeof args.severity === 'number'
        ) {
          corrections.push({
            mistake: args.mistake,
            correction: args.correction,
            explanation: args.explanation,
            grammarCategory: args.category,
            confidenceScore: args.severity,
          } as Correction);
        }
      }
    }
  }

  return {
    response: textResponse,
    corrections: corrections as Correction[]
  };
}

// Dictionary Definition Interface (v1 Architecture - Structured Output)
export interface DictionaryDefinition {
  word: string;
  translation: string;
  partOfSpeech: string;
  pronunciation?: string;
  conjugations?: string[];
  examples: Array<{
    portuguese: string;
    english: string;
  }>;
  synonyms?: string[];
  antonyms?: string[];
}

// Function to get comprehensive dictionary definition with structured JSON output
export async function getDictionaryDefinition(word: string): Promise<DictionaryDefinition> {
  const model = genAI.getGenerativeModel({
    model: AI_MODELS.DICTIONARY, // Using optimized dictionary model from v1 architecture
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          word: { type: SchemaType.STRING },
          translation: { type: SchemaType.STRING },
          partOfSpeech: { type: SchemaType.STRING },
          pronunciation: { type: SchemaType.STRING },
          conjugations: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          },
          examples: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                portuguese: { type: SchemaType.STRING },
                english: { type: SchemaType.STRING }
              },
              required: ["portuguese", "english"]
            }
          },
          synonyms: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          },
          antonyms: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          }
        },
        required: ["word", "translation", "partOfSpeech", "examples"]
      }
    }
  });

  const prompt = `Provide a comprehensive dictionary entry for this Portuguese word: "${word}"

Include:
1. The word itself
2. English translation
3. Part of speech (noun, verb, adjective, etc.)
4. Pronunciation guide (IPA if possible)
5. For verbs: conjugations for present, past, and future tense (1st person singular)
6. At least 2 example sentences with English translations
7. Synonyms (if applicable)
8. Antonyms (if applicable)

Provide the response in the specified JSON format.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return JSON.parse(response.text());
}

// Function to translate a word/phrase from Portuguese to English (quick translation)
export async function translateWord(word: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: AI_MODELS.DICTIONARY // Using optimized dictionary model from v1 architecture
  });

  const prompt = `Translate this Portuguese word or phrase to English. Provide ONLY the translation, nothing else.

Portuguese: ${word}
English:`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text().trim();
}

// Quiz Question Interface (v1 Architecture - Structured Output)
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: DifficultyLevel;
}

// Custom Lesson Module Interface (v1 Architecture - Structured Output)
export interface CustomLessonModule {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  objectives: string[];
  sections: Array<{
    heading: string;
    content: string;
    examples: Array<{
      portuguese: string;
      english: string;
    }>;
  }>;
  practiceExercises: string[];
  vocabulary: Array<{
    word: string;
    translation: string;
    context: string;
  }>;
}

// Generate quiz questions with structured JSON output
export async function generateQuiz(
  topic: string,
  difficulty: DifficultyLevel,
  questionCount: number = 5
): Promise<QuizQuestion[]> {
  const model = genAI.getGenerativeModel({
    model: AI_MODELS.LESSONS, // Using Pro model for deeper reasoning
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            question: { type: SchemaType.STRING },
            options: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            },
            correctAnswer: { type: SchemaType.NUMBER },
            explanation: { type: SchemaType.STRING },
            difficulty: { type: SchemaType.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation", "difficulty"]
        }
      }
    }
  });

  const prompt = `Generate ${questionCount} multiple-choice quiz questions about "${topic}" in Portuguese at ${difficulty} level.

Each question should:
1. Test understanding of Portuguese grammar, vocabulary, or cultural knowledge
2. Have 4 answer options
3. Include the correct answer index (0-3)
4. Provide an explanation for why the answer is correct
5. Match the difficulty level: ${difficulty}

Provide the response as a JSON array.`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

// Generate custom lesson module with structured JSON output
export async function generateCustomLesson(
  topic: string,
  difficulty: DifficultyLevel,
  userGoals?: string[]
): Promise<CustomLessonModule> {
  const model = genAI.getGenerativeModel({
    model: AI_MODELS.LESSONS, // Using Pro model for curriculum design
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          difficulty: { type: SchemaType.STRING },
          estimatedMinutes: { type: SchemaType.NUMBER },
          objectives: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          },
          sections: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                heading: { type: SchemaType.STRING },
                content: { type: SchemaType.STRING },
                examples: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      portuguese: { type: SchemaType.STRING },
                      english: { type: SchemaType.STRING }
                    },
                    required: ["portuguese", "english"]
                  }
                }
              },
              required: ["heading", "content", "examples"]
            }
          },
          practiceExercises: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          },
          vocabulary: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                word: { type: SchemaType.STRING },
                translation: { type: SchemaType.STRING },
                context: { type: SchemaType.STRING }
              },
              required: ["word", "translation", "context"]
            }
          }
        },
        required: ["title", "description", "difficulty", "estimatedMinutes", "objectives", "sections", "practiceExercises", "vocabulary"]
      }
    }
  });

  const goalsText = userGoals ? `\nUser Goals: ${userGoals.join(", ")}` : "";

  const prompt = `Create a comprehensive Portuguese lesson module about "${topic}" at ${difficulty} level.${goalsText}

Structure the lesson with:
1. Title and description
2. Estimated time to complete (in minutes)
3. Learning objectives (3-5 specific goals)
4. Multiple sections with:
   - Section heading
   - Educational content
   - Example sentences (Portuguese with English translations)
5. Practice exercises (5-7 prompts for the student)
6. Vocabulary list with translations and context

The lesson should be engaging, culturally relevant, and appropriate for ${difficulty} learners.

Provide the response in valid JSON format matching the CustomLessonModule structure.`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

// Session Analysis Interface (v1 Architecture - Structured Output)
export interface SessionAnalysis {
  duration: number;
  topicsDiscussed: string[];
  vocabularyLearned: Array<{
    word: string;
    translation: string;
    context: string;
  }>;
  grammarPoints: Array<{
    category: string;
    examples: string[];
  }>;
  performanceSummary: string;
  recommendedNextSteps: string[];
}

// Analyze conversation session with structured output
export async function analyzeSession(
  messages: Array<{ role: string; content: string }>,
  corrections: Array<{ mistake: string; correction: string; explanation: string; grammarCategory: string }>
): Promise<SessionAnalysis> {
  const model = genAI.getGenerativeModel({
    model: AI_MODELS.CHAT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          duration: { type: SchemaType.NUMBER },
          topicsDiscussed: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          },
          vocabularyLearned: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                word: { type: SchemaType.STRING },
                translation: { type: SchemaType.STRING },
                context: { type: SchemaType.STRING }
              },
              required: ["word", "translation", "context"]
            }
          },
          grammarPoints: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                category: { type: SchemaType.STRING },
                examples: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING }
                }
              },
              required: ["category", "examples"]
            }
          },
          performanceSummary: { type: SchemaType.STRING },
          recommendedNextSteps: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          }
        },
        required: ["duration", "topicsDiscussed", "vocabularyLearned", "grammarPoints", "performanceSummary", "recommendedNextSteps"]
      }
    }
  });

  const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  const correctionsText = corrections.map(c =>
    `${c.mistake} → ${c.correction} [${c.grammarCategory}]`
  ).join('\n');

  const prompt = `Analyze this Portuguese learning session and extract structured insights.

CONVERSATION:
${conversationText}

CORRECTIONS:
${correctionsText}

Provide a JSON response with:
1. duration: estimated session duration in minutes
2. topicsDiscussed: array of topics/themes covered
3. vocabularyLearned: new words with translations and context
4. grammarPoints: grammar categories practiced with examples
5. performanceSummary: encouraging 2-3 sentence overview
6. recommendedNextSteps: 3-4 specific suggestions for continued learning`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

// Generate conversation summary
export async function generateConversationSummary(
  messages: Array<{ role: string; content: string }>,
  corrections: Array<{ mistake: string; correction: string; explanation: string }>
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: AI_MODELS.CHAT // Using chat model for summaries
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
