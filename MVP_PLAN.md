# Iwry Portuguese Learning App - MVP Implementation Plan

## Executive Summary

This plan outlines building an iPhone-optimized web MVP of the Iwry Portuguese Learning App that can be deployed to Vercel. The MVP focuses on core conversational learning features while setting up architecture for future iOS app conversion.

**Target: Launch-ready MVP in current sprint**

---

## 🎯 MVP Scope Definition

### ✅ INCLUDED in MVP (Phase 1)

**Core Features:**
1. **Text-Based Conversation Practice** (WhatsApp-style interface)
   - Real-time chat with AI in Portuguese
   - Beginner/Intermediate/Advanced difficulty levels
   - Inline word translation (tap-to-translate)
   - Brazilian slang and abbreviations based on level
   - Session summary with mistakes captured

2. **Basic Corrections Tracking**
   - Automatic mistake capture from conversations
   - Simple list view of corrections
   - What you said vs. correct form
   - Grammar explanation

3. **Simple Progress Dashboard**
   - Total conversations count
   - Vocabulary words learned
   - Corrections captured
   - Current streak

4. **User Authentication**
   - Email/password login
   - Simple user profile
   - Session persistence

5. **Mobile-First Responsive Design**
   - Optimized for iPhone (responsive web)
   - PWA-ready (installable to home screen)
   - Offline-ready shell

### ⏸️ DEFERRED to Post-MVP

**Features to build later:**
- Voice practice (STT/TTS)
- Spaced repetition system
- Flashcard system
- Structured lessons library
- Advanced analytics/charts
- Custom vocabulary library management
- Grammar mastery rings
- AI-generated daily goals
- Advanced cultural context database
- Multiple language support

---

## 💻 Technical Architecture

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 14 (App Router) | Vercel-optimized, SSR, great DX |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS | Rapid development, mobile-first |
| **UI Components** | shadcn/ui | High-quality, accessible components |
| **AI Model** | Google Gemini 2.0 Flash | Fast, cost-effective, multilingual |
| **Database** | Vercel Postgres (Neon) | Serverless, easy Vercel integration |
| **Auth** | NextAuth.js v5 | Industry standard, easy setup |
| **State Management** | React Context + Hooks | Sufficient for MVP, no Redux needed |
| **Deployment** | Vercel | Requested platform, zero-config |

### Why Gemini 2.0 Flash?

- **Multilingual excellence**: Strong Portuguese support
- **Speed**: Sub-second response times
- **Cost-effective**: Free tier generous for MVP
- **Context window**: 1M tokens supports long conversations
- **Function calling**: Can structure corrections/vocabulary extraction
- **Streaming**: Real-time chat experience

### Database Schema (Simplified for MVP)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Settings
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  difficulty_level VARCHAR(20) DEFAULT 'beginner',
  native_language VARCHAR(10) DEFAULT 'en'
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  difficulty_level VARCHAR(20),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  message_count INTEGER DEFAULT 0
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR(20), -- 'user' or 'assistant'
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Corrections
CREATE TABLE corrections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  conversation_id UUID REFERENCES conversations(id),
  mistake TEXT,
  correction TEXT,
  explanation TEXT,
  grammar_category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  confidence_score INTEGER DEFAULT 1
);

-- Vocabulary
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  word VARCHAR(255),
  translation VARCHAR(255),
  context TEXT,
  times_encountered INTEGER DEFAULT 1,
  first_seen_at TIMESTAMP DEFAULT NOW()
);
```

### Project Structure

```
iwry-mvp/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── practice/
│   │   ├── corrections/
│   │   └── profile/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── chat/
│   │   ├── corrections/
│   │   └── progress/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn components
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── InputBox.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   └── ProgressOverview.tsx
│   └── corrections/
│       └── CorrectionCard.tsx
├── lib/
│   ├── gemini.ts        # Gemini API client
│   ├── db.ts            # Database client
│   ├── auth.ts          # NextAuth config
│   └── utils.ts
├── hooks/
│   ├── useChat.ts
│   └── useCorrections.ts
└── types/
    └── index.ts
```

---

## 🏗️ Feature Implementation Details

### 1. Chat Interface (WhatsApp Mode)

**User Flow:**
1. User selects difficulty level (Beginner/Intermediate/Advanced)
2. AI greets user in Portuguese
3. User types response in Portuguese
4. AI responds naturally with contextual Brazilian Portuguese
5. Inline translation: tap any word for instant English translation
6. Conversation continues for flexible duration
7. User can end session anytime
8. Summary shows: mistakes, new vocabulary, encouragement

**AI System Prompt (Gemini):**

```typescript
const systemPrompts = {
  beginner: `You are a friendly Portuguese tutor speaking Brazilian Portuguese.
  - Use simple vocabulary and clear grammar
  - Speak in complete sentences (no abbreviations)
  - If user makes mistakes, gently correct them
  - Keep conversations casual but educational
  - Topics: greetings, family, food, basic business
  - Detect mistakes and provide corrections in this JSON format:
    {
      "mistake": "original text",
      "correction": "correct version",
      "explanation": "why this is correct",
      "category": "grammar category"
    }`,

  intermediate: `You are a Brazilian friend chatting naturally.
  - Use common abbreviations (vc, tbm, blz, td bem)
  - Mix formal and informal language
  - Correct mistakes more subtly
  - Topics: work, culture, travel, current events
  - Brazilian slang is encouraged`,

  advanced: `You are a Brazilian business colleague.
  - Use professional vocabulary
  - Complex sentence structures
  - Regional expressions from São Paulo/Rio
  - Business idioms and cultural references
  - Assume fluency, provide nuanced corrections`
};
```

**Tap-to-Translate Feature:**
- Each Portuguese word wrapped in `<span>` with data attribute
- Click handler fetches translation via Gemini API
- Inline tooltip shows translation
- Adds word to vocabulary list

**Mistake Detection:**
- Use Gemini function calling to extract corrections during conversation
- Store corrections in database
- Show gentle inline feedback during chat
- Full summary at session end

### 2. Corrections Dashboard

**Simple List View:**
- Shows all captured mistakes
- Displays: ❌ Mistake → ✅ Correction
- Grammar explanation expandable
- Filter by category (verbs, prepositions, etc.)
- Date captured

**Data displayed:**
```typescript
interface Correction {
  id: string;
  mistake: string;
  correction: string;
  explanation: string;
  category: string;
  conversationContext: string;
  createdAt: Date;
  confidenceScore: number; // 1-5 stars
}
```

### 3. Progress Dashboard

**Simple Stats Cards:**

```
┌─────────────────────┐  ┌─────────────────────┐
│  🗣️ Conversations   │  │  📚 Words Learned   │
│       15            │  │       87            │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│  ✅ Corrections     │  │  🔥 Streak          │
│       23            │  │     5 days          │
└─────────────────────┘  └─────────────────────┘
```

**Quick Actions:**
- Start New Conversation
- Review Corrections
- View Vocabulary

### 4. Authentication

**NextAuth.js Setup:**
- Email/password provider (credentials)
- JWT-based sessions
- Protected routes via middleware
- Simple profile page (name, email, difficulty preference)

---

## 📱 Mobile Optimization Strategy

### iPhone-Specific Optimizations

1. **Responsive Design:**
   - Mobile-first Tailwind breakpoints
   - Touch-optimized buttons (min 44x44px)
   - Safe area insets for notched iPhones
   - Prevent zoom on input focus

2. **PWA Configuration:**
   ```json
   {
     "name": "Iwry Portuguese",
     "short_name": "Iwry",
     "display": "standalone",
     "theme_color": "#009c3b",
     "background_color": "#ffffff",
     "icons": [...]
   }
   ```

3. **Performance:**
   - Next.js image optimization
   - Route prefetching
   - Optimistic UI updates
   - Skeleton loaders

4. **iOS App Preparation:**
   - Clean API architecture (ready for native app to consume)
   - Shared database schema
   - JWT auth works for both web and native
   - Design system documented for iOS developers

---

## 🚀 Implementation Plan

### Phase 1: Foundation (Steps 1-4)

**Step 1: Project Setup**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Install dependencies (Tailwind, shadcn/ui, NextAuth)
- [ ] Set up Vercel Postgres database
- [ ] Configure Gemini API client
- [ ] Set up environment variables

**Step 2: Authentication**
- [ ] Implement NextAuth.js with email/password
- [ ] Create login/register pages
- [ ] Protected route middleware
- [ ] User profile page
- [ ] Database schema for users

**Step 3: Database & Models**
- [ ] Create database migrations
- [ ] Set up Postgres connection
- [ ] Create TypeScript types/interfaces
- [ ] Seed initial data (sample conversations for testing)

**Step 4: Core UI Components**
- [ ] Install and configure shadcn/ui
- [ ] Create base layout (navigation, header)
- [ ] Mobile-responsive navigation
- [ ] Theme setup (Brazilian colors: green, yellow, blue)

### Phase 2: Chat Feature (Steps 5-7)

**Step 5: Gemini Integration**
- [ ] Set up Gemini API client
- [ ] Create system prompts (beginner/intermediate/advanced)
- [ ] Test conversation flow
- [ ] Implement streaming responses
- [ ] Error handling

**Step 6: Chat Interface**
- [ ] WhatsApp-style chat UI
- [ ] Message bubbles (user vs AI)
- [ ] Input box with send button
- [ ] Typing indicators
- [ ] Timestamp display
- [ ] Session management

**Step 7: Mistake Detection & Translation**
- [ ] Function calling for correction extraction
- [ ] Store corrections in database
- [ ] Tap-to-translate feature
- [ ] Session summary generation
- [ ] Vocabulary auto-extraction

### Phase 3: Dashboard & Corrections (Steps 8-9)

**Step 8: Progress Dashboard**
- [ ] Fetch user stats (API endpoints)
- [ ] Stats cards display
- [ ] Quick action buttons
- [ ] Responsive grid layout

**Step 9: Corrections View**
- [ ] Fetch corrections from database
- [ ] List view with cards
- [ ] Filter by category
- [ ] Expandable explanations
- [ ] Empty states

### Phase 4: Polish & Deploy (Steps 10-12)

**Step 10: Mobile Optimization**
- [ ] PWA manifest and service worker
- [ ] Add to home screen prompt
- [ ] Touch optimizations
- [ ] iOS safe area handling
- [ ] Performance audit

**Step 11: Testing**
- [ ] Test all user flows
- [ ] Mobile device testing (iPhone)
- [ ] Fix bugs
- [ ] Accessibility check
- [ ] Performance optimization

**Step 12: Deployment**
- [ ] Configure Vercel project
- [ ] Set up environment variables
- [ ] Deploy to production
- [ ] Custom domain setup (if applicable)
- [ ] Monitor errors and performance

---

## 🎨 Design System

### Color Palette (Brazilian Theme)

```css
:root {
  /* Primary - Brazilian Green */
  --primary: 142 71% 45%;
  --primary-foreground: 0 0% 100%;

  /* Secondary - Brazilian Yellow */
  --secondary: 48 100% 50%;
  --secondary-foreground: 0 0% 0%;

  /* Accent - Brazilian Blue */
  --accent: 210 100% 40%;
  --accent-foreground: 0 0% 100%;

  /* Backgrounds */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;

  /* Muted */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
}
```

### Typography
- Font: Inter (clean, modern, excellent Portuguese diacritics support)
- Headings: Bold, large for key stats
- Body: Regular, comfortable reading size (16px base)

---

## 📊 Success Metrics for MVP

**Launch Goals:**
1. ✅ Fully functional chat in 3 difficulty levels
2. ✅ Mistake detection accuracy >80%
3. ✅ Mobile-responsive on iPhone (tested on Safari)
4. ✅ <2s page load time on 4G
5. ✅ Deployed to Vercel with custom domain

**User Testing (Post-Launch):**
- 5 beta testers complete 3 conversations each
- Collect feedback on UI/UX
- Measure: time to first conversation, errors encountered
- Iterate based on feedback

---

## 🔮 Post-MVP Roadmap

### Phase 2 Features (Priority Order)

1. **Voice Practice Integration**
   - Web Speech API for STT (browser-native)
   - Google Cloud TTS for AI responses
   - Voice session recording

2. **Spaced Repetition for Corrections**
   - Review scheduling algorithm
   - Daily review reminders
   - Confidence scoring

3. **Flashcard System**
   - Auto-generate from corrections
   - Quiz mode
   - Progress tracking

4. **Enhanced Analytics**
   - Charts (vocabulary growth over time)
   - Grammar category breakdown
   - Detailed progress reports

5. **iOS Native App**
   - React Native or Swift
   - Reuse existing API backend
   - Native STT/TTS

---

## 💰 Cost Estimate (Monthly)

**MVP Running Costs:**
- Vercel Hosting: $0 (free tier, ~100k requests/month)
- Vercel Postgres: $0 (free tier, 256MB storage)
- Gemini API: $0-20 (free tier generous, paid if >50 users)
- Domain: $12/year (optional)

**Total: $0-2/month for MVP** 🎉

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gemini Portuguese quality issues | High | Test extensively, have fallback prompts |
| Mobile performance on older iPhones | Medium | Optimize bundle size, lazy load |
| Correction detection accuracy low | High | Use structured function calling, iterate on prompts |
| User drops off during first session | Medium | Strong onboarding, immediate value demonstration |

---

## 🤝 Decision Points for Approval

**Please confirm:**

1. ✅ MVP scope appropriate? (Chat + Corrections + Dashboard)
2. ✅ Tech stack approved? (Next.js + Gemini + Vercel Postgres)
3. ✅ Okay to defer voice practice to post-MVP?
4. ✅ Any specific features you want added/removed?
5. ✅ Domain name ready or use vercel.app subdomain?

---

## 📝 Next Steps After Approval

1. Initialize Next.js project
2. Set up database schema
3. Integrate Gemini API
4. Build chat interface
5. Deploy to Vercel
6. Test on iPhone
7. Iterate based on your feedback

**Estimated Time to MVP: 1-2 days of focused development**

---

## Questions for You

1. Do you have a Gemini API key, or should I guide you through setup?
2. Do you have a Vercel account with Postgres enabled?
3. Any specific Portuguese dialect preferences? (São Paulo, Rio, generic Brazilian?)
4. Want to start with all 3 difficulty levels or just one for MVP?
5. Any design preferences or brand colors beyond the Brazilian theme?

Let me know if you approve this plan or want any adjustments! 🚀
