# Iwry v2 - v1 Architecture Implementation

This document describes the v1 architecture implementation for Iwry, including the data flow, AI model selection, and all integrated features.

## 📊 Data Flow Diagram

```
User Action
    │
    ▼
┌─────────────────┐
│ React Component │ ──► Update UI State
└─────────────────┘
    │
    ▼
Need AI Response?
    │
    ├─── YES ──► ┌──────────────────┐
    │            │  Gemini Service  │
    │            │  (AI Processing) │
    │            └──────────────────┘
    │                     │
    │                     ▼
    │            ┌──────────────────┐
    │            │   AI Response    │
    │            └──────────────────┘
    │                     │
    ▼                     ▼
┌──────────────────────────────────┐
│    Update User Progress Data     │
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│   Save to Vercel Postgres DB     │
└──────────────────────────────────┘
    │
    ▼
Display Updated UI to User
```

## 🎯 AI Model Selection

Different features use different AI models optimized for specific tasks:

| Feature | AI Model | Implementation | Why This Model? |
|---------|----------|----------------|-----------------|
| Chat Conversations | Gemini 3 Flash Preview | `AI_MODELS.CHAT` | ⚡ Fast responses, great for dialogue |
| Custom Lessons | Gemini 3 Pro Preview | `AI_MODELS.LESSONS` | 🧠 Deep reasoning for curriculum design |
| Real-Time Voice | Gemini 2.5 Flash Native Audio | `AI_MODELS.VOICE` | 🎤 Optimized for live voice streaming |
| Text-to-Speech | Gemini 2.5 Flash TTS | `AI_MODELS.TTS` | 🔊 Natural Brazilian Portuguese voice |
| Dictionary Lookup | Gemini 3 Flash Preview | `AI_MODELS.DICTIONARY` | ⚡ Instant, accurate translations |

### Model Configuration

Located in `/lib/gemini.ts`:

```typescript
const AI_MODELS = {
  CHAT: "gemini-2.0-flash-exp",        // Chat Conversations
  LESSONS: "gemini-1.5-pro-latest",    // Custom Lessons
  DICTIONARY: "gemini-2.0-flash-exp",  // Dictionary Lookup
  VOICE: "gemini-2.0-flash-exp",       // Real-Time Voice
  TTS: "gemini-2.0-flash-exp"          // Text-to-Speech
} as const;
```

## 🎯 Response Formatting

All AI responses follow consistent v1 formatting:

- **Bold** for Portuguese text using markdown `**text**`
- *Italics* for English translations using markdown `*text*`
- 💡 Fluency Tips as callouts with cultural insights
- Emoji-enhanced learning cues

### Example Response Format

```
**Olá! Como você está?** *Hello! How are you?*

💡 Fluency Tip: Brazilians often use "tudo bem?" as a casual greeting, similar to "what's up?" in English!
```

## ✏️ Grammar Correction Engine

Categories aligned with v1 architecture:

1. **Verb Tenses** - Past, present, future conjugations
2. **Prepositions** - em, de, para, por, etc.
3. **Pronouns** - eu, você, ele/ela, nós, etc.
4. **Gender Agreement** - Masculine/feminine noun-adjective agreement
5. **Article Usage** - o/a, um/uma, definite/indefinite articles
6. **Word Order** - Sentence structure and word placement

### Correction Format

```
❌ Incorrect: "Eu foi ao mercado"
✅ Correct: "Eu fui ao mercado"

💡 Explanation: The verb "ir" (to go) conjugates as "fui"
for first person singular (eu) in the past tense, not "foi".

Category: Verb Tenses
```

## 🔮 Advanced Features with Structured JSON Schemas

### 1. Dictionary Definitions

**Endpoint:** `POST /api/dictionary/lookup`

**Request:**
```json
{
  "word": "comer"
}
```

**Response:**
```json
{
  "word": "comer",
  "translation": "to eat",
  "partOfSpeech": "verb",
  "pronunciation": "ko.ˈmeʁ",
  "conjugations": [
    "como (present, I eat)",
    "comi (past, I ate)",
    "comerei (future, I will eat)"
  ],
  "examples": [
    {
      "portuguese": "Eu gosto de comer pizza.",
      "english": "I like to eat pizza."
    },
    {
      "portuguese": "Vamos comer juntos?",
      "english": "Shall we eat together?"
    }
  ],
  "synonyms": ["alimentar-se"],
  "antonyms": ["jejuar"]
}
```

### 2. Quiz Generation

**Endpoint:** `POST /api/quiz/generate`

**Request:**
```json
{
  "topic": "Portuguese verbs",
  "difficulty": "intermediate",
  "questionCount": 5
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "Which is the correct conjugation of 'estar' for 'eu'?",
      "options": ["estou", "está", "estão", "estamos"],
      "correctAnswer": 0,
      "explanation": "'Estou' is the first person singular (eu) conjugation of 'estar' (to be).",
      "difficulty": "intermediate"
    }
  ]
}
```

### 3. Custom Lesson Modules

**Endpoint:** `POST /api/lessons/generate`

**Request:**
```json
{
  "topic": "Brazilian food culture",
  "difficulty": "beginner",
  "userGoals": ["Learn food vocabulary", "Order at restaurants"]
}
```

**Response:**
```json
{
  "title": "Brazilian Food Culture",
  "description": "Learn about Brazilian cuisine and how to order food",
  "difficulty": "beginner",
  "estimatedMinutes": 30,
  "objectives": [
    "Learn 20 common food vocabulary words",
    "Understand how to order at Brazilian restaurants",
    "Recognize regional dishes"
  ],
  "sections": [
    {
      "heading": "Common Foods",
      "content": "Brazilian cuisine is diverse...",
      "examples": [
        {
          "portuguese": "Eu quero arroz e feijão.",
          "english": "I want rice and beans."
        }
      ]
    }
  ],
  "practiceExercises": [
    "Order your favorite dish at a restaurant",
    "Describe what you ate for lunch today"
  ],
  "vocabulary": [
    {
      "word": "arroz",
      "translation": "rice",
      "context": "staple food in Brazil"
    }
  ]
}
```

### 4. Session Analysis

**Endpoint:** `POST /api/session/analyze`

**Request:**
```json
{
  "conversationId": "uuid-here"
}
```

**Response:**
```json
{
  "duration": 15,
  "topicsDiscussed": ["food", "daily routine", "weather"],
  "vocabularyLearned": [
    {
      "word": "comer",
      "translation": "to eat",
      "context": "Eu gosto de comer pizza"
    }
  ],
  "grammarPoints": [
    {
      "category": "verb_tenses",
      "examples": ["foi vs fui", "está vs estou"]
    }
  ],
  "performanceSummary": "Great job today! You're making excellent progress with verb conjugations.",
  "recommendedNextSteps": [
    "Practice more irregular verbs",
    "Review past tense conjugations",
    "Try having a conversation about food"
  ]
}
```

## 💻 Technology Stack

### Frontend Framework
- **React 19.2.3** + **TypeScript 5.8.2**
  - UI Building: React Components
  - Type Safety: TypeScript
  - Build Tool: Vite 6.2.0
  - Styling: Tailwind CSS
  - Icons: Lucide React

### AI & Intelligence
- **Google Gemini API** (`@google/generative-ai` ^0.24.1)
  - Gemini 3 Flash Preview (Fast chat)
  - Gemini 3 Pro Preview (Deep reasoning)
  - Gemini 2.5 Flash Native Audio (Real-time voice)
  - Gemini 2.5 Flash TTS (Text-to-speech)

### Data Visualization
- **Recharts 3.6.0**
  - Radar Charts (Skill overview)
  - Bar Charts (Grammar mastery)
  - Progress Indicators

### Storage
- **Vercel Postgres**
  - User progress
  - Vocabulary lists
  - Session history
  - Grammar corrections
  - Conversation messages

## 📐 Difficulty Adaptation

Iwry adjusts personality and complexity based on user level:

### A1 (Beginner)
- Patient, encouraging tone
- Simple vocabulary and short sentences
- Full English translations
- Basic grammar explanations
- Complete sentence responses (no abbreviations)

### A2 (Intermediate)
- Friendly, supportive tone
- Moderate complexity with Brazilian slang
- WhatsApp-style abbreviations (vc, tbm, blz)
- Occasional translations
- Intermediate grammar
- Emojis for engagement 🙂😊✌️

### B2 (Advanced)
- Sophisticated, peer-like tone
- Complex sentences and idioms
- Business and professional vocabulary
- Minimal translations
- Advanced grammar (subjunctive, conditionals)
- Cultural nuances and regional expressions

## 🎯 Learning Modes

### 1. 💬 Chat Mode - Natural Conversation
Primary learning mode with open-ended conversations.

**Features:**
- Bold Portuguese responses
- Italic English translations
- Fluency Tips after each response
- Grammar corrections via function calling
- Topics adapt to interests and difficulty level

### 2. 📱 Text Mode - WhatsApp Style (Intermediate)
Practice authentic Brazilian texting with slang:
- vc → você
- pq → porque
- tb → também
- blz → beleza
- kkk → Brazilian laugh
- rsrs → risos (laughter)

### 3. 🎙️ Live Voice - Real-Time Speaking
**Coming Soon:** Real-time voice conversations using microphone
- Model: Gemini 2.5 Flash Native Audio
- Features: Real-time transcription, instant voice responses
- 16kHz audio sampling input
- 24kHz speech synthesis output
- Voice: "Zephyr" (Brazilian Portuguese male)

## 📁 File Structure

```
iwry-app/
├── lib/
│   └── gemini.ts                          # Core AI service (v1 architecture)
├── app/
│   └── api/
│       ├── chat/
│       │   ├── message/route.ts           # Chat messages
│       │   └── greeting/route.ts          # Initial greeting
│       ├── dictionary/
│       │   └── lookup/route.ts            # Dictionary lookups (NEW)
│       ├── quiz/
│       │   └── generate/route.ts          # Quiz generation (NEW)
│       ├── lessons/
│       │   └── generate/route.ts          # Custom lessons (NEW)
│       ├── session/
│       │   └── analyze/route.ts           # Session analysis (NEW)
│       ├── translate/route.ts             # Quick translation
│       └── conversations/
│           ├── start/route.ts             # Start conversation
│           └── end/route.ts               # End conversation
└── docs/
    └── V1_ARCHITECTURE.md                 # This file
```

## 🔑 Key Improvements from v1 Architecture

1. ✅ **Model Differentiation** - Different AI models for different tasks
2. ✅ **Response Formatting** - Bold Portuguese, italic English, fluency tips
3. ✅ **Structured JSON Schemas** - Guaranteed formats for dictionary, quizzes, lessons
4. ✅ **Grammar Categories** - Aligned with v1 spec (6 categories)
5. ✅ **Session Analysis** - Structured vocabulary extraction and insights
6. ✅ **Custom Lessons** - Pro model for deep curriculum design
7. ✅ **Comprehensive Dictionary** - Full definitions with conjugations and examples

## 🚀 Usage Examples

### Chat Conversation
```typescript
import { sendMessage } from "@/lib/gemini";

const result = await sendMessage("Eu gosto de música brasileira", {
  difficulty: "beginner",
  accent: "sao-paulo",
  conversationHistory: []
});

console.log(result.response);
// **Que legal!** *How cool!* **Você tem algum artista favorito?**
// *Do you have a favorite artist?*
//
// 💡 Fluency Tip: Brazilians often use 'cara' as slang for 'dude'!

console.log(result.corrections);
// [{ mistake: "...", correction: "...", ... }]
```

### Dictionary Lookup
```typescript
import { getDictionaryDefinition } from "@/lib/gemini";

const definition = await getDictionaryDefinition("falar");
// Returns structured JSON with conjugations, examples, synonyms
```

### Generate Quiz
```typescript
import { generateQuiz } from "@/lib/gemini";

const quiz = await generateQuiz("Portuguese verbs", "intermediate", 5);
// Returns array of 5 multiple-choice questions
```

### Custom Lesson
```typescript
import { generateCustomLesson } from "@/lib/gemini";

const lesson = await generateCustomLesson(
  "Brazilian food culture",
  "beginner",
  ["Learn food vocabulary", "Order at restaurants"]
);
// Returns comprehensive lesson module
```

## 📞 Support

For questions about the v1 architecture implementation, refer to:
- This documentation file
- `/lib/gemini.ts` for AI service implementation
- API routes in `/app/api/` for endpoint usage

---

**Version:** 2.0 (v1 Architecture Alignment)
**Last Updated:** December 2024
**Maintained by:** Iwry Development Team
