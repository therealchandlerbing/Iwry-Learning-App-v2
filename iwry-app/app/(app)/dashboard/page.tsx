import { auth } from "@/lib/auth";
import { getUserProgressStats } from "@/lib/db";
import Link from "next/link";
import { MessageCircle, BookOpen, AlertCircle, Flame } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const stats = await getUserProgressStats(userId);

  const statCards = [
    {
      label: "Conversations",
      value: stats.totalConversations,
      icon: MessageCircle,
      color: "bg-green-100 text-green-700",
      href: "/practice",
    },
    {
      label: "Vocabulary",
      value: stats.totalVocabulary,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-700",
      href: "/practice",
    },
    {
      label: "Corrections",
      value: stats.totalCorrections,
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-700",
      href: "/corrections",
    },
    {
      label: "Day Streak",
      value: stats.currentStreak,
      icon: Flame,
      color: "bg-orange-100 text-orange-700",
      href: "/dashboard",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo, {session!.user.name}! 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ready to practice your Portuguese today?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
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
              <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
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
          className="group rounded-2xl border-2 border-primary bg-gradient-to-br from-[#009c3b] to-[#00852f] p-8 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">Start Practicing</h3>
              <p className="mt-2 text-white/90">
                Begin a new conversation in Portuguese
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Mode
              </div>
            </div>
            <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">
              🇧🇷
            </div>
          </div>
        </Link>

        {/* Review Corrections Card */}
        <Link
          href="/corrections"
          className="rounded-2xl border border-border bg-white p-8 shadow-sm hover:shadow-md transition-all group"
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
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                View All
                <span>→</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ✏️
            </div>
          </div>
        </Link>
      </div>

      {/* Learning Tips */}
      <div className="mt-8 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-semibold text-foreground mb-3">💡 Learning Tip</h3>
        <p className="text-sm text-muted-foreground">
          Consistency is key! Try to practice for just 5-10 minutes every day. Regular short
          sessions are more effective than occasional long ones.
        </p>
      </div>

      {/* First Time User Guide */}
      {stats.totalConversations === 0 && (
        <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
          <h3 className="text-xl font-bold text-foreground mb-4">
            🎉 Welcome to Iwry!
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
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-[#00852f] transition-colors"
          >
            Start Your First Conversation
            <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
