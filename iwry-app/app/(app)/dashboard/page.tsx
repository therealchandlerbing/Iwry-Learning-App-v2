import { auth } from "@/lib/auth";
import { getUserProgressStats } from "@/lib/db";
import { ACHIEVEMENT_THRESHOLDS } from "@/lib/constants";
import Link from "next/link";
import { MessageCircle, BookOpen, AlertCircle, Flame, Trophy, Target, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const stats = await getUserProgressStats(userId);

  const statCards = [
    {
      label: "Conversations",
      value: stats.totalConversations,
      icon: MessageCircle,
      color: "bg-[#00d9ff]/10 text-[#00d9ff] border-[#00d9ff]/30",
      glowClass: "group-hover:glow-cyan-sm",
      href: "/practice",
    },
    {
      label: "Vocabulary",
      value: stats.totalVocabulary,
      icon: BookOpen,
      color: "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30",
      glowClass: "group-hover:glow-purple-sm",
      href: "/practice",
    },
    {
      label: "Corrections",
      value: stats.totalCorrections,
      icon: AlertCircle,
      color: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30",
      glowClass: "group-hover:glow-orange",
      href: "/corrections",
    },
    {
      label: "Day Streak",
      value: stats.currentStreak,
      icon: Flame,
      color: "bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/30",
      glowClass: "group-hover:glow-pink",
      href: "/dashboard",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Welcome Section with Streak Badge */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo, {session!.user.name}!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ready to practice your Portuguese today?
          </p>
        </div>
        {/* Streak Badge */}
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 px-4 py-2 glow-orange">
            <Flame className="h-5 w-5 text-[#f97316]" />
            <span className="font-bold text-[#f97316]">Streak: {stats.currentStreak}</span>
            <span className="text-lg">🔥</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-border bg-[#1e2433] p-6 hover:border-border-glow transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-xl border ${stat.color} flex items-center justify-center transition-all duration-300 ${stat.glowClass}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Start Practice Card */}
        <Link
          href="/practice"
          className="group rounded-2xl border border-[#00d9ff]/30 bg-gradient-to-br from-[#00d9ff]/20 to-[#00b8d9]/10 p-8 hover:border-[#00d9ff]/50 hover:shadow-lg hover:shadow-[#00d9ff]/20 transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Start Practicing</h3>
              <p className="mt-2 text-muted-foreground">
                Begin a new conversation in Portuguese
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00d9ff]/10 border border-[#00d9ff]/30 px-4 py-2 text-sm font-medium text-[#00d9ff]">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Mode
              </div>
            </div>
            <div className="h-14 w-14 rounded-xl bg-[#00d9ff]/10 border border-[#00d9ff]/30 flex items-center justify-center text-[#00d9ff] group-hover:glow-cyan-sm transition-all duration-300">
              <Sparkles className="h-7 w-7" />
            </div>
          </div>
        </Link>

        {/* Review Corrections Card */}
        <Link
          href="/corrections"
          className="group rounded-2xl border border-border bg-[#1e2433] p-8 hover:border-[#a855f7]/30 hover:shadow-lg hover:shadow-[#a855f7]/10 transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Review Corrections
              </h3>
              <p className="mt-2 text-muted-foreground">
                {stats.totalCorrections > 0
                  ? `${stats.totalCorrections} mistake${stats.totalCorrections !== 1 ? 's' : ''} to review`
                  : "No corrections yet - start practicing!"}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#a855f7] group-hover:gap-3 transition-all">
                View All
                <span>→</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] flex items-center justify-center group-hover:glow-purple-sm transition-all duration-300">
              <Target className="h-6 w-6" />
            </div>
          </div>
        </Link>
      </div>

      {/* Learning Progress & Tips Row */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Learning Tips */}
        <div className="rounded-2xl border border-border bg-[#1e2433] p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/30 flex items-center justify-center text-[#fbbf24]">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-foreground">Learning Tip</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Consistency is key! Try to practice for just 5-10 minutes every day. Regular short
            sessions are more effective than occasional long ones.
          </p>
        </div>

        {/* Quick Achievements */}
        <div className="rounded-2xl border border-border bg-[#1e2433] p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
              <Trophy className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-foreground">Recent Badges</h3>
          </div>
          <div className="flex gap-3">
            {stats.totalConversations >= ACHIEVEMENT_THRESHOLDS.FIRST_LESSON && (
              <div className="h-12 w-12 rounded-full bg-[#00d9ff]/10 border border-[#00d9ff]/30 flex items-center justify-center glow-cyan-sm" title="First Lesson">
                <MessageCircle className="h-5 w-5 text-[#00d9ff]" />
              </div>
            )}
            {stats.totalVocabulary >= ACHIEVEMENT_THRESHOLDS.VOCABULARY_MASTER && (
              <div className="h-12 w-12 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center glow-purple-sm" title="Vocabulary Master">
                <BookOpen className="h-5 w-5 text-[#a855f7]" />
              </div>
            )}
            {stats.currentStreak >= ACHIEVEMENT_THRESHOLDS.STREAK_BADGE && (
              <div className="h-12 w-12 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center glow-orange" title="3 Day Streak">
                <Flame className="h-5 w-5 text-[#f97316]" />
              </div>
            )}
            {stats.totalConversations < ACHIEVEMENT_THRESHOLDS.FIRST_LESSON &&
             stats.totalVocabulary < ACHIEVEMENT_THRESHOLDS.VOCABULARY_MASTER &&
             stats.currentStreak < ACHIEVEMENT_THRESHOLDS.STREAK_BADGE && (
              <p className="text-sm text-muted-foreground">Start practicing to earn badges!</p>
            )}
          </div>
        </div>
      </div>

      {/* First Time User Guide */}
      {stats.totalConversations === 0 && (
        <div className="mt-8 rounded-2xl border border-[#00d9ff]/30 bg-gradient-to-br from-[#00d9ff]/10 via-[#a855f7]/10 to-[#10b981]/10 p-8">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">🎉</span> Welcome to Iwry!
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Here's how to get started:</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Click "Start Practicing" to begin your first conversation</li>
              <li>Choose your difficulty level and preferred accent</li>
              <li>Chat naturally in Portuguese - the AI will respond!</li>
              <li>Tap any word for instant translation</li>
              <li>Review your mistakes in the Corrections tab</li>
            </ol>
          </div>
          <Link
            href="/practice"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] px-6 py-3 font-semibold text-[#0f1419] shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40 transition-all duration-300"
          >
            Start Your First Conversation
            <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
