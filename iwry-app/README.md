# Iwry - Portuguese Learning App MVP 🇧🇷

An AI-powered Portuguese learning app built with Next.js, optimized for iPhone, deployable to Vercel.

## 🎯 What is This?

This is the **MVP (Minimum Viable Product)** of Iwry - a Portuguese learning app that helps you practice through natural AI conversations. Think WhatsApp, but for learning Portuguese.

## ✨ Features

### ✅ Implemented in MVP

- **WhatsApp-Style Chat Practice** - Natural conversations with AI in Portuguese
- **3 Difficulty Levels** - Beginner, Intermediate, Advanced
- **4 Portuguese Accents** - São Paulo, Rio, Northeast, European
- **Tap-to-Translate** - Click any Portuguese word for instant translation
- **Smart Corrections Tracking** - Automatic mistake detection with explanations
- **Progress Dashboard** - Track conversations, vocabulary, corrections, and streaks
- **User Authentication** - Secure email/password login
- **Mobile-Optimized** - Perfect for iPhone, PWA-ready

### 🚧 Planned for Future

- Voice practice (speech-to-text/text-to-speech)
- Spaced repetition flashcards
- Structured lessons library
- Advanced analytics and charts
- Native iOS app

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account
- Gemini API key

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local .env.local
# Edit .env.local with your keys (see below)

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create `.env.local` with:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000

# Vercel Postgres (auto-populated when deployed)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

**TL;DR:**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Connect Vercel Postgres
5. Initialize database tables
6. Done! 🎉

## 📱 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **AI** | Google Gemini 2.0 Flash |
| **Database** | Vercel Postgres (Neon) |
| **Auth** | NextAuth.js v5 |
| **Deployment** | Vercel |
| **Target** | iPhone (PWA) |

## 📂 Project Structure

```
iwry-app/
├── app/
│   ├── (auth)/           # Login, Register
│   ├── (app)/            # Dashboard, Practice, Corrections, Profile
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ChatInterface.tsx
│   ├── Navigation.tsx
│   └── Providers.tsx
├── lib/
│   ├── gemini.ts        # Gemini API client
│   ├── auth.ts          # NextAuth config
│   ├── db.ts            # Database utils
│   └── utils.ts         # Helper functions
├── types/
│   └── index.ts         # TypeScript types
└── public/
    └── manifest.json    # PWA manifest
```

## 🎨 Design Philosophy

- **Mobile-First** - Optimized for iPhone usage
- **Simple & Clean** - No clutter, focus on learning
- **Brazilian Theme** - Green, yellow, blue color palette
- **WhatsApp-Inspired** - Familiar chat interface
- **Instant Feedback** - Tap-to-translate, real-time corrections

## 🔧 Key Features Explained

### Chat System

- Uses Gemini 2.0 Flash for natural conversation
- System prompts adapt based on difficulty and accent
- Function calling for automatic mistake extraction
- Conversation history saved to database

### Corrections Tracking

- Mistakes detected automatically during conversations
- Categorized by grammar type (verbs, prepositions, etc.)
- Stored with explanations and severity scores
- Displayed in dedicated corrections view

### Accent Customization

- São Paulo: Professional, clear, slight Italian influence
- Rio: Relaxed, softer "s" sounds (Carioca)
- Northeast: Distinct intonation, regional vocabulary
- European: Formal structures, closed vowels

### Progress System

- Tracks total conversations, vocabulary, corrections
- Calculates daily streak based on practice days
- Dashboard shows quick stats and actions

## 🧪 Testing

### Manual Testing Checklist

- [ ] Landing page loads
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard shows correct stats
- [ ] Can start conversation
- [ ] Can change difficulty/accent
- [ ] AI responds to Portuguese messages
- [ ] Tap-to-translate works
- [ ] Corrections are saved
- [ ] Corrections page shows mistakes
- [ ] Profile settings can be updated
- [ ] Can sign out

### iPhone Testing

1. Deploy to Vercel
2. Open in Safari on iPhone
3. Add to Home Screen
4. Test as PWA

## 📊 Database Schema

### Tables

- `users` - User accounts
- `user_settings` - User preferences (difficulty, accent)
- `conversations` - Chat sessions
- `messages` - Individual messages
- `corrections` - Tracked mistakes
- `vocabulary` - Learned words

See `lib/db.ts` for full schema.

## 🔐 Security

- Passwords hashed with bcrypt
- JWT-based sessions via NextAuth
- Environment variables for secrets
- No client-side API keys

## 💰 Cost Estimate

**Monthly Cost (< 100 users):**
- Vercel Hosting: $0 (free tier)
- Vercel Postgres: $0 (free tier, 256MB)
- Gemini API: $0-10 (generous free tier)

**Total: ~$0-10/month**

## 🐛 Common Issues

### Database Not Initialized

**Error:** "relation 'users' does not exist"

**Solution:** Run database initialization:
```bash
curl -X POST https://your-app.vercel.app/api/setup/database
```

### Gemini API Errors

**Error:** "API key not valid"

**Solution:** Check `GOOGLE_GENERATIVE_AI_API_KEY` in environment variables

### Authentication Issues

**Error:** Can't login after registration

**Solution:** Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set correctly

## 📈 Future Improvements

**Phase 2 (Planned):**
- Voice conversations (STT/TTS)
- Spaced repetition for corrections
- Flashcard system
- Enhanced analytics

**Phase 3 (Planned):**
- Native iOS app
- Offline mode
- Social features
- Premium subscription

See [MVP_PLAN.md](../MVP_PLAN.md) for full roadmap.

## 🤝 Contributing

This is a personal project MVP, but suggestions are welcome!

## 📄 License

Proprietary - All rights reserved

## 👤 Author

Built with ❤️ for Portuguese learners

---

**Ready to deploy?** → See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Need help?** → Check the troubleshooting sections above

*Vamos aprender português juntos!* 🇧🇷
