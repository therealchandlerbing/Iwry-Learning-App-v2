import { auth } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";

async function getUserStats(userId: string) {
  try {
    const { rows } = await sql`
      SELECT
        (SELECT COUNT(*) FROM conversations WHERE user_id = ${userId}) as conversation_count,
        (SELECT COUNT(*) FROM vocabulary WHERE user_id = ${userId}) as vocab_count,
        COALESCE((SELECT difficulty_level FROM user_settings WHERE user_id = ${userId}), 'beginner') as level
    `;
    return rows[0] || { conversation_count: 0, vocab_count: 0, level: 'beginner' };
  } catch {
    return { conversation_count: 0, vocab_count: 0, level: 'beginner' };
  }
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const stats = await getUserStats(session.user.id || "");
  const progress = Math.min(Math.round((parseInt(stats.conversation_count) * 10 + parseInt(stats.vocab_count) * 2) / 100 * 100), 100);
  const levelMap: Record<string, string> = {
    beginner: "A1+",
    intermediate: "B1",
    advanced: "B2+",
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Sidebar for desktop */}
      <Sidebar
        userName={session.user.name}
        userLevel={levelMap[stats.level] || "A1+"}
        progress={progress}
        streak={0}
      />

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Navigation userName={session.user.name} />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pb-20 lg:pb-8">
        {children}
      </main>
    </div>
  );
}
