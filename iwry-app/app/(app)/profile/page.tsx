"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { DifficultyLevel, PortugueseAccent, ProgressStats } from "@/types";
import { Settings, Info, LogOut, CheckCircle } from "lucide-react";
import ProgressRing from "@/components/ProgressRing";
import { calculateFluencyPercentage } from "@/lib/constants";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [accent, setAccent] = useState<PortugueseAccent>("sao-paulo");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState<ProgressStats | null>(null);

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/user/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const data = await response.json();
        setDifficulty(data.difficultyLevel || "beginner");
        setAccent(data.preferredAccent || "sao-paulo");
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          difficultyLevel: difficulty,
          preferredAccent: accent,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and learning preferences
        </p>
      </div>

      {/* Profile Card with Avatar */}
      <div className="mb-6 rounded-2xl border border-border bg-[#1e2433] p-6">
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] flex items-center justify-center text-white text-2xl font-bold glow-purple">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-1 -right-1 px-2 py-1 rounded-full bg-[#10b981] text-[#0f1419] text-xs font-bold glow-green-sm">
              Lvl 1
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{session?.user?.name || "User"}</h2>
            <p className="text-sm text-muted-foreground">{session?.user?.email || "Not set"}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] text-xs font-medium">
                Beginner
              </span>
            </div>
          </div>
        </div>

        {/* Progress Ring Visual */}
        <div className="flex items-center justify-center py-4">
          <ProgressRing
            percentage={stats ? calculateFluencyPercentage(stats) : 0}
            size={128}
            strokeWidth={8}
            label="Fluency Level"
          />
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="mb-6 rounded-2xl border border-border bg-[#1e2433] p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/30 flex items-center justify-center text-[#00d9ff]">
            <Settings className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Learning Preferences</h2>
        </div>

        <div className="space-y-6">
          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Default Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["beginner", "intermediate", "advanced"] as DifficultyLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-lg border-2 px-4 py-3 text-center text-sm font-medium capitalize transition-all duration-300 ${
                    difficulty === level
                      ? "border-[#00d9ff] bg-[#00d9ff]/10 text-[#00d9ff] glow-cyan-sm"
                      : "border-border bg-[#0f1419] text-foreground hover:border-[#00d9ff]/50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Accent */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Preferred Portuguese Accent
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "sao-paulo", label: "São Paulo" },
                { value: "rio", label: "Rio de Janeiro" },
                { value: "northeast", label: "Northeast" },
                { value: "portugal", label: "European" },
              ] as Array<{ value: PortugueseAccent; label: string }>).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAccent(option.value)}
                  className={`rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-all duration-300 ${
                    accent === option.value
                      ? "border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7] glow-purple-sm"
                      : "border-border bg-[#0f1419] text-foreground hover:border-[#a855f7]/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            disabled={saving}
            className={`w-full rounded-lg px-4 py-3 font-semibold transition-all duration-300 ${
              saved
                ? "bg-[#10b981] text-white glow-green"
                : "bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] text-[#0f1419] shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving ? (
              "Saving..."
            ) : saved ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" /> Saved!
              </span>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="mb-6 rounded-2xl border border-border bg-[#1e2433] p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7]">
            <Info className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">About Iwry</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Iwry helps you learn Brazilian Portuguese through natural AI conversations.
          Practice at your own pace, track your mistakes, and build vocabulary.
        </p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </div>

      {/* Sign Out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 font-semibold text-[#ef4444] hover:bg-[#ef4444]/20 hover:border-[#ef4444]/50 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}
