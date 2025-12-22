# Iwry Portuguese Learning App 🇧🇷

![Version](https://img.shields.io/badge/version-1.0-blue)
![Status](https://img.shields.io/badge/status-development-yellow)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![Language](https://img.shields.io/badge/language-Portuguese%20(BR)-green)
![AI Powered](https://img.shields.io/badge/AI-Claude%20Powered-purple)

> **An AI-powered Portuguese learning assistant designed specifically for busy professionals working across US-Brazil contexts.**

---

## 📖 Table of Contents

- [What is Iwry?](#-what-is-iwry)
- [Who is This For?](#-who-is-this-for)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [App Architecture](#-app-architecture)
- [Product Vision](#-product-vision)
- [Success Metrics](#-success-metrics)
- [Development Roadmap](#-development-roadmap)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)

---

## 🎯 What is Iwry?

**Iwry** (Portuguese Learning Assistant) is a mobile application that helps English-speaking professionals learn Brazilian Portuguese through **conversational AI practice**. Unlike traditional language apps that rely on gamification and rigid lessons, Iwry focuses on real-world business scenarios and adapts to your busy schedule.

### The Problem We're Solving

Most language learning apps like Duolingo or Babbel:
- ❌ Use rigid lesson structures that don't fit busy professionals
- ❌ Lack real-world conversation practice
- ❌ Don't provide business-specific vocabulary
- ❌ Don't track and correct persistent mistakes intelligently
- ❌ Missing cultural context for Brazilian business settings

### Our Solution

Iwry provides:
- ✅ **Conversational AI** that practices with you 24/7
- ✅ **Two practice modes**: Voice conversations and WhatsApp-style texting
- ✅ **Smart mistake tracking** that routes errors to targeted practice
- ✅ **Business-focused content** for professional contexts
- ✅ **Cultural insights** about Brazilian business etiquette
- ✅ **Adaptive difficulty** that adjusts to your performance

---

## 👥 Who is This For?

<details>
<summary><strong>Primary Users: Business Professionals</strong></summary>

### "Executive Emma" - VP of Partnerships, Age 35

**Background:**
- Works at US tech company with Brazilian offices in São Paulo and Belo Horizonte
- Needs to conduct meetings in Portuguese without a translator
- Wants to build rapport with Brazilian partners

**Pain Points:**
- No time for traditional language classes
- Duolingo doesn't teach business vocabulary
- Embarrassed by mistakes in professional settings
- Needs conversation practice but has no partners available

**How She Uses Iwry:**
- Morning commute: 15-minute voice practice
- Lunch breaks: WhatsApp mode practice
- Evening: 5-minute corrections review
- Weekends: 20-30 minute deep-dive lessons

> *"I need to sound professional in Portuguese, not like I'm ordering at a restaurant."*

</details>

<details>
<summary><strong>Secondary Users: Entrepreneurs & Relocators</strong></summary>

### "Startup Sam" - Founder, Age 29

**Background:**
- Exploring Brazil market entry
- Pitching to Brazilian VCs and meeting potential co-founders
- Planning Brazil trip in 3 months

**Pain Points:**
- Inconsistent schedule makes classes impossible
- Needs business-specific vocabulary fast
- Requires legal/business terminology

**Usage Pattern:**
- Intense bursts: 3-4 sessions per day for 2 weeks
- Then maintenance mode: 2-3 sessions per week
- Focuses on specific topics before important meetings

> *"I'm pitching Brazilian VCs in 8 weeks. I need to at least understand their questions."*

</details>

---

## ✨ Key Features

### 🎤 1. Live Voice Practice

Real-time Portuguese conversations with AI that adapts to your skill level.

| Feature | Description |
|---------|-------------|
| **Difficulty Levels** | Beginner, Intermediate, Advanced |
| **Session Length** | Flexible: 5, 10, or 15 minutes |
| **Real-time Feedback** | Immediate corrections during conversation |
| **Pronunciation Help** | IPA notation and audio playback of correct pronunciation |
| **Visual Status** | Clear indicators: 🎤 Listening / 🤔 Processing / 🗣️ Speaking |
| **Post-Session Summary** | Spoken and written feedback with improvement suggestions |

**How It Works:**
1. Select your difficulty level and conversation topic
2. Speak in Portuguese - the AI responds naturally
3. Receive gentle corrections mid-conversation
4. Get a complete summary with all mistakes and new vocabulary
5. Route corrections to practice modules for reinforcement

---

### 💬 2. WhatsApp Mode (Text Practice)

Practice texting in Portuguese with realistic Brazilian slang and conversation patterns.

| Feature | Description |
|---------|-------------|
| **Realistic Interface** | Mimics WhatsApp: bubbles, timestamps, read receipts |
| **Brazilian Slang** | Learn abbreviations like "vc", "tbm", "blz" |
| **Inline Translation** | Tap any word for instant translation |
| **Natural Pacing** | AI doesn't respond instantly - feels like real texting |
| **Post-Chat Analysis** | Vocabulary breakdown, grammar patterns, cultural notes |

**Difficulty Adaptation:**
- **Beginner:** Standard Portuguese, minimal slang, full words
- **Intermediate:** Common abbreviations, moderate slang
- **Advanced:** Heavy slang, regional variations, complex abbreviations

---

### 🎯 3. Corrections Hub

Your personal mistake tracking system that turns errors into learning opportunities.

<details>
<summary><strong>How Corrections Are Captured</strong></summary>

The app automatically captures mistakes from:
- Voice practice conversations
- WhatsApp mode messages
- Lesson exercises
- Manual entry (for corrections from real-life conversations)

Each correction includes:
- ❌ What you said (mistake)
- ✅ Correct form
- 📚 Grammar rule explanation
- 🌍 Cultural context (why this matters)
- ⭐ Confidence score (1-5 stars)
- 📅 Next review date (spaced repetition)

</details>

<details>
<summary><strong>Practice Routing Options</strong></summary>

For each correction, choose how to practice:

1. **Flashcards:** Creates drill cards for conjugation or translation
2. **Conversation:** AI incorporates this pattern in next voice session
3. **WhatsApp Scenario:** Generates text conversation requiring this structure
4. **Mark as Mastered:** Archives for quarterly review

</details>

**Spaced Repetition System:**
```
First mistake → Review in 1 day → 3 days → 7 days → 14 days → 30 days
Three consecutive correct uses = MASTERED ✓
```

---

### 📊 4. Learning Dashboard

Visual progress tracking that shows your Portuguese journey at a glance.

<details>
<summary><strong>Progress Overview</strong></summary>

**At-a-Glance Stats:**
- 🎯 Current level (A2, B1, B2, C1) with progress ring
- 🔥 Days active streak
- ⏱️ Total conversation minutes this month
- 📚 Words mastered count

</details>

<details>
<summary><strong>Grammar Mastery Rings</strong></summary>

Visual progress rings for each grammar category:

| Grammar Category | What It Tracks |
|-----------------|----------------|
| Verb Conjugations | Present, past, future tenses |
| Subjunctive Mood | Complex verb moods |
| Prepositions | em vs. no, por vs. para |
| Gender Agreement | Masculine/feminine matching |
| Formal vs. Informal | Você vs. tu, business register |

Each ring shows:
- Percentage mastered (0-100%)
- Star rating (1-5 stars)
- Last practiced date

</details>

<details>
<summary><strong>Vocabulary Growth Chart</strong></summary>

Interactive line chart tracking:
- **Total words learned** (cumulative)
- **Active vocabulary** (used in last 30 days)
- **Passive vocabulary** (recognized but not used)
- **Retention rate** (words remembered from previous months)

Time ranges: 7 days, 30 days, 90 days, all time

</details>

**AI-Generated Daily Goals:**
The app creates personalized micro-goals based on your weak spots:
- "Practice 5 new prepositions today"
- "Complete one voice session on business meetings"
- "Review 10 corrections from last week"

---

### 📖 5. Structured Lessons

Traditional learning content organized by your needs.

**Lesson Library Organization:**
- Grammar topics (verb tenses, subjunctive, prepositions)
- Vocabulary themes (business, dining, travel, family)
- Difficulty levels (beginner, intermediate, advanced)
- AI-curated based on your mistakes

**Each Lesson Includes:**

1. **Core Explanation** (3-5 paragraphs)
2. **Grammar Deep Dive** (expandable sections):
   - Common mistakes with examples
   - Edge cases and exceptions
   - Regional variations
3. **Cultural Context** (Brazilian business/social norms)
4. **Practice Exercises** (5-10 interactive questions)
5. **Save Topic Button** (adds to practice queue)

**Example: Common Mistakes Format**

```
❌ Wrong: "Eu quero que você vai à reunião"
✅ Correct: "Eu quero que você vá à reunião"
📚 Why: Desire verbs (querer que) always trigger subjunctive mood
🌍 Context: Essential for professional requests in business settings
```

---

### 📝 6. Custom Vocabulary Library

Your personal dictionary with context and examples.

| Feature | Description |
|---------|-------------|
| **Manual Entry** | Add words with personal notes and context |
| **Auto-Add** | Save words from conversations, lessons, translations |
| **Organization** | Filter by category, tags, difficulty, frequency |
| **Context Tags** | business, casual, family, food, travel |
| **Practice Integration** | One-tap to create flashcards or use in conversations |

**Word Detail View:**
- Portuguese word/phrase
- English translation
- Example sentences (yours + AI-generated)
- Times used in practice
- Confidence score
- Last reviewed date
- Source (where you learned it)

---

### 🗂️ 7. Flashcard System

Spaced repetition for vocabulary and grammar mastery.

**Flashcard Types:**
- **Translation:** Portuguese ↔ English
- **Conjugation:** Verb + tense → correct form
- **Fill-in-blank:** Sentence with missing word
- **Multiple choice:** Grammar rule application

**Auto-Generated From:**
- Corrections Hub entries
- Vocabulary Library words
- Lesson exercises
- Manual creation

**Smart Review Algorithm:**
- Cards due today appear in daily goals
- "Cram mode" for pre-meeting review
- Self-rating system (Easy/Medium/Hard) adjusts intervals

---

## 🔧 How It Works

### User Journey Example: Morning Practice Session

```mermaid
graph LR
    A[Open App] --> B[View Dashboard]
    B --> C[See Daily Goal: Practice 5 words]
    C --> D[Start Voice Session]
    D --> E[AI: Bom dia! Como foi seu fim de semana?]
    E --> F[User speaks in Portuguese]
    F --> G[AI detects mistake: foste vs. foi]
    G --> H[AI: Quase! Better: Eu FUI ao parque]
    H --> I[Continue conversation]
    I --> J[Session ends - Summary shown]
    J --> K[Mistakes sent to Corrections Hub]
    K --> L[Create flashcards for practice]
```

### Learning Loop

```
1. PRACTICE (Voice or Text)
         ↓
2. MAKE MISTAKES (captured automatically)
         ↓
3. RECEIVE FEEDBACK (gentle, contextual)
         ↓
4. ROUTE TO PRACTICE (flashcards, conversations, scenarios)
         ↓
5. SPACED REPETITION (review at optimal intervals)
         ↓
6. MASTERY (three consecutive correct uses)
```

---

## 🏗️ App Architecture

### High-Level Architecture Overview

The app is built with a **modular architecture** that separates concerns and allows independent development of features.

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Voice UI │  │WhatsApp │  │Dashboard │  │ Lessons  │   │
│  │          │  │   UI     │  │    UI    │  │    UI    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AI Conversation Manager (Core Engine)        │  │
│  │  - Manages conversation flow                         │  │
│  │  - Routes user input to appropriate module           │  │
│  │  - Adapts difficulty based on performance            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Mistake    │  │  Spaced     │  │   Progress       │   │
│  │  Detector   │  │ Repetition  │  │   Tracker        │   │
│  │  & Routing  │  │  Engine     │  │                  │   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA & AI SERVICES LAYER                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Claude AI  │  │   Speech     │  │   Translation   │  │
│  │   (Anthropic)│  │   Services   │  │   Services      │  │
│  │              │  │  (STT/TTS)   │  │                 │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA STORAGE LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ User Data DB │  │ Corrections  │  │  Vocabulary     │  │
│  │ (Profile,    │  │  Database    │  │  Library DB     │  │
│  │  Progress)   │  │              │  │                 │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Module Breakdown

<details>
<summary><strong>Module 1: Live Voice Practice</strong></summary>

**Components:**
- **Voice Input Handler:** Captures user speech via microphone
- **Speech-to-Text Engine:** Converts Portuguese speech to text (85%+ accuracy target)
- **AI Conversation Manager:** Sends user input to Claude AI, receives responses
- **Text-to-Speech Engine:** Converts AI responses to natural Brazilian Portuguese audio
- **Mistake Detector:** Analyzes user input for grammatical/pronunciation errors in real-time
- **Session Manager:** Tracks conversation flow, timing, difficulty adaptation

**Data Flow:**
```
User speaks → Microphone → STT → Text → Claude AI → Response → TTS → Audio playback
                                    ↓
                            Mistake Detector → Corrections Hub
```

**Technical Requirements:**
- Speech-to-text accuracy: 85%+ for Portuguese
- Text-to-speech: Natural Brazilian Portuguese accent (São Paulo or Rio)
- Response latency: <3 seconds from user speech end to AI response start
- Session persistence: Auto-save if app crashes

</details>

<details>
<summary><strong>Module 2: WhatsApp Mode (Text Practice)</strong></summary>

**Components:**
- **Chat UI Renderer:** Creates WhatsApp-style interface (bubbles, timestamps, read receipts)
- **Input Handler:** Manages text input, emoji support
- **Conversation AI:** Generates contextual responses with appropriate slang/abbreviations
- **Inline Translation Service:** Provides instant word/phrase translations on tap
- **Difficulty Adapter:** Adjusts AI responses based on user level (beginner/intermediate/advanced)

**Data Flow:**
```
User types message → AI processes → Generates response → Renders in chat UI
                          ↓
                   Mistake Detector → Corrections Hub
                          ↓
                   Vocabulary Tracker → Suggests additions to library
```

**Technical Requirements:**
- Message rendering latency: <500ms
- Translation lookup: <1 second
- Conversation history: Store last 30 conversations per user
- Offline support: Display cached conversations

</details>

<details>
<summary><strong>Module 3: Corrections Hub</strong></summary>

**Components:**
- **Correction Capture Service:** Auto-collects mistakes from all practice modes
- **Deduplication Engine:** Prevents duplicate entries for same mistake
- **Spaced Repetition Scheduler:** Calculates optimal review intervals
- **Practice Router:** Routes corrections to flashcards, conversations, or scenarios
- **Mastery Tracker:** Monitors progress on each correction (confidence scoring)

**Data Flow:**
```
Mistake detected → Correction created → Stored in database → Scheduled for review
                                              ↓
                                    User chooses practice method
                                              ↓
                                  Routed to appropriate module
                                              ↓
                                    Performance tracked → Confidence score updated
```

**Spaced Repetition Schedule:**
- Day 1 → Day 3 → Day 7 → Day 14 → Day 30
- Three consecutive correct uses = Mastered
- Mastered items reviewed quarterly

</details>

<details>
<summary><strong>Module 4: Learning Dashboard</strong></summary>

**Components:**
- **Data Aggregation Service:** Collects stats from all modules
- **Visualization Engine:** Generates charts and progress rings
- **Goal Generator:** AI creates personalized daily micro-goals
- **Analytics Tracker:** Monitors engagement, retention, progress metrics

**Data Flow:**
```
User activity across all modules → Aggregation service → Database
                                          ↓
                              Calculate metrics (streak, level, vocabulary count)
                                          ↓
                              Generate visualizations → Display on dashboard
```

**Performance Targets:**
- Dashboard load time: <2 seconds
- Real-time updates: Refresh on session completion
- Data caching: Store computed stats to reduce API calls

</details>

<details>
<summary><strong>Module 5: Structured Lessons (LessonsView)</strong></summary>

**Components:**
- **Lesson Content Manager:** Stores lessons as structured JSON
- **Rendering Engine:** Displays rich text (bold, italics, bullet points)
- **Exercise Handler:** Manages interactive questions and instant feedback
- **Topic Saver:** Adds lesson topics to practice queue for Voice/WhatsApp integration

**Data Flow:**
```
User selects lesson → Load content from database → Render on screen
                                ↓
                    User completes exercises → Track performance
                                ↓
                    Mistakes → Corrections Hub
                    Vocabulary → Suggest additions to library
```

**Lesson Content Structure (JSON):**
```json
{
  "title": "Subjunctive Mood in Business Contexts",
  "difficulty": "intermediate",
  "sections": [
    {"type": "explanation", "content": "..."},
    {"type": "grammar_deep_dive", "content": "..."},
    {"type": "cultural_context", "content": "..."},
    {"type": "exercises", "questions": [...]}
  ]
}
```

</details>

<details>
<summary><strong>Module 6: Custom Vocabulary Library</strong></summary>

**Components:**
- **Entry Manager:** Handles manual word additions
- **Auto-Add Service:** Captures words from conversations, lessons, translations
- **Organization Engine:** Filters/sorts by category, tags, difficulty
- **Search Service:** Full-text search across all fields
- **Sync Manager:** Real-time sync across devices

**Database Schema (simplified):**
```
VocabularyEntry {
  id: uuid
  word: string
  translation: string
  example_sentence: string
  personal_note: string
  context_tags: array
  difficulty: string
  times_used: integer
  confidence_score: integer (1-5)
  last_reviewed: timestamp
  source: string
}
```

</details>

<details>
<summary><strong>Module 7: Flashcard System</strong></summary>

**Components:**
- **Card Generator:** Auto-creates flashcards from corrections and vocabulary
- **Review Scheduler:** Implements spaced repetition algorithm
- **Quiz Engine:** Presents cards and collects user responses
- **Performance Tracker:** Adjusts review intervals based on user self-rating

**Spaced Repetition Algorithm:**
```python
def calculate_next_review(user_rating, current_interval):
    if user_rating == "Hard":
        return current_interval * 0.8  # Review sooner
    elif user_rating == "Medium":
        return current_interval * 1.5  # Standard progression
    elif user_rating == "Easy":
        return current_interval * 2.5  # Review much later
```

</details>

---

## 🎯 Product Vision

### Core Principles

1. **Conversation-First**
   - Learning happens through doing, not studying
   - Real conversations with AI, not multiple-choice questions

2. **Adaptive Intelligence**
   - AI adjusts difficulty based on performance, not rigid lesson plans
   - Personalized learning paths for each user

3. **Mistake-Driven**
   - Errors become practice opportunities through smart routing
   - Persistent tracking ensures mistakes are corrected

4. **Cultural Fluency**
   - Language tied to real-world Brazilian business and social contexts
   - Cultural insights embedded throughout the app

5. **Respect for Time**
   - Sessions designed for 5-15 minute blocks
   - Mobile-optimized for on-the-go learning

---

## 📈 Success Metrics

### Target Metrics for Launch

<details>
<summary><strong>Engagement Metrics</strong></summary>

| Metric | Target | What It Measures |
|--------|--------|------------------|
| DAU/MAU Ratio | 35%+ | Daily engagement vs. monthly base |
| Sessions per Week | 5+ | User retention and habit formation |
| Average Session Length | 8-12 min | Engagement without friction |
| Feature Usage | 60%+ | Users using both voice and text modes monthly |

</details>

<details>
<summary><strong>Learning Outcome Metrics</strong></summary>

| Metric | Target | What It Measures |
|--------|--------|------------------|
| Corrections Mastered | 10+ per month | Progress on mistake correction |
| Vocabulary Retention | 70%+ after 30 days | Long-term knowledge retention |
| Grammar Pattern Mastery | 3+ patterns to 80%+ | Proficiency in specific grammar areas |
| User-Reported Confidence | 70%+ improvement | Self-assessed progress (30-day survey) |

</details>

<details>
<summary><strong>Retention Metrics</strong></summary>

| Metric | Target | Critical Point |
|--------|--------|----------------|
| Day 1 Retention | 80%+ | First impression success |
| Day 7 Retention | 60%+ | Habit formation |
| Day 30 Retention | 40%+ | Long-term engagement |
| 90-Day Paying Conversion | 25%+ | Monetization readiness |

</details>

<details>
<summary><strong>Quality Metrics</strong></summary>

| Metric | Target | What It Measures |
|--------|--------|------------------|
| Correction Accuracy | 90%+ | AI corrections are grammatically valid |
| Cultural Tip Relevance | 80%+ | Users find tips helpful (monthly survey) |
| Voice Recognition Accuracy | 85%+ | Word accuracy in transcription |

</details>

---

## 🗓️ Development Roadmap

### Phase 1: MVP Development (Months 1-3)

**Milestone:** Launch to 50 beta users

- [ ] **Week 1-4: Core Infrastructure**
  - Set up development environment
  - Configure Claude AI API integration
  - Set up database and user authentication
  - Build basic user profiles

- [ ] **Week 5-8: Voice Practice Module**
  - Implement speech-to-text (Portuguese)
  - Implement text-to-speech (Brazilian accent)
  - Build AI conversation manager
  - Create mistake detection system
  - Design voice practice UI

- [ ] **Week 9-10: WhatsApp Mode**
  - Build chat interface
  - Implement inline translation
  - Create slang/abbreviation system
  - Add post-conversation breakdown

- [ ] **Week 11-12: Corrections Hub & Dashboard**
  - Build corrections database
  - Implement spaced repetition scheduler
  - Create practice routing system
  - Design dashboard visualizations
  - Build progress tracking

### Phase 2: Feature Expansion (Months 4-6)

**Milestone:** Achieve 60% weekly active user rate

- [ ] **Structured Lessons Module**
  - Create lesson content library (20 initial lessons)
  - Build exercise system
  - Add cultural context sections
  - Implement topic saving for practice integration

- [ ] **Custom Vocabulary Library**
  - Build entry management system
  - Implement auto-add from conversations
  - Create organization and search features
  - Add practice integration

- [ ] **Flashcard System**
  - Build card generator
  - Implement spaced repetition
  - Create quiz engine
  - Add performance tracking

### Phase 3: Optimization & Scale (Months 7-9)

**Milestone:** Validate product-market fit

- [ ] **Performance Optimization**
  - Improve response times
  - Optimize database queries
  - Implement caching strategies
  - Add offline support

- [ ] **Advanced Features**
  - AI-generated weekly focus recommendations
  - Enhanced cultural context database
  - Regional variation support (São Paulo, Rio, Northeast)
  - Business scenario library

- [ ] **Analytics & Insights**
  - Build comprehensive analytics dashboard
  - Implement A/B testing framework
  - Create user feedback collection system

### Phase 4: Monetization & Growth (Months 10-12)

**Milestone:** Prepare for commercial launch

- [ ] **Subscription System**
  - Implement payment processing
  - Create subscription tiers
  - Build admin dashboard for subscriptions

- [ ] **Marketing & Partnerships**
  - Establish university language program partnerships
  - Corporate training partnerships
  - Content marketing strategy

- [ ] **Platform Expansion**
  - iOS app optimization
  - Android app optimization
  - Web app development
  - Cross-platform sync

---

## 💻 Technology Stack

### Frontend (Mobile App)

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React Native** | Cross-platform mobile framework | Single codebase for iOS and Android |
| **TypeScript** | Type-safe JavaScript | Reduces bugs, improves code quality |
| **Redux / Context API** | State management | Centralized app state for complex interactions |
| **React Navigation** | Screen navigation | Industry standard for React Native |
| **Expo** | Development toolchain | Faster development and testing |

### Backend Services

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Node.js + Express** | API server | JavaScript ecosystem, scalable |
| **PostgreSQL** | Primary database | Robust, supports complex queries |
| **Redis** | Caching layer | Fast session storage and caching |
| **AWS S3** | Voice recording storage | Scalable cloud storage |
| **WebSockets** | Real-time updates | Live session management |

### AI & Language Services

| Service | Purpose | Provider |
|---------|---------|----------|
| **Claude AI** | Conversational AI engine | Anthropic |
| **Google Cloud Speech-to-Text** | Portuguese STT | Google Cloud |
| **Google Cloud Text-to-Speech** | Brazilian Portuguese TTS | Google Cloud |
| **Google Cloud Translation** | Inline translation service | Google Cloud |

### DevOps & Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **AWS ECS / Kubernetes** | Container orchestration |
| **GitHub Actions** | CI/CD pipeline |
| **Sentry** | Error tracking |
| **Mixpanel / Amplitude** | Analytics |

### Security & Compliance

| Feature | Implementation |
|---------|----------------|
| **Authentication** | OAuth 2.0 (Google, Apple Sign-In) |
| **Data Encryption** | End-to-end for voice recordings |
| **Compliance** | GDPR/CCPA compliant data handling |
| **API Security** | Rate limiting, JWT tokens |

---

## 🚀 Getting Started

### For Developers

<details>
<summary><strong>Prerequisites</strong></summary>

- Node.js v18+
- npm or yarn
- React Native development environment (Xcode for iOS, Android Studio for Android)
- Expo CLI
- PostgreSQL database
- Claude AI API key (from Anthropic)
- Google Cloud account (for speech services)

</details>

<details>
<summary><strong>Installation</strong></summary>

```bash
# Clone the repository
git clone https://github.com/therealchandlerbing/Iwry-Learning-App-v2.git

# Navigate to project directory
cd Iwry-Learning-App-v2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Set up database
npm run db:migrate

# Start development server
npm run dev

# Run mobile app (iOS)
npm run ios

# Run mobile app (Android)
npm run android
```

</details>

<details>
<summary><strong>Project Structure</strong></summary>

```
iwry-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # App screens/views
│   │   ├── VoicePractice/
│   │   ├── WhatsAppMode/
│   │   ├── CorrectionsHub/
│   │   ├── Dashboard/
│   │   ├── Lessons/
│   │   └── Settings/
│   ├── services/            # API and external services
│   │   ├── claudeAI.ts
│   │   ├── speech.ts
│   │   └── translation.ts
│   ├── store/               # Redux/state management
│   ├── utils/               # Helper functions
│   ├── types/               # TypeScript type definitions
│   └── navigation/          # Navigation configuration
├── server/                  # Backend API
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── database/
│   ├── migrations/
│   └── seeds/
└── docs/                    # Documentation
```

</details>

### For Product Managers & Stakeholders

<details>
<summary><strong>Understanding the Development Process</strong></summary>

**Current Status:** In development planning phase

**What's Been Done:**
- ✅ Product requirements documented
- ✅ User personas defined
- ✅ Feature specifications completed
- ✅ Architecture designed

**Next Steps:**
1. Set up development environment
2. Build MVP (Voice Practice + WhatsApp Mode + Corrections Hub)
3. Beta testing with 50 users
4. Iterate based on feedback
5. Add advanced features
6. Launch commercially

**Timeline:**
- MVP: 3 months
- Feature expansion: 3 months
- Optimization: 3 months
- Commercial launch: Month 12

</details>

<details>
<summary><strong>How to Provide Feedback</strong></summary>

We welcome feedback from all stakeholders:

- **Product feedback:** Create an issue with the "enhancement" label
- **Bug reports:** Create an issue with the "bug" label
- **Feature requests:** Create an issue with the "feature-request" label
- **General questions:** Create an issue with the "question" label

**For Beta Testers:**
- Use in-app feedback form
- Weekly feedback surveys
- Monthly video interviews

</details>

---

## 📊 Comparison with Competitors

### How Iwry Differs from Traditional Language Apps

| Feature | Duolingo | Babbel | Rosetta Stone | **Iwry** |
|---------|----------|--------|---------------|----------|
| **AI Conversation** | ❌ | ❌ | Limited | ✅ Unlimited |
| **Business Vocabulary** | Limited | Some | ❌ | ✅ Extensive |
| **Cultural Context** | ❌ | Some | ❌ | ✅ Brazilian-specific |
| **Adaptive Correction** | Basic | Basic | Basic | ✅ Advanced routing |
| **Voice Practice** | Limited | Limited | ✅ | ✅ Real-time AI |
| **Text Practice** | ❌ | ❌ | ❌ | ✅ WhatsApp-style |
| **Flexible Sessions** | ❌ Rigid | ❌ Rigid | ❌ Rigid | ✅ 5-15 min blocks |
| **Professional Focus** | ❌ | Partial | ❌ | ✅ Primary focus |
| **Mistake Tracking** | Basic | Basic | Basic | ✅ Intelligent hub |
| **Brazilian Portuguese** | Available | Available | Available | ✅ **Specialized** |

---

## 🤝 Contributing

We welcome contributions from developers, language experts, and Brazilian Portuguese speakers!

<details>
<summary><strong>Ways to Contribute</strong></summary>

- **Code:** Submit pull requests for bug fixes or features
- **Content:** Help create lesson content or cultural context
- **Translation:** Improve Portuguese translations and examples
- **Testing:** Report bugs and test new features
- **Documentation:** Improve this README or other documentation

</details>

<details>
<summary><strong>Contribution Guidelines</strong></summary>

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Standards:**
- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation as needed
- Follow existing code style

</details>

---

## 📄 License

This project is proprietary software. All rights reserved.

**Author:** Chandler Lewis
**Version:** 1.0
**Last Updated:** December 21, 2024
**Status:** Development

---

## 📞 Contact & Support

- **Project Lead:** Chandler Lewis
- **Repository:** [github.com/therealchandlerbing/Iwry-Learning-App-v2](https://github.com/therealchandlerbing/Iwry-Learning-App-v2)
- **Documentation:** See `/docs` folder for detailed specifications
- **Issues:** Use GitHub Issues for bug reports and feature requests

---

## 🎓 Additional Resources

<details>
<summary><strong>Product Documents</strong></summary>

- [Full Product Requirements Document (PRD)](./PRD%20-%20Iwry%20Portuguese%20Learning%20App%20-%20LONG.docx)
- [Condensed PRD](./Product%20Requirements%20Document_Claude_12.21.25.docx)

</details>

<details>
<summary><strong>Learning About the Tech</strong></summary>

**For Non-Technical Readers:**

- **What is AI?** The app uses Claude AI (made by Anthropic) - it's like having a Portuguese-speaking conversation partner available 24/7
- **What is Speech-to-Text?** Technology that converts your spoken words into written text
- **What is Text-to-Speech?** Technology that converts written text into natural-sounding speech
- **What is Spaced Repetition?** A learning technique where you review information at increasing intervals to improve long-term retention
- **What is an API?** Application Programming Interface - how different software components talk to each other

**Helpful Analogies:**
- **Claude AI:** Like hiring a Brazilian Portuguese tutor who never sleeps
- **Corrections Hub:** Like a personal coach who remembers every mistake you've ever made and creates custom drills
- **Dashboard:** Like a fitness tracker, but for language learning
- **WhatsApp Mode:** Like texting a Brazilian friend for practice

</details>

---

<div align="center">

**Built with ❤️ for professionals learning Brazilian Portuguese**

*Vamos aprender português juntos!* (Let's learn Portuguese together!)

![Brazilian Flag](https://img.shields.io/badge/Made_for-Brazil-009c3b?style=for-the-badge)

</div>
