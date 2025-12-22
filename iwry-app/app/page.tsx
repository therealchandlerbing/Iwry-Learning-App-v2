import Link from "next/link";
import { MessageCircle, BookOpen, Globe, BarChart3, Zap, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="border-b border-border bg-[#0f1419]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#00d9ff] to-[#a855f7] flex items-center justify-center text-white font-bold glow-cyan-sm">
                I
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-foreground">Iwry</h1>
                <span className="text-[10px] text-muted-foreground -mt-1">Fala Conmigo</span>
              </div>
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
                className="rounded-full bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] px-6 py-2.5 text-sm font-semibold text-[#0f1419] hover:shadow-lg hover:shadow-[#00d9ff]/30 transition-all duration-300"
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
          {/* Neon accent bars */}
          <div className="mx-auto mb-6 flex w-fit gap-2">
            <div className="h-1 w-12 rounded-full bg-[#00d9ff] glow-cyan-sm"></div>
            <div className="h-1 w-12 rounded-full bg-[#a855f7] glow-purple-sm"></div>
            <div className="h-1 w-12 rounded-full bg-[#10b981] glow-green-sm"></div>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Learn Brazilian Portuguese
            <br />
            <span className="text-gradient-cyan-purple">
              Through Conversation
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Practice Portuguese with AI in WhatsApp-style conversations. Track your mistakes,
            build vocabulary, and gain confidence speaking like a Brazilian. Perfect for busy
            professionals.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] px-8 py-4 text-base font-semibold text-[#0f1419] shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40 transition-all duration-300 hover:-translate-y-1"
            >
              Start Learning Free
            </Link>
            <Link
              href="/login"
              className="rounded-full border-2 border-border bg-[#1e2433] px-8 py-4 text-base font-semibold text-foreground hover:border-[#00d9ff]/50 hover:bg-[#00d9ff]/10 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="group rounded-2xl border border-border bg-[#1e2433] p-8 hover:border-[#00d9ff]/50 hover:shadow-lg hover:shadow-[#00d9ff]/10 transition-all duration-300">
            <div className="mb-4 h-12 w-12 rounded-xl bg-[#00d9ff]/10 border border-[#00d9ff]/30 flex items-center justify-center text-[#00d9ff] group-hover:glow-cyan-sm transition-all duration-300">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">WhatsApp-Style Practice</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Chat naturally in Portuguese with AI. Tap any word for instant translation. Practice
              Brazilian slang and abbreviations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-2xl border border-border bg-[#1e2433] p-8 hover:border-[#a855f7]/50 hover:shadow-lg hover:shadow-[#a855f7]/10 transition-all duration-300">
            <div className="mb-4 h-12 w-12 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7] group-hover:glow-purple-sm transition-all duration-300">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Smart Corrections</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get gentle corrections as you chat. Every mistake is tracked with explanations and
              grammar rules you can review later.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-2xl border border-border bg-[#1e2433] p-8 hover:border-[#10b981]/50 hover:shadow-lg hover:shadow-[#10b981]/10 transition-all duration-300">
            <div className="mb-4 h-12 w-12 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] group-hover:glow-green-sm transition-all duration-300">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Choose Your Accent</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Practice with São Paulo, Rio, Northeast, or European Portuguese accents. Learn the
              dialect that matches your goals.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group rounded-2xl border border-border bg-[#1e2433] p-8 hover:border-[#ec4899]/50 hover:shadow-lg hover:shadow-[#ec4899]/10 transition-all duration-300">
            <div className="mb-4 h-12 w-12 rounded-xl bg-[#ec4899]/10 border border-[#ec4899]/30 flex items-center justify-center text-[#ec4899] group-hover:glow-pink transition-all duration-300">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Track Progress</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              See your vocabulary growth, conversation count, and learning streak. Stay motivated
              with clear progress metrics.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group rounded-2xl border border-border bg-[#1e2433] p-8 hover:border-[#f97316]/50 hover:shadow-lg hover:shadow-[#f97316]/10 transition-all duration-300">
            <div className="mb-4 h-12 w-12 rounded-xl bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] group-hover:glow-orange transition-all duration-300">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Flexible Learning</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Practice for 5 minutes or 30. Choose beginner, intermediate, or advanced difficulty.
              Learn on your schedule.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group rounded-2xl border border-border bg-[#1e2433] p-8 hover:border-[#6366f1]/50 hover:shadow-lg hover:shadow-[#6366f1]/10 transition-all duration-300">
            <div className="mb-4 h-12 w-12 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] group-hover:shadow-lg group-hover:shadow-[#6366f1]/30 transition-all duration-300">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Mobile Optimized</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Works perfectly on iPhone. Add to your home screen for app-like experience. Practice
              anywhere, anytime.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 rounded-3xl bg-gradient-to-r from-[#00d9ff]/20 via-[#a855f7]/20 to-[#10b981]/20 border border-border p-12 text-center relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00d9ff]/5 to-[#a855f7]/5 blur-3xl" />

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-foreground sm:text-4xl">
              Ready to speak Portuguese?
            </h3>
            <p className="mt-4 text-lg text-muted-foreground">
              Start practicing today. No credit card required.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-full bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] px-10 py-4 text-lg font-semibold text-[#0f1419] shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40 transition-all duration-300 hover:-translate-y-1"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-[#0f1419]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Iwry. Built for Portuguese learners.</p>
            <p className="mt-2 italic text-[#00d9ff]">Vamos aprender português juntos!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
