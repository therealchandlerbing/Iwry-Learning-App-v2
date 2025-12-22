import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#009c3b] to-[#002776] flex items-center justify-center text-white font-bold">
                I
              </div>
              <h1 className="text-2xl font-bold text-foreground">Iwry</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-[#00852f] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          {/* Flag accent */}
          <div className="mx-auto mb-6 flex w-fit gap-1">
            <div className="h-1 w-12 rounded-full bg-[#009c3b]"></div>
            <div className="h-1 w-12 rounded-full bg-[#ffdf00]"></div>
            <div className="h-1 w-12 rounded-full bg-[#002776]"></div>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Learn Brazilian Portuguese
            <br />
            <span className="bg-gradient-to-r from-[#009c3b] to-[#002776] bg-clip-text text-transparent">
              Through Conversation
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Practice Portuguese with AI in WhatsApp-style conversations. Track your mistakes,
            build vocabulary, and gain confidence speaking like a Brazilian. Perfect for busy
            professionals.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:bg-[#00852f] transition-all hover:shadow-xl"
            >
              Start Learning Free
            </Link>
            <Link
              href="/login"
              className="rounded-full border-2 border-border bg-white px-8 py-3.5 text-base font-semibold text-foreground hover:border-primary transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
              💬
            </div>
            <h3 className="text-lg font-semibold text-foreground">WhatsApp-Style Practice</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Chat naturally in Portuguese with AI. Tap any word for instant translation. Practice
              Brazilian slang and abbreviations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">
              ✅
            </div>
            <h3 className="text-lg font-semibold text-foreground">Smart Corrections</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get gentle corrections as you chat. Every mistake is tracked with explanations and
              grammar rules you can review later.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="text-lg font-semibold text-foreground">Choose Your Accent</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Practice with São Paulo, Rio, Northeast, or European Portuguese accents. Learn the
              dialect that matches your goals.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
              📊
            </div>
            <h3 className="text-lg font-semibold text-foreground">Track Progress</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              See your vocabulary growth, conversation count, and learning streak. Stay motivated
              with clear progress metrics.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="text-lg font-semibold text-foreground">Flexible Learning</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Practice for 5 minutes or 30. Choose beginner, intermediate, or advanced difficulty.
              Learn on your schedule.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              📱
            </div>
            <h3 className="text-lg font-semibold text-foreground">Mobile Optimized</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Works perfectly on iPhone. Add to your home screen for app-like experience. Practice
              anywhere, anytime.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 rounded-3xl bg-gradient-to-r from-[#009c3b] to-[#002776] p-12 text-center shadow-xl">
          <h3 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to speak Portuguese?
          </h3>
          <p className="mt-4 text-lg text-white/90">
            Start practicing today. No credit card required.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-white px-10 py-4 text-lg font-semibold text-[#009c3b] shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Iwry. Built for Portuguese learners. 🇧🇷</p>
            <p className="mt-2 italic">Vamos aprender português juntos!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
