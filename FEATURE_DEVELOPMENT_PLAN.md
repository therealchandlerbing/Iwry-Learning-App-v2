# Iwry Learning App - Feature Development Plan

**Last Updated:** December 23, 2025
**Current Status:** MVP Phase 1 (Core Chat) Complete
**Next Phase:** MVP Phase 2 (Enhanced Features)

---

## 📊 Current State Assessment

### ✅ **Completed Features (MVP Phase 1)**

1. **Authentication System**
   - NextAuth.js with email/password
   - Protected routes
   - User sessions
   - Basic user profile

2. **Database Architecture**
   - PostgreSQL schema (Vercel Postgres)
   - Tables: users, user_settings, conversations, messages, corrections, vocabulary
   - Indexes for performance
   - Migration system

3. **WhatsApp-Style Chat Interface**
   - Real-time messaging with Gemini AI
   - Difficulty levels (beginner, intermediate, advanced)
   - Accent selection (São Paulo, Rio, Northeast, European)
   - Message bubbles with timestamps
   - Typing indicators
   - Auto-scroll

4. **Corrections Tracking**
   - Automatic mistake capture from AI
   - Corrections database
   - Grammar category classification
   - Confidence scoring (1-5 stars)
   - List view with filters

5. **Progress Dashboard**
   - Total conversations count
   - Vocabulary words tracked
   - Corrections count
   - Streak tracking
   - Achievement badges
   - Quick action cards

6. **Translation Feature**
   - Tap-to-translate any word
   - Inline translation display
   - API endpoint for translations

7. **UI/UX**
   - Dark mode neon design (cyan, purple, orange accents)
   - Mobile-responsive layout
   - Brazilian flag color theme
   - Glow effects and animations
   - Professional typography

---

## 🚀 Priority Feature Roadmap

### **PHASE 2A: Core Feature Enhancement** (Priority: HIGH)
**Timeline: 1-2 weeks**

These features build on what's working and add immediate user value:

#### 1. **Voice Practice Integration** ⭐ HIGHEST PRIORITY
**Status:** SPEAK button exists but not functional
**User Value:** Major differentiator, real conversation practice

**Implementation Tasks:**
- [ ] Integrate Web Speech API for Speech-to-Text (browser native)
- [ ] Add Google Cloud Text-to-Speech for AI responses
- [ ] Create voice recording UI state (listening, processing, speaking)
- [ ] Store audio recordings in cloud storage (AWS S3 or Vercel Blob)
- [ ] Add pronunciation feedback using phonetic analysis
- [ ] Voice session summary with pronunciation scores
- [ ] Toggle between text and voice modes

**Technical Details:**
```typescript
// Web Speech API (browser native, free)
const recognition = new webkitSpeechRecognition();
recognition.lang = 'pt-BR';
recognition.continuous = true;
recognition.interimResults = true;

// Google Cloud TTS API
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
const client = new TextToSpeechClient();
```

**⚠️ Browser Compatibility Note:**
- `webkitSpeechRecognition` is a vendor-prefixed, non-standard API
- Supported: Chrome, Edge, and other Chromium-based browsers
- **NOT supported:** Firefox, Safari
- For broader browser support, consider:
  - Explicitly mentioning browser requirements to users
  - Using a cross-browser library or paid service as fallback (e.g., Google Cloud Speech-to-Text, Azure Speech Service)
  - Providing graceful degradation to text-only mode for unsupported browsers

**Files to Create/Modify:**
- `components/VoiceRecorder.tsx` (new)
- `app/api/voice/transcribe/route.ts` (new)
- `app/api/voice/synthesize/route.ts` (new)
- `components/ChatInterface.tsx` (modify to add voice mode)
- `lib/speech.ts` (new utility)

**Estimated Time:** 3-4 days

---

#### 2. **Enhanced Session Summary**
**Status:** Basic summary exists, needs improvement
**User Value:** Better learning reinforcement, clear progress tracking

**Implementation Tasks:**
- [ ] AI-generated detailed session summary
- [ ] Grammar patterns identified
- [ ] New vocabulary introduced (with definitions)
- [ ] Pronunciation issues (if voice used)
- [ ] Improvement suggestions
- [ ] Comparison to previous sessions
- [ ] "Star performer" highlights (what you did well)
- [ ] Shareable session card (social media ready)

**API Enhancement:**
```typescript
interface SessionSummary {
  duration: number;
  messageCount: number;
  correctionsCount: number;
  newVocabulary: string[];
  grammarPatternsUsed: string[];
  improvementAreas: string[];
  strengths: string[];
  nextFocusTopics: string[];
  overallScore: number; // 1-100
}
```

**Files to Modify:**
- `app/api/conversations/end/route.ts`
- `app/(app)/practice/page.tsx` (summary screen)
- `lib/gemini.ts` (add summary generation prompt)

**Estimated Time:** 1-2 days

---

#### 3. **Corrections Hub Enhancements**
**Status:** Basic list view, missing practice routing
**User Value:** Turn mistakes into learning opportunities

**Implementation Tasks:**
- [ ] **Practice Routing Options:**
  - Generate flashcard for this correction
  - Practice in next conversation (add to context)
  - Create WhatsApp scenario using this pattern
  - Mark as mastered (archive)
- [ ] Spaced repetition scheduling
  - Next review date calculation
  - Review reminder system
  - "Due today" filter
- [ ] Grammar category insights
  - Progress chart per category (verb conjugation, prepositions, etc.)
  - Weak areas highlighting
  - Mastery percentage rings
- [ ] Search and filter improvements
  - Search by mistake text
  - Filter by date range
  - Filter by confidence score
  - Filter by grammar category

**New Components:**
- `components/corrections/CorrectionCard.tsx` (enhance existing)
- `components/corrections/PracticeRouting.tsx` (new)
- `components/corrections/GrammarInsights.tsx` (new)

**New API Endpoints:**
- `app/api/corrections/route-to-practice/route.ts`
- `app/api/corrections/mark-mastered/route.ts`
- `app/api/corrections/schedule-review/route.ts`

**Database Changes:**
```sql
ALTER TABLE corrections ADD COLUMN next_review_date TIMESTAMPTZ;
ALTER TABLE corrections ADD COLUMN mastery_status VARCHAR(20) DEFAULT 'learning';
ALTER TABLE corrections ADD COLUMN times_practiced INTEGER DEFAULT 0;
ALTER TABLE corrections ADD COLUMN last_practiced_at TIMESTAMPTZ;
```

**Estimated Time:** 3-4 days

---

### **PHASE 2B: Gamification & Engagement** (Priority: MEDIUM-HIGH)
**Timeline: 1 week**

#### 4. **Flashcard System**
**Status:** Not implemented
**User Value:** Reinforcement learning, spaced repetition

**Implementation Tasks:**
- [ ] Flashcard data model
- [ ] Auto-generate flashcards from corrections
- [ ] Auto-generate flashcards from vocabulary
- [ ] Manual flashcard creation
- [ ] Card types:
  - Translation (PT → EN, EN → PT)
  - Fill-in-the-blank
  - Conjugation practice
  - Multiple choice
- [ ] Review session UI
- [ ] Spaced repetition algorithm (SM-2 or similar)
- [ ] Daily review queue
- [ ] Performance tracking (easy/medium/hard rating)
- [ ] Streak tracking for flashcard practice

**Database Schema:**
```sql
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  correction_id UUID REFERENCES corrections(id) ON DELETE SET NULL,
  vocabulary_id UUID REFERENCES vocabulary(id) ON DELETE SET NULL,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  card_type VARCHAR(50) NOT NULL, -- translation, fill_blank, conjugation, multiple_choice
  next_review_date TIMESTAMPTZ NOT NULL,
  interval_days INTEGER DEFAULT 1,
  ease_factor DECIMAL(3,2) DEFAULT 2.5,
  times_reviewed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review_date);
```

**New Pages:**
- `app/(app)/flashcards/page.tsx` (flashcard review screen)
- `app/(app)/flashcards/create/page.tsx` (manual creation)

**Components:**
- `components/flashcards/FlashcardDeck.tsx`
- `components/flashcards/FlashcardCard.tsx`
- `components/flashcards/ReviewSession.tsx`

**API Endpoints:**
- `app/api/flashcards/create/route.ts`
- `app/api/flashcards/review/route.ts`
- `app/api/flashcards/update-interval/route.ts`
- `app/api/flashcards/due-today/route.ts`

**Estimated Time:** 4-5 days

---

#### 5. **Vocabulary Library Management**
**Status:** Database exists, no UI management
**User Value:** Personal dictionary, context tracking

**Implementation Tasks:**
- [ ] Vocabulary list page with search
- [ ] Manual word addition form
- [ ] Word detail view (expand card)
- [ ] Context sentences display
- [ ] Edit/delete functionality
- [ ] Tags/categories (business, casual, family, food, travel)
- [ ] Filter by category, frequency, confidence
- [ ] "Most used" words highlight
- [ ] Export vocabulary list (CSV, PDF)
- [ ] Practice quiz mode (test yourself on vocabulary)

**New Page:**
- `app/(app)/vocabulary/page.tsx`

**Components:**
- `components/vocabulary/VocabularyList.tsx`
- `components/vocabulary/VocabularyCard.tsx`
- `components/vocabulary/AddWordModal.tsx`
- `components/vocabulary/VocabularyFilters.tsx`

**API Endpoints:**
- `app/api/vocabulary/route.ts` (GET all, POST create)
- `app/api/vocabulary/[id]/route.ts` (GET, PATCH, DELETE)
- `app/api/vocabulary/export/route.ts`

**Database Enhancements:**
```sql
ALTER TABLE vocabulary ADD COLUMN tags TEXT[];
ALTER TABLE vocabulary ADD COLUMN confidence_score INTEGER DEFAULT 1;
ALTER TABLE vocabulary ADD COLUMN notes TEXT;
```

**📝 Design Note - Tags:**
The `TEXT[]` array approach for tags is simple and works well for initial implementation. However, for better scalability and advanced features (tag analytics, autocomplete, related tags), consider a normalized approach:

```sql
-- Alternative normalized design for future consideration:
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE vocabulary_tags (
  vocabulary_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (vocabulary_id, tag_id)
);
```

This structure enables:
- Tag popularity analytics
- Tag-based recommendations
- Efficient filtering and search
- Tag autocomplete and suggestions

**Estimated Time:** 3 days

---

#### 6. **Advanced Dashboard Analytics**
**Status:** Basic stats only, no charts
**User Value:** Visual progress tracking, motivation

**Implementation Tasks:**
- [ ] Vocabulary growth chart (last 30/90 days)
- [ ] Conversation frequency chart
- [ ] Grammar mastery rings (visual progress per category)
- [ ] Weekly activity heatmap (GitHub-style)
- [ ] Corrections over time trend
- [ ] Most practiced topics
- [ ] AI-generated weekly report
- [ ] Goal setting (conversations per week, vocabulary target)
- [ ] Achievement system expansion
  - Badges for milestones
  - Level progression system
  - Leaderboard (optional, for competitive users)

**Libraries to Add:**
- `recharts` or `chart.js` for data visualization
- `react-circular-progressbar` for grammar mastery rings

**New Components:**
- `components/dashboard/VocabularyGrowthChart.tsx`
- `components/dashboard/ActivityHeatmap.tsx`
- `components/dashboard/GrammarMasteryRings.tsx`
- `components/dashboard/WeeklyReport.tsx`
- `components/dashboard/AchievementBadges.tsx`

**API Endpoints:**
- `app/api/analytics/vocabulary-growth/route.ts`
- `app/api/analytics/grammar-breakdown/route.ts`
- `app/api/analytics/weekly-summary/route.ts`

**Estimated Time:** 4-5 days

---

### **PHASE 2C: Structured Learning** (Priority: MEDIUM)
**Timeline: 1-2 weeks**

#### 7. **Lessons Library**
**Status:** Not implemented
**User Value:** Structured learning path, reference material

**Implementation Tasks:**
- [ ] Lesson content management system
- [ ] Lesson categories:
  - Grammar topics (verb tenses, subjunctive, prepositions)
  - Vocabulary themes (business, dining, travel, family)
  - Cultural insights (Brazilian business etiquette, slang)
  - Pronunciation guides
- [ ] Lesson detail view with sections:
  - Core explanation
  - Grammar deep dive (expandable)
  - Common mistakes
  - Cultural context
  - Practice exercises
  - Related vocabulary
- [ ] Interactive exercises
- [ ] Progress tracking (lessons completed)
- [ ] Bookmark/favorite lessons
- [ ] "Recommended for you" based on corrections
- [ ] Integration with practice: "Use this in next conversation"

**Database Schema:**
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(20) NOT NULL,
  category VARCHAR(100) NOT NULL,
  content JSONB NOT NULL, -- structured lesson content
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
  completed_at TIMESTAMPTZ,
  score INTEGER,
  UNIQUE(user_id, lesson_id)
);
```

**New Pages:**
- `app/(app)/lessons/page.tsx` (lessons library)
- `app/(app)/lessons/[id]/page.tsx` (lesson detail)

**Components:**
- `components/lessons/LessonCard.tsx`
- `components/lessons/LessonContent.tsx`
- `components/lessons/LessonExercise.tsx`
- `components/lessons/LessonFilters.tsx`

**API Endpoints:**
- `app/api/lessons/route.ts`
- `app/api/lessons/[id]/route.ts`
- `app/api/lessons/recommended/route.ts`
- `app/api/lessons/progress/route.ts`

**Content Creation:**
- Seed 10-15 initial lessons covering:
  - Present tense conjugation
  - Past tense (preterite vs imperfect)
  - Subjunctive mood basics
  - Por vs Para
  - Ser vs Estar
  - Brazilian slang essentials
  - Business Portuguese phrases
  - Formal vs informal language
  - Regional variations

**Estimated Time:** 5-7 days

---

#### 8. **AI-Generated Daily Goals**
**Status:** Not implemented
**User Value:** Personalized learning path, guidance

**Implementation Tasks:**
- [ ] AI analysis of user weak spots
- [ ] Daily goal generation based on:
  - Recent corrections (focus on weak grammar)
  - Vocabulary gaps
  - Conversation frequency
  - Time since last practice
- [ ] Goal types:
  - "Practice 5 new prepositions today"
  - "Complete one conversation on business meetings"
  - "Review 10 corrections from last week"
  - "Learn 3 new subjunctive verbs"
- [ ] Goal tracking (completed/incomplete)
- [ ] Streak for daily goal completion
- [ ] Weekly focus area recommendation

**New Component:**
- `components/dashboard/DailyGoals.tsx`

**API Endpoint:**
- `app/api/goals/daily/route.ts`

**Database Schema:**
```sql
CREATE TABLE daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_date DATE NOT NULL,
  goal_type VARCHAR(50) NOT NULL,
  goal_description TEXT NOT NULL,
  target_count INTEGER,
  completed_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, skipped
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- Note: No UNIQUE constraint to allow multiple distinct goals per day
);
```

**Estimated Time:** 2-3 days

---

### **PHASE 2D: Polish & User Experience** (Priority: MEDIUM)
**Timeline: 1 week**

#### 9. **User Settings & Preferences**
**Status:** Settings page exists but minimal functionality
**User Value:** Personalization, control

**Implementation Tasks:**
- [ ] Full settings page
- [ ] Editable preferences:
  - Name, email
  - Default difficulty level
  - Preferred accent
  - Native language
  - Learning goals
  - Daily reminder time
  - Email notifications
  - Dark mode toggle (future)
- [ ] Password change
- [ ] Account deletion
- [ ] Export all data (GDPR compliance)
- [ ] Privacy settings

**Page to Enhance:**
- `app/(app)/profile/page.tsx` → `app/(app)/settings/page.tsx`

**API Endpoints:**
- `app/api/user/settings/route.ts` (enhance existing)
- `app/api/user/change-password/route.ts`
- `app/api/user/delete-account/route.ts`
- `app/api/user/export-data/route.ts`

**Estimated Time:** 2-3 days

---

#### 10. **PWA Features**
**Status:** Not implemented
**User Value:** Install to home screen, offline support, native-like experience

**Implementation Tasks:**
- [ ] Web app manifest (`manifest.json`)
- [ ] Service worker for offline support
- [ ] Cache API for offline conversations
- [ ] Add to home screen prompt
- [ ] iOS-specific meta tags and icons
- [ ] Splash screen
- [ ] Push notifications (optional, future)
- [ ] Install prompt UI

**💡 Recommendation - Use Workbox:**
Instead of writing a service worker from scratch (which is complex and error-prone), **strongly consider using [Workbox](https://developers.google.com/web/tools/workbox)** by Google. It provides:
- Pre-built caching strategies (Cache First, Network First, Stale While Revalidate)
- Automatic asset versioning and updates
- Background sync for offline operations
- Best practices for lifecycle management
- Simplified routing and precaching

```bash
npm install workbox-webpack-plugin
# or for Next.js:
npm install next-pwa
```

This will significantly reduce development time and ensure a robust, production-ready PWA implementation.

**Files to Create:**
- `public/manifest.json`
- `public/sw.js` (service worker)
- `public/icons/` (various sizes for iOS/Android)

**Manifest Example:**
```json
{
  "name": "Iwry Portuguese Learning",
  "short_name": "Iwry",
  "description": "AI-powered Portuguese learning for professionals",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f1419",
  "theme_color": "#00d9ff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Estimated Time:** 2 days

---

#### 11. **Enhanced Error Handling & Loading States**
**Status:** Basic, needs improvement
**User Value:** Better UX, fewer confusion moments

**Implementation Tasks:**
- [ ] Global error boundary
- [ ] API error handling with user-friendly messages
- [ ] Retry logic for failed requests
- [ ] Optimistic UI updates
- [ ] Skeleton loaders for all pages
- [ ] Loading spinners with progress indicators
- [ ] Toast notifications for actions (success/error)
- [ ] Offline detection and messaging
- [ ] Network reconnection handling

**Libraries to Add:**
- `react-hot-toast` or `sonner` for notifications
- `react-error-boundary` for error boundaries

**Components to Create:**
- `components/ui/Toast.tsx`
- `components/ui/Skeleton.tsx`
- `components/ui/ErrorBoundary.tsx`
- `components/ui/OfflineIndicator.tsx`

**Estimated Time:** 2-3 days

---

#### 12. **Conversation Topics & Scenarios**
**Status:** Not implemented
**User Value:** Targeted practice, real-world preparation

**Implementation Tasks:**
- [ ] Pre-defined conversation scenarios:
  - Business meeting introduction
  - Job interview
  - Restaurant ordering
  - Asking for directions
  - Making small talk
  - Discussing family
  - Negotiating contracts
  - Casual Friday chat
  - Client presentation prep
- [ ] Scenario selection before starting practice
- [ ] Context-specific vocabulary hints
- [ ] Scenario completion tracking
- [ ] Difficulty-adjusted scenarios

**Database Schema:**
```sql
CREATE TABLE conversation_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(20) NOT NULL,
  category VARCHAR(100) NOT NULL, -- business, casual, travel, etc.
  system_prompt TEXT NOT NULL,
  vocabulary_hints TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_scenario_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES conversation_scenarios(id) ON DELETE CASCADE,
  times_practiced INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, scenario_id)
);
```

**UI Changes:**
- Add scenario selection in `app/(app)/practice/page.tsx`
- Display active scenario in chat header

**Estimated Time:** 2-3 days

---

### **PHASE 3: Advanced Features** (Priority: LOW-MEDIUM)
**Timeline: 2-3 weeks (future sprint)**

#### 13. **Social & Sharing Features**
- Share session achievements to social media
- Compare progress with friends (optional leaderboard)
- Share flashcard decks
- Community-contributed lessons

#### 14. **AI Conversation Personality**
- Choose AI personality (formal tutor, casual friend, business colleague)
- Regional accent variations in responses
- Cultural context adaptation based on user's home country

#### 15. **Advanced Voice Features**
- Pronunciation scoring with detailed feedback
- IPA (International Phonetic Alphabet) notation
- Slow-motion playback
- Regional accent detection
- Voice comparison (your pronunciation vs. native)

#### 16. **Integration Features**
- Calendar integration for practice reminders
- Notion/Obsidian export for notes
- Anki flashcard export
- Spotify Portuguese music recommendations
- YouTube video recommendations based on level

#### 17. **Subscription & Monetization**
- Free tier: 10 conversations/month
- Pro tier: Unlimited conversations, voice practice, lessons
- Payment integration (Stripe)
- Admin dashboard for subscription management

---

## 🎯 Recommended Next Steps (Immediate Action)

### **Week 1-2: Core Value Enhancement**
1. **Voice Practice Integration** (4 days)
   - Implement Web Speech API
   - Add Google Cloud TTS
   - Create voice UI states

2. **Enhanced Session Summary** (2 days)
   - AI-generated detailed summaries
   - Visual improvements

3. **Corrections Hub Practice Routing** (3 days)
   - Add practice routing options
   - Spaced repetition basics

### **Week 3-4: Gamification & Retention**
1. **Flashcard System** (5 days)
   - Full implementation with SM-2 algorithm

2. **Vocabulary Library UI** (3 days)
   - Management interface
   - Search and filters

3. **Advanced Dashboard** (4 days)
   - Charts and visualizations
   - Grammar mastery rings

### **Week 5-6: Structured Learning**
1. **Lessons Library** (7 days)
   - Content management
   - 10-15 initial lessons
   - Exercises

2. **Daily Goals System** (3 days)
   - AI-generated goals
   - Tracking

3. **Polish & Testing** (4 days)
   - Bug fixes
   - Performance optimization
   - User testing

---

## 📈 Success Metrics to Track

As you build features, measure:

1. **Engagement:**
   - DAU/MAU ratio (target: 35%+)
   - Average session length (target: 8-12 min)
   - Sessions per week (target: 5+)

2. **Learning Outcomes:**
   - Corrections mastered per month (target: 10+)
   - Vocabulary retention at 30 days (target: 70%+)
   - User-reported confidence improvement

3. **Feature Adoption:**
   - % users trying voice practice
   - % users using flashcards
   - % users completing lessons

4. **Retention:**
   - Day 1, Day 7, Day 30 retention
   - Churn rate
   - Weekly active users

---

## 🛠️ Technical Debt & Infrastructure

**Address alongside features:**

1. **Testing:**
   - Add unit tests (Jest)
   - E2E tests (Playwright)
   - Component tests (Testing Library)

2. **Performance:**
   - Database query optimization
   - Implement Redis caching
   - Code splitting and lazy loading
   - Image optimization

3. **Monitoring:**
   - Error tracking (Sentry)
   - Analytics (Mixpanel or Posthog)
   - Performance monitoring (Vercel Analytics)
   - User feedback system

4. **Documentation:**
   - API documentation
   - Component Storybook
   - Deployment guide
   - Contributing guide

---

## 💡 Quick Wins (Low-Hanging Fruit)

These can be done in <1 day each:

1. **Profile Picture Upload**
   - Let users upload avatar
   - Use Vercel Blob storage

2. **Theme Customization**
   - Let users choose accent color
   - Light mode option

3. **Keyboard Shortcuts**
   - Enter to send message
   - Cmd/Ctrl + / for help

4. **Export Session Transcript**
   - Download conversation as PDF
   - Share button

5. **Conversation Bookmarks**
   - Save favorite conversations
   - "Resume previous conversation"

6. **Quick Phrases**
   - Pre-written common phrases
   - One-tap responses for practice

---

## 🤔 Questions to Consider

Before starting implementation:

1. **Voice Practice Priority:**
   - Is voice practice the #1 most requested feature?
   - Do you have Google Cloud TTS credits/budget?
   - Should we use browser APIs only (free) or paid services (better quality)?

2. **Content Creation:**
   - Who will write the initial lessons? (AI-generated vs. hand-crafted)
   - What's the quality bar for lesson content?

3. **Monetization:**
   - When to introduce paid tiers?
   - What's free vs. paid?

4. **Platform Expansion:**
   - Should we build native iOS app after MVP? (React Native)
   - Android priority?

5. **Target Audience:**
   - Focus on business professionals or broader?
   - Adjust features based on persona?

---

## 📝 Notes

- **Keep It Simple:** Don't over-engineer. Ship features iteratively.
- **User Feedback:** Test each feature with 3-5 users before building the next.
- **Performance First:** Mobile users have limited bandwidth.
- **Accessibility:** WCAG 2.1 AA compliance throughout.
- **Brazilian Portuguese:** Stay authentic to Brazilian culture and language.

---

**Ready to start? Pick the top 3 features from the roadmap and let's build them! 🚀**
