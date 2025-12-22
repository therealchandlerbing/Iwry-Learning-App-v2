"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { DifficultyLevel, PortugueseAccent } from "@/types";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [accent, setAccent] = useState<PortugueseAccent>("sao-paulo");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

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
        <h1 className="text-3xl font-bold text-foreground">Profile & Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and learning preferences
        </p>
      </div>

      {/* Account Info */}
      <div className="mb-6 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Name</label>
            <p className="text-sm text-foreground">{session?.user?.name || "Not set"}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <p className="text-sm text-foreground">{session?.user?.email || "Not set"}</p>
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="mb-6 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Learning Preferences</h2>

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
                  className={`rounded-lg border-2 px-4 py-3 text-center text-sm font-medium capitalize transition-all ${
                    difficulty === level
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-white text-foreground hover:border-primary/50"
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
                  className={`rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-all ${
                    accent === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-white text-foreground hover:border-primary/50"
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
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-[#00852f] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Preferences"}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="mb-6 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">About Iwry</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Iwry helps you learn Brazilian Portuguese through natural AI conversations.
          Practice at your own pace, track your mistakes, and build vocabulary.
        </p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </div>

      {/* Sign Out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full rounded-lg border-2 border-red-200 bg-white px-4 py-3 font-semibold text-red-600 hover:bg-red-50 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
