"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  MessageCircle,
  Smartphone,
  Mic,
  Search,
  Camera,
  BookOpen,
  RotateCcw,
  AlertCircle,
  FileText,
  HelpCircle,
  BarChart3,
  ChevronRight,
  Flame,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  userName?: string | null;
  userLevel?: string;
  progress?: number;
  streak?: number;
}

export default function Sidebar({
  userName,
  userLevel = "A1+",
  progress = 0,
  streak = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("BEGINNER");

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const learningModes = [
    { href: "/practice", label: "Conversation", icon: MessageCircle },
    { href: "/practice", label: "Texting (WhatsApp)", icon: Smartphone, badge: null },
    { href: "/practice", label: "Live Voice Practice", icon: Mic, badge: "LIVE" },
  ];

  const toolsAnalysis = [
    { href: "/dictionary", label: "Linguistic Lookup", icon: Search },
    { href: "/photo-analysis", label: "Photo Analysis", icon: Camera },
    { href: "/lessons", label: "Structured Lessons", icon: BookOpen },
    { href: "/flashcards", label: "Review Center", icon: RotateCcw },
    { href: "/corrections", label: "Corrections", icon: AlertCircle },
    { href: "/learning-log", label: "Learning Log", icon: FileText },
  ];

  const support = [
    { href: "/help", label: "Quick Help", icon: HelpCircle },
    { href: "/profile", label: "My Progress", icon: BarChart3 },
  ];

  const NavSection = ({
    title,
    items,
  }: {
    title: string;
    items: Array<{ href: string; label: string; icon: any; badge?: string | null }>;
  }) => (
    <div className="mb-6">
      <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-r-lg transition-all duration-200 ${
              isActive(item.href)
                ? "bg-[#10b981]/10 text-[#10b981] border-l-2 border-[#10b981]"
                : "text-foreground hover:bg-[#1e2433] hover:text-[#10b981]"
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10b981] text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#0f1419] border-r border-border fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-lg bg-[#10b981] flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">Fala Comigo</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Portuguese Companion
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4">
        <NavSection title="Learning Modes" items={learningModes} />
        <NavSection title="Tools & Analysis" items={toolsAnalysis} />
        <NavSection title="Support" items={support} />
      </div>

      {/* Level & Progress */}
      <div className="p-4 border-t border-border bg-[#1e2433]/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Nivel Atual
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-[#10b981]">
            <TrendingUp className="h-4 w-4" />
            {userLevel}
          </span>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Progresso Geral</span>
            <span className="text-xs text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 bg-[#0f1419] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10b981] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 hover:bg-[#1e2433] rounded-lg p-2 transition-colors group"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f97316] to-[#ec4899] flex items-center justify-center text-white text-sm font-bold">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Estudante Iniciante
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    </aside>
  );
}

// Compact header for pages (shows difficulty selector and streak)
export function CompactHeader({
  pageTitle,
  streak = 0,
}: {
  pageTitle?: string;
  streak?: number;
}) {
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("BEGINNER");

  const difficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  return (
    <header className="h-14 border-b border-border bg-[#0f1419]/90 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-foreground">{pageTitle || "Fala Comigo"}</h1>

      <div className="flex items-center gap-4">
        {/* Difficulty Selector */}
        <div className="relative">
          <button
            onClick={() => setDifficultyOpen(!difficultyOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-[#1e2433] text-sm font-medium text-foreground hover:border-[#10b981]/50 transition-colors"
          >
            {selectedDifficulty}
            <ChevronDown className={`h-4 w-4 transition-transform ${difficultyOpen ? "rotate-180" : ""}`} />
          </button>
          {difficultyOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-border bg-[#1e2433] shadow-xl overflow-hidden z-50">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    setDifficultyOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? "bg-[#10b981]/10 text-[#10b981]"
                      : "text-foreground hover:bg-[#0f1419]"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f97316]/10 border border-[#f97316]/30">
          <Flame className="h-4 w-4 text-[#f97316]" />
          <span className="text-sm font-semibold text-[#f97316]">{streak} Day Streak</span>
        </div>

        {/* User Initial */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] flex items-center justify-center text-white text-xs font-bold">
          U
        </div>
      </div>
    </header>
  );
}
