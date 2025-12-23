"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flag,
  BookOpen,
  Building2,
  Briefcase,
  Sparkles,
  ChevronRight,
  X,
  Clock,
  Target,
  CheckCircle2
} from "lucide-react";

interface LessonLevel {
  id: string;
  level: string;
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  topics: string[];
}

const levels: LessonLevel[] = [
  {
    id: "a1",
    level: "A1",
    label: "BEGINNER",
    title: "The Foundation",
    description: "Basic survival Portuguese for daily interactions.",
    icon: <Flag className="h-6 w-6" />,
    color: "text-[#10b981]",
    bgColor: "bg-[#10b981]/10",
    borderColor: "border-[#10b981]/30",
    topics: ["Greetings & Introductions", "Numbers & Time", "Basic Questions", "Family & Friends", "Food & Restaurants"],
  },
  {
    id: "a2",
    level: "A2",
    label: "ELEMENTARY",
    title: "Daily Fluency",
    description: "Handling routine tasks and describing experiences.",
    icon: <BookOpen className="h-6 w-6" />,
    color: "text-[#10b981]",
    bgColor: "bg-[#10b981]/10",
    borderColor: "border-[#10b981]/30",
    topics: ["Shopping & Services", "Travel & Directions", "Health & Wellness", "Hobbies & Interests", "Past Experiences"],
  },
  {
    id: "b1",
    level: "B1",
    label: "INTERMEDIATE",
    title: "Working in Brazil",
    description: "Communicating professionally and handling abstract topics.",
    icon: <Building2 className="h-6 w-6" />,
    color: "text-[#10b981]",
    bgColor: "bg-[#10b981]/10",
    borderColor: "border-[#10b981]/30",
    topics: ["Business Meetings", "Email Communication", "Presentations", "Negotiations", "Brazilian Work Culture"],
  },
  {
    id: "b2",
    level: "B2",
    label: "UPPER INTERMEDIATE",
    title: "Strategic Consultant",
    description: "Mastering the \"Jeitinho\" and corporate culture.",
    icon: <Briefcase className="h-6 w-6" />,
    color: "text-[#10b981]",
    bgColor: "bg-[#10b981]/10",
    borderColor: "border-[#10b981]/30",
    topics: ["Complex Negotiations", "Cultural Nuances", "Idiomatic Expressions", "Formal Writing", "Public Speaking"],
  },
];

interface CustomLessonModule {
  title: string;
  description: string;
  difficulty: string;
  estimatedMinutes: number;
  objectives: string[];
  sections: Array<{
    heading: string;
    content: string;
    examples: Array<{
      portuguese: string;
      english: string;
    }>;
  }>;
  practiceExercises: string[];
  vocabulary: Array<{
    word: string;
    translation: string;
    context: string;
  }>;
}

export default function LessonsPage() {
  const router = useRouter();
  const [showLessonStudio, setShowLessonStudio] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<CustomLessonModule | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LessonLevel | null>(null);

  const handleLevelClick = (level: LessonLevel) => {
    setSelectedLevel(level);
  };

  const handleGenerateLesson = async () => {
    if (!customTopic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/lessons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic,
          difficulty: customDifficulty,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedLesson(data);
      }
    } catch (error) {
      console.error("Failed to generate lesson:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Flag className="h-8 w-8 text-[#10b981]" />
            <h1 className="text-3xl font-bold text-foreground">
              Roteiro de Fluência
            </h1>
          </div>
          <p className="text-muted-foreground">
            Siga o caminho estruturado dos níveis A1 ao B2.
          </p>
        </div>

        {/* Level Cards */}
        <div className="space-y-4 mb-8">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelClick(level)}
              className="w-full text-left rounded-2xl border border-border bg-[#1e2433] p-6 hover:border-[#10b981]/50 hover:bg-[#1e2433]/80 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`h-14 w-14 rounded-xl ${level.bgColor} ${level.borderColor} border flex items-center justify-center ${level.color}`}>
                  {level.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#10b981] uppercase tracking-wide">
                      {level.level} - {level.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {level.level}: {level.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {level.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-[#10b981] transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* Lesson Studio */}
        <div className="rounded-2xl bg-[#1e2433] border border-border overflow-hidden">
          <div className="bg-[#10b981] px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Lesson Studio</h2>
                  <p className="text-sm text-white/80">
                    Crie aulas personalizadas sobre qualquer tema específico com IA.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLessonStudio(!showLessonStudio)}
                className="px-6 py-2.5 rounded-lg bg-[#0f1419] text-white font-semibold hover:bg-[#1e2433] transition-all uppercase text-sm tracking-wide"
              >
                Criar Aula Customizada
              </button>
            </div>
          </div>

          {/* Lesson Studio Form */}
          {showLessonStudio && (
            <div className="p-6 border-t border-border">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    What topic would you like to learn?
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g., Ordering coffee in Brazil, Job interview phrases..."
                    className="w-full rounded-lg border border-border bg-[#0f1419] px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#10b981]/50 focus:outline-none focus:ring-2 focus:ring-[#10b981]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Difficulty Level
                  </label>
                  <div className="flex gap-3">
                    {(["beginner", "intermediate", "advanced"] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setCustomDifficulty(diff)}
                        className={`flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium capitalize transition-all ${
                          customDifficulty === diff
                            ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]"
                            : "border-border bg-[#0f1419] text-foreground hover:border-[#10b981]/50"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateLesson}
                  disabled={isGenerating || !customTopic.trim()}
                  className="w-full rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] px-4 py-3 font-semibold text-white shadow-lg shadow-[#10b981]/30 hover:shadow-xl hover:shadow-[#10b981]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating your lesson...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Custom Lesson
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Level Detail Modal */}
        {selectedLevel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-[#1e2433]">
              {/* Modal Header */}
              <div className={`${selectedLevel.bgColor} p-6 relative`}>
                <button
                  onClick={() => setSelectedLevel(null)}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center ${selectedLevel.color}`}>
                    {selectedLevel.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#10b981] uppercase tracking-wide">
                      {selectedLevel.level} - {selectedLevel.label}
                    </span>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedLevel.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedLevel.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Topics Covered</h3>
                <div className="space-y-3 mb-6">
                  {selectedLevel.topics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#0f1419] border border-border"
                    >
                      <CheckCircle2 className="h-5 w-5 text-[#10b981]" />
                      <span className="text-foreground">{topic}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedLevel(null);
                    router.push("/practice");
                  }}
                  className="w-full rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] px-4 py-3 font-semibold text-white shadow-lg shadow-[#10b981]/30 hover:shadow-xl hover:shadow-[#10b981]/40 transition-all"
                >
                  Start Learning {selectedLevel.level}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Lesson Modal */}
        {generatedLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-[#1e2433]">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#10b981] to-[#059669] p-6 relative">
                <button
                  onClick={() => setGeneratedLesson(null)}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {generatedLesson.title}
                    </h2>
                    <p className="text-white/80">
                      {generatedLesson.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-white/70 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {generatedLesson.estimatedMinutes} min
                      </span>
                      <span className="capitalize">{generatedLesson.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Objectives */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-[#10b981]" />
                    <h3 className="text-lg font-semibold text-foreground">Learning Objectives</h3>
                  </div>
                  <ul className="space-y-2">
                    {generatedLesson.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground">
                        <CheckCircle2 className="h-5 w-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sections */}
                {generatedLesson.sections.map((section, i) => (
                  <div key={i} className="rounded-xl border border-border bg-[#0f1419] p-4">
                    <h4 className="text-lg font-semibold text-foreground mb-2">{section.heading}</h4>
                    <p className="text-muted-foreground mb-4">{section.content}</p>
                    {section.examples.length > 0 && (
                      <div className="space-y-2">
                        {section.examples.map((ex, j) => (
                          <div key={j} className="border-l-2 border-[#10b981]/50 pl-3">
                            <p className="text-foreground font-medium">{ex.portuguese}</p>
                            <p className="text-sm text-muted-foreground">({ex.english})</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Vocabulary */}
                {generatedLesson.vocabulary.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Key Vocabulary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {generatedLesson.vocabulary.map((vocab, i) => (
                        <div key={i} className="rounded-lg border border-border bg-[#0f1419] p-3">
                          <p className="font-medium text-[#10b981]">{vocab.word}</p>
                          <p className="text-sm text-foreground">{vocab.translation}</p>
                          <p className="text-xs text-muted-foreground mt-1">{vocab.context}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practice Button */}
                <button
                  onClick={() => {
                    setGeneratedLesson(null);
                    router.push("/practice");
                  }}
                  className="w-full rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] px-4 py-3 font-semibold text-white shadow-lg shadow-[#10b981]/30 hover:shadow-xl hover:shadow-[#10b981]/40 transition-all"
                >
                  Practice This Topic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
