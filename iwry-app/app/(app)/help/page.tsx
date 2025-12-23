"use client";

import { HelpCircle, MessageCircle, BookOpen, Mic, Search, FileText, Sparkles } from "lucide-react";

export default function HelpPage() {
  const helpTopics = [
    {
      icon: MessageCircle,
      title: "Conversation Practice",
      description: "Chat with Iwry in Portuguese to practice your conversation skills. She'll correct your mistakes and teach you new vocabulary.",
    },
    {
      icon: Search,
      title: "Linguistic Lookup",
      description: "Look up any English word to get its Portuguese translation, pronunciation, gender, conjugations, and example sentences.",
    },
    {
      icon: BookOpen,
      title: "Structured Lessons",
      description: "Follow the CEFR-aligned roadmap from A1 to B2, or create custom lessons on any topic with Lesson Studio.",
    },
    {
      icon: FileText,
      title: "Learning Log",
      description: "Review your past sessions, track vocabulary learned, and see your progress over time.",
    },
    {
      icon: Mic,
      title: "Voice Practice",
      description: "Practice speaking Portuguese with live voice conversations. Coming soon!",
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <HelpCircle className="h-8 w-8 text-[#10b981]" />
            <h1 className="text-3xl font-bold text-foreground">
              Quick Help
            </h1>
          </div>
          <p className="text-muted-foreground">
            Learn how to use Fala Comigo to master Portuguese.
          </p>
        </div>

        {/* Help Topics */}
        <div className="space-y-4">
          {helpTopics.map((topic, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-border bg-[#1e2433]/50 hover:border-[#10b981]/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                  <topic.icon className="h-5 w-5 text-[#10b981]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-8 p-5 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/30">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-[#fbbf24] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Pro Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Practice a little every day to build your streak</li>
                <li>• Don't be afraid to make mistakes - Iwry will help you learn from them</li>
                <li>• Use the dictionary to look up words you encounter in conversations</li>
                <li>• Review your Learning Log to reinforce vocabulary</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
