import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  MessageCircle,
  Library,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Layers,
  Search,
  Plus,
  Volume2,
  Timer,
  Target,
  Globe2,
  ArrowLeft,
  Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Iwry MVP Prototype (Web)
 * - Single-file React prototype that maps directly to the PRD modules:
 *   Dashboard, Voice Practice, WhatsApp Mode, Corrections Hub, Lessons, Vocabulary, Flashcards
 * - Uses local state + mocked AI service calls.
 * - Swap the mock AI + persistence layer with real APIs when you stand up the backend.
 */

// -----------------------------
// Types
// -----------------------------

type Difficulty = "beginner" | "intermediate" | "advanced";

type Screen =
  | "dashboard"
  | "voice"
  | "chat"
  | "corrections"
  | "lessons"
  | "vocab"
  | "flashcards";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
};

type CorrectionType =
  | "verb_conjugation"
  | "gender_agreement"
  | "preposition"
  | "subjunctive"
  | "pronunciation"
  | "vocabulary"
  | "other";

type Correction = {
  id: string;
  createdAt: number;
  mistakeText: string;
  correctText: string;
  grammarRule: string;
  explanation: string;
  culturalContext?: string;
  type: CorrectionType;
  difficulty: Difficulty;
  confidenceScore: 1 | 2 | 3 | 4 | 5;
  timesReviewed: number;
  timesCorrect: number;
  nextReviewDate: number;
  masteredAt?: number;
  flashcardCreated: boolean;
  usedInConversation: boolean;
  usedInScenario: boolean;
  sourceType: "voice" | "text" | "lesson";
};

type VocabCategory = "verb" | "noun" | "adjective" | "phrase" | "slang";

type VocabularyEntry = {
  id: string;
  createdAt: number;
  portugueseText: string;
  englishTranslation: string;
  exampleSentence?: string;
  personalNote?: string;
  category: VocabCategory;
  tags: string[];
  difficulty: Difficulty;
  source: "manual" | "conversation" | "lesson" | "correction";
  timesUsed: number;
  timesLookedUp: number;
  lastUsedAt?: number;
  lastReviewedAt?: number;
  confidenceScore: 1 | 2 | 3 | 4 | 5;
  masteredAt?: number;
};

type FlashcardType = "translation" | "conjugation" | "fill_blank" | "multiple_choice";

type Flashcard = {
  id: string;
  createdAt: number;
  front: string;
  back: string;
  hint?: string;
  type: FlashcardType;
  sourceType: "correction" | "vocabulary" | "lesson" | "manual";
  sourceId?: string;
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  nextReviewDate: number;
  totalReviews: number;
  correctReviews: number;
  lastReviewedAt?: number;
  lastDifficulty?: "easy" | "medium" | "hard";
};

type Lesson = {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: "grammar" | "vocabulary" | "culture";
  tags: string[];
  core: string;
  deepDive: string;
  cultural: string;
  exercises: Array<{
    id: string;
    prompt: string;
    choices: string[];
    answerIndex: number;
    explanation: string;
  }>;
};

// -----------------------------
// Helpers
// -----------------------------

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function daysFromNow(days: number) {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function confidenceToStars(n: number) {
  const full = "●".repeat(n);
  const empty = "○".repeat(5 - n);
  return full + empty;
}

function computeLevel(totalMinutes: number, correctionsMastered: number) {
  // Simple heuristic for MVP.
  const score = totalMinutes + correctionsMastered * 12;
  if (score < 120) return "A2";
  if (score < 300) return "B1";
  if (score < 600) return "B2";
  return "C1";
}

function nextSRDate(timesCorrect: number) {
  // PRD: 1d, 3d, 7d, 14d, 30d
  const schedule = [1, 3, 7, 14, 30];
  return daysFromNow(schedule[clamp(timesCorrect, 0, schedule.length - 1)]);
}

function sm2Review(card: Flashcard, rating: "easy" | "medium" | "hard") {
  // Lightweight SM-2-ish variant for MVP
  const q = rating === "easy" ? 5 : rating === "medium" ? 4 : 3;
  const ef = clamp(card.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)), 1.3, 2.5);

  let reps = card.repetitions;
  let interval = card.interval;

  if (q < 3) {
    reps = 0;
    interval = 1;
  } else {
    reps = reps + 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ef);
  }

  return {
    ...card,
    easeFactor: ef,
    repetitions: reps,
    interval,
    nextReviewDate: daysFromNow(interval),
    totalReviews: card.totalReviews + 1,
    correctReviews: card.correctReviews + (q >= 4 ? 1 : 0),
    lastReviewedAt: Date.now(),
    lastDifficulty: rating,
  } as Flashcard;
}

// -----------------------------
// Mock AI Services
// -----------------------------

type AIConversationResult = {
  assistantReplyPt: string;
  corrections?: Array<Pick<Correction, "mistakeText" | "correctText" | "grammarRule" | "explanation" | "culturalContext" | "type">>;
  vocabSuggestions?: Array<Pick<VocabularyEntry, "portugueseText" | "englishTranslation" | "category" | "tags" | "exampleSentence">>;
  culturalTip?: string;
};

async function mockAIConversation(input: {
  mode: "voice" | "text";
  difficulty: Difficulty;
  topic: string;
  messages: ChatMessage[];
}): Promise<AIConversationResult> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 550 + Math.random() * 650));

  const last = input.messages.slice(-1)[0]?.content?.trim() ?? "";

  // Extremely simplified mistake spotting for demo
  const corrections: AIConversationResult["corrections"] = [];
  if (/\beu\s+quer\b/i.test(last)) {
    corrections.push({
      mistakeText: last,
      correctText: last.replace(/\beu\s+quer\b/i, "Eu quero"),
      grammarRule: "Verb conjugation (querer) in the present tense",
      explanation: "With 'eu', the correct form is 'quero'.",
      culturalContext: "In business contexts, conjugation errors can reduce clarity and confidence.",
      type: "verb_conjugation",
    });
  }
  if (/\bquero\s+que\s+voc[eê]\s+vai\b/i.test(last)) {
    corrections.push({
      mistakeText: last,
      correctText: "Quero que você vá",
      grammarRule: "Subjunctive after verbs of desire (querer que)",
      explanation: "Desire triggers the subjunctive, so 'vá' is required.",
      culturalContext: "This pattern comes up a lot in meetings when making requests.",
      type: "subjunctive",
    });
  }

  const slangByDifficulty: Record<Difficulty, string[]> = {
    beginner: ["Tudo bem?", "Vamos marcar uma reunião?"],
    intermediate: ["Blz?", "Bora alinhar isso"],
    advanced: ["Fechou", "Partiu", "Tamo junto"],
  };

  const assistantReplyPt =
    input.mode === "text"
      ? `${slangByDifficulty[input.difficulty][Math.floor(Math.random() * slangByDifficulty[input.difficulty].length)]} ${
          input.topic.toLowerCase().includes("meeting") ? "Como foi a sua semana?" : "O que você tá pensando?"
        }`
      : `Entendi. Vamos continuar. Me conta mais sobre ${input.topic.toLowerCase().includes("meeting") ? "a reunião" : "isso"}.`;

  const vocabSuggestions =
    input.topic.toLowerCase().includes("meeting")
      ? [
          {
            portugueseText: "reunião",
            englishTranslation: "meeting",
            category: "noun" as const,
            tags: ["business"],
            exampleSentence: "Tenho uma reunião às 15h.",
          },
          {
            portugueseText: "alinhamento",
            englishTranslation: "alignment, sync",
            category: "noun" as const,
            tags: ["business"],
            exampleSentence: "Vamos fazer um alinhamento rápido.",
          },
        ]
      : [
          {
            portugueseText: "saudade",
            englishTranslation: "nostalgic longing",
            category: "noun" as const,
            tags: ["casual", "emotional"],
            exampleSentence: "Estou com saudade do Brasil.",
          },
        ];

  const culturalTip =
    input.topic.toLowerCase().includes("meeting")
      ? "Dica cultural: no Brasil, é comum começar reuniões com alguns minutos de conversa leve antes de ir direto ao ponto."
      : "Dica cultural: mensagens curtas e calorosas (com emojis) podem soar mais naturais no WhatsApp brasileiro.";

  return { assistantReplyPt, corrections, vocabSuggestions, culturalTip };
}

async function mockTranslate(phrasePt: string) {
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 450));
  const dictionary: Record<string, string> = {
    "tudo": "everything",
    "tudo bem": "all good",
    "reunião": "meeting",
    "bora": "let's go",
    "blz": "ok",
    "alinhamento": "alignment",
    "saudade": "nostalgic longing",
  };
  const key = phrasePt.trim().toLowerCase();
  return dictionary[key] ?? "(translation not found in demo)";
}

// -----------------------------
// Seed Data
// -----------------------------

const SEED_LESSONS: Lesson[] = [
  {
    id: "lesson_subjunctive_querer",
    title: "Subjuntivo: 'querer que' no contexto profissional",
    difficulty: "intermediate",
    topic: "grammar",
    tags: ["subjunctive", "business"],
    core:
      "Em português, alguns verbos expressam desejo, recomendação ou necessidade e exigem o modo subjuntivo na oração seguinte.",
    deepDive:
      "Erros comuns:\n❌ 'Eu quero que você vai à reunião'\n✅ 'Eu quero que você vá à reunião'\n\nRegra: 'querer que' + sujeito diferente, usa subjuntivo.\nVariações regionais existem na fala, mas em ambiente profissional a forma padrão costuma ser melhor recebida.",
    cultural:
      "Em ambientes de trabalho no Brasil, pedidos diretos podem soar duros. O subjuntivo ajuda a manter um tom mais polido e colaborativo.",
    exercises: [
      {
        id: "ex1",
        prompt: "Escolha a forma correta: 'Quero que você ____ (vir) amanhã.'",
        choices: ["vem", "vir", "venha", "veio"],
        answerIndex: 2,
        explanation: "'Quero que' exige subjuntivo, então 'venha'.",
      },
      {
        id: "ex2",
        prompt: "Escolha a forma correta: 'É importante que vocês ____ (estar) prontos.'",
        choices: ["estão", "estejam", "estavam", "estar"],
        answerIndex: 1,
        explanation: "Expressões de importância exigem subjuntivo: 'estejam'.",
      },
    ],
  },
  {
    id: "lesson_prepositions_em_no",
    title: "Preposições: 'em' vs 'no/na'",
    difficulty: "beginner",
    topic: "grammar",
    tags: ["prepositions"],
    core:
      "'Em' pode se contrair com artigos: em + o = no, em + a = na. Isso é muito comum em frases do dia a dia e em e-mails.",
    deepDive:
      "Exemplos:\n✅ 'Estou no escritório' (em + o)\n✅ 'Estou na reunião' (em + a)\n\nErros comuns: esquecer a contração, especialmente quando o inglês não exige artigo.",
    cultural:
      "Em português do Brasil, a contração é padrão tanto na fala quanto na escrita, especialmente em contexto profissional.",
    exercises: [
      {
        id: "ex1",
        prompt: "Complete: 'Vou ____ escritório.'",
        choices: ["em", "no", "na", "para"],
        answerIndex: 1,
        explanation: "'escritório' é masculino, então 'no'.",
      },
    ],
  },
];

// -----------------------------
// UI Building Blocks
// -----------------------------

function AppShell(props: {
  active: Screen;
  onNavigate: (s: Screen) => void;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  const nav = [
    { key: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { key: "voice" as const, label: "Voice", icon: Mic },
    { key: "chat" as const, label: "WhatsApp", icon: MessageCircle },
    { key: "corrections" as const, label: "Corrections", icon: CheckCircle2 },
    { key: "lessons" as const, label: "Lessons", icon: BookOpen },
    { key: "vocab" as const, label: "Vocabulary", icon: Library },
    { key: "flashcards" as const, label: "Flashcards", icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Iwry</h1>
                <p className="text-sm text-muted-foreground">Portuguese Learning Assistant (MVP prototype)</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">{props.rightAction}</div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Navigate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {nav.map((n) => {
                const Icon = n.icon;
                const active = props.active === n.key;
                return (
                  <button
                    key={n.key}
                    onClick={() => props.onNavigate(n.key)}
                    className={
                      "w-full rounded-xl px-3 py-2 text-left flex items-center gap-2 transition " +
                      (active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{n.label}</span>
                  </button>
                );
              })}
              <Separator className="my-3" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                This is a web prototype of the PRD flows. Replace mocked AI + local state with your real API
                layer.
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">{props.children}</div>
        </div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{children}</span>;
}

function SectionTitle({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
    </div>
  );
}

// -----------------------------
// Main App
// -----------------------------

export default function IwryMVP() {
  // App-level state (swap with real auth + persistence)
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [user, setUser] = useState({
    name: "Chandler",
    currentLevel: "B1",
    targetLevel: "B2",
    preferredDifficulty: "intermediate" as Difficulty,
    voiceRegion: "sao_paulo" as "sao_paulo" | "rio" | "northeast",
    notificationsEnabled: true,
  });

  const [dailyGoal, setDailyGoal] = useState({
    label: "Practice 5 new words",
    target: 5,
    progress: 2,
  });

  const [stats, setStats] = useState({
    totalMinutesThisMonth: 86,
    streakDays: 12,
    vocabularyCount: 247,
  });

  const [grammarRings, setGrammarRings] = useState([
    { key: "subjunctive", label: "Subjunctive", mastery: 45, stars: 2 },
    { key: "verb_conjugation", label: "Verb Conjugation", mastery: 73, stars: 4 },
    { key: "prepositions", label: "Prepositions", mastery: 62, stars: 3 },
    { key: "gender_agreement", label: "Gender Agreement", mastery: 58, stars: 3 },
    { key: "register", label: "Formal vs. Informal", mastery: 40, stars: 2 },
  ]);

  const [corrections, setCorrections] = useState<Correction[]>(() => [
    {
      id: "c1",
      createdAt: Date.now() - 2 * 86400000,
      mistakeText: "Eu quer café",
      correctText: "Eu quero café",
      grammarRule: "Verb conjugation (querer) in the present tense",
      explanation: "With 'eu', the correct form is 'quero'.",
      culturalContext: "In professional settings, conjugation errors can distract from your message.",
      type: "verb_conjugation",
      difficulty: "beginner",
      confidenceScore: 2,
      timesReviewed: 1,
      timesCorrect: 0,
      nextReviewDate: daysFromNow(1),
      flashcardCreated: true,
      usedInConversation: false,
      usedInScenario: false,
      sourceType: "voice",
    },
    {
      id: "c2",
      createdAt: Date.now() - 6 * 86400000,
      mistakeText: "Quero que você vai à reunião",
      correctText: "Quero que você vá à reunião",
      grammarRule: "Subjunctive after verbs of desire (querer que)",
      explanation: "Desire triggers the subjunctive, so 'vá' is required.",
      culturalContext: "This pattern is common when asking colleagues to do something.",
      type: "subjunctive",
      difficulty: "intermediate",
      confidenceScore: 3,
      timesReviewed: 3,
      timesCorrect: 2,
      nextReviewDate: daysFromNow(3),
      flashcardCreated: true,
      usedInConversation: true,
      usedInScenario: false,
      sourceType: "text",
    },
  ]);

  const [vocab, setVocab] = useState<VocabularyEntry[]>(() => [
    {
      id: "v1",
      createdAt: Date.now() - 18 * 86400000,
      portugueseText: "saudade",
      englishTranslation: "nostalgic longing",
      exampleSentence: "Estou com saudade do Brasil.",
      category: "noun",
      tags: ["casual", "emotional"],
      difficulty: "beginner",
      source: "conversation",
      timesUsed: 7,
      timesLookedUp: 2,
      confidenceScore: 4,
    },
    {
      id: "v2",
      createdAt: Date.now() - 7 * 86400000,
      portugueseText: "reunião",
      englishTranslation: "meeting",
      exampleSentence: "Tenho uma reunião às 15h.",
      category: "noun",
      tags: ["business"],
      difficulty: "beginner",
      source: "lesson",
      timesUsed: 12,
      timesLookedUp: 1,
      confidenceScore: 5,
      masteredAt: Date.now() - 2 * 86400000,
    },
  ]);

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => [
    {
      id: "f1",
      createdAt: Date.now() - 10 * 86400000,
      front: "Eu quer café",
      back: "Eu quero café (eu + quero)",
      hint: "Conjugate 'querer' for eu",
      type: "conjugation",
      sourceType: "correction",
      sourceId: "c1",
      easeFactor: 2.2,
      interval: 3,
      repetitions: 2,
      nextReviewDate: daysFromNow(0),
      totalReviews: 7,
      correctReviews: 5,
    },
    {
      id: "f2",
      createdAt: Date.now() - 5 * 86400000,
      front: "reunião",
      back: "meeting",
      type: "translation",
      sourceType: "vocabulary",
      sourceId: "v2",
      easeFactor: 2.3,
      interval: 6,
      repetitions: 2,
      nextReviewDate: daysFromNow(0),
      totalReviews: 4,
      correctReviews: 4,
    },
  ]);

  const [lessons] = useState<Lesson[]>(SEED_LESSONS);

  const correctionsMastered = useMemo(
    () => corrections.filter((c) => Boolean(c.masteredAt)).length,
    [corrections]
  );

  useEffect(() => {
    const lvl = computeLevel(stats.totalMinutesThisMonth, correctionsMastered);
    setUser((u) => ({ ...u, currentLevel: lvl }));
  }, [stats.totalMinutesThisMonth, correctionsMastered]);

  // Weekly focus, naive heuristic
  const weeklyFocus = useMemo(() => {
    const lowest = [...grammarRings].sort((a, b) => a.mastery - b.mastery)[0];
    return {
      area: lowest.label,
      reason: "You've been avoiding this structure in recent practice.",
      impact: "Mastering this will make your meetings sound more natural and precise.",
      plan: ["1 short lesson", "1 voice session", "1 WhatsApp scenario"],
      targetScreen: lowest.key === "subjunctive" ? "lessons" : "voice",
    };
  }, [grammarRings]);

  // Global actions
  function addCorrectionFromAI(
    input: AIConversationResult,
    sourceType: "voice" | "text" | "lesson",
    difficulty: Difficulty
  ) {
    if (!input.corrections?.length) return;
    setCorrections((prev) => {
      const next = [...prev];
      for (const c of input.corrections ?? []) {
        // Dedup by corrected text + type
        const exists = next.some(
          (x) => x.type === c.type && x.correctText.toLowerCase() === c.correctText.toLowerCase()
        );
        if (exists) continue;
        next.unshift({
          id: uid("c"),
          createdAt: Date.now(),
          mistakeText: c.mistakeText,
          correctText: c.correctText,
          grammarRule: c.grammarRule,
          explanation: c.explanation,
          culturalContext: c.culturalContext,
          type: c.type,
          difficulty,
          confidenceScore: 2,
          timesReviewed: 0,
          timesCorrect: 0,
          nextReviewDate: nextSRDate(0),
          flashcardCreated: false,
          usedInConversation: sourceType === "voice",
          usedInScenario: sourceType === "text",
          sourceType,
        });
      }
      return next;
    });
  }

  function addVocabFromAI(input: AIConversationResult, difficulty: Difficulty, source: VocabularyEntry["source"]) {
    if (!input.vocabSuggestions?.length) return;
    setVocab((prev) => {
      const next = [...prev];
      for (const v of input.vocabSuggestions ?? []) {
        const exists = next.some((x) => x.portugueseText.toLowerCase() === v.portugueseText.toLowerCase());
        if (exists) continue;
        next.unshift({
          id: uid("v"),
          createdAt: Date.now(),
          portugueseText: v.portugueseText,
          englishTranslation: v.englishTranslation,
          exampleSentence: v.exampleSentence,
          category: v.category,
          tags: v.tags,
          difficulty,
          source,
          timesUsed: 0,
          timesLookedUp: 0,
          confidenceScore: 2,
        });
      }
      return next;
    });
  }

  function createFlashcardFromCorrection(c: Correction) {
    setFlashcards((prev) => {
      const exists = prev.some((f) => f.sourceType === "correction" && f.sourceId === c.id);
      if (exists) return prev;
      return [
        {
          id: uid("f"),
          createdAt: Date.now(),
          front: c.mistakeText,
          back: c.correctText,
          hint: c.grammarRule,
          type: c.type === "pronunciation" ? "fill_blank" : "conjugation",
          sourceType: "correction",
          sourceId: c.id,
          easeFactor: 2.2,
          interval: 0,
          repetitions: 0,
          nextReviewDate: daysFromNow(0),
          totalReviews: 0,
          correctReviews: 0,
        },
        ...prev,
      ];
    });

    setCorrections((prev) => prev.map((x) => (x.id === c.id ? { ...x, flashcardCreated: true } : x)));
  }

  function markCorrectionMastered(id: string) {
    setCorrections((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              masteredAt: Date.now(),
              confidenceScore: 5,
            }
          : c
      )
    );
  }

  function incrementGoalProgress(inc = 1) {
    setDailyGoal((g) => ({ ...g, progress: clamp(g.progress + inc, 0, g.target) }));
  }

  const rightAction = (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-xl">
          <Wand2 className="h-4 w-4 mr-2" />
          Quick Setup
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Preferred difficulty</div>
              <Select
                value={user.preferredDifficulty}
                onValueChange={(v) => setUser((u) => ({ ...u, preferredDifficulty: v as Difficulty }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Voice region</div>
              <Select
                value={user.voiceRegion}
                onValueChange={(v) => setUser((u) => ({ ...u, voiceRegion: v as any }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sao_paulo">São Paulo</SelectItem>
                  <SelectItem value="rio">Rio</SelectItem>
                  <SelectItem value="northeast">Northeast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>
              <div className="text-sm font-medium">Notifications</div>
              <div className="text-xs text-muted-foreground">Spaced repetition reminders</div>
            </div>
            <Switch
              checked={user.notificationsEnabled}
              onCheckedChange={(v) => setUser((u) => ({ ...u, notificationsEnabled: v }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              className="rounded-xl"
              onClick={() => {
                setDailyGoal({ label: "Review 10 corrections", target: 10, progress: 0 });
                setScreen("corrections");
              }}
            >
              Set goal: Review corrections
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setDailyGoal({ label: "Complete one voice session", target: 1, progress: 0 });
                setScreen("voice");
              }}
            >
              Set goal: Voice session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <AppShell active={screen} onNavigate={setScreen} rightAction={rightAction}>
      <AnimatePresence mode="popLayout">
        {screen === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <Dashboard
              user={user}
              stats={stats}
              dailyGoal={dailyGoal}
              grammarRings={grammarRings}
              weeklyFocus={weeklyFocus}
              onStartVoice={() => setScreen("voice")}
              onStartChat={() => setScreen("chat")}
              onStartLessons={() => setScreen("lessons")}
              onWeeklyFocus={() => setScreen(weeklyFocus.targetScreen as Screen)}
            />
          </motion.div>
        )}

        {screen === "voice" && (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <VoicePractice
              preferredDifficulty={user.preferredDifficulty}
              onBack={() => setScreen("dashboard")}
              onSessionComplete={(payload) => {
                setStats((s) => ({ ...s, totalMinutesThisMonth: s.totalMinutesThisMonth + payload.minutes }));
                addCorrectionFromAI(payload.ai, "voice", payload.difficulty);
                addVocabFromAI(payload.ai, payload.difficulty, "conversation");
                if (payload.ai.corrections?.length) incrementGoalProgress(1);
              }}
            />
          </motion.div>
        )}

        {screen === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <WhatsAppMode
              preferredDifficulty={user.preferredDifficulty}
              onBack={() => setScreen("dashboard")}
              onConversationComplete={(payload) => {
                setStats((s) => ({ ...s, totalMinutesThisMonth: s.totalMinutesThisMonth + payload.minutes }));
                addCorrectionFromAI(payload.ai, "text", payload.difficulty);
                addVocabFromAI(payload.ai, payload.difficulty, "conversation");
                if (payload.lookupsCount > 0) incrementGoalProgress(1);
              }}
            />
          </motion.div>
        )}

        {screen === "corrections" && (
          <motion.div
            key="corrections"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CorrectionsHub
              corrections={corrections}
              onBack={() => setScreen("dashboard")}
              onCreateFlashcard={(c) => createFlashcardFromCorrection(c)}
              onMarkMastered={(id) => {
                markCorrectionMastered(id);
                incrementGoalProgress(1);
              }}
              onPractice={(id) => {
                // In real app: route into scenario generation.
                setCorrections((prev) => prev.map((c) => (c.id === id ? { ...c, timesReviewed: c.timesReviewed + 1 } : c)));
                incrementGoalProgress(1);
              }}
            />
          </motion.div>
        )}

        {screen === "lessons" && (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <LessonsView
              lessons={lessons}
              onBack={() => setScreen("dashboard")}
              onCompleteLesson={(lesson, accuracyRate) => {
                setStats((s) => ({ ...s, totalMinutesThisMonth: s.totalMinutesThisMonth + 6 }));
                if (accuracyRate >= 80) incrementGoalProgress(1);
                // Simple: improve relevant grammar ring
                setGrammarRings((rings) =>
                  rings.map((r) =>
                    lesson.tags.includes(r.key)
                      ? { ...r, mastery: clamp(r.mastery + 6, 0, 100), stars: clamp(r.stars + 1, 1, 5) }
                      : r
                  )
                );
              }}
              onSaveTopic={(lesson) => {
                // In real app: add to practice queue. Here, nudge the weekly focus.
                setDailyGoal((g) => ({ ...g, label: `Practice: ${lesson.title}`, target: 1, progress: 0 }));
              }}
            />
          </motion.div>
        )}

        {screen === "vocab" && (
          <motion.div
            key="vocab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <VocabularyLibrary
              entries={vocab}
              onBack={() => setScreen("dashboard")}
              onAdd={(entry) => {
                setVocab((prev) => [entry, ...prev]);
                setStats((s) => ({ ...s, vocabularyCount: s.vocabularyCount + 1 }));
                incrementGoalProgress(1);
              }}
              onCreateFlashcard={(entry) => {
                setFlashcards((prev) => [
                  {
                    id: uid("f"),
                    createdAt: Date.now(),
                    front: entry.portugueseText,
                    back: entry.englishTranslation,
                    type: "translation",
                    sourceType: "vocabulary",
                    sourceId: entry.id,
                    easeFactor: 2.2,
                    interval: 0,
                    repetitions: 0,
                    nextReviewDate: daysFromNow(0),
                    totalReviews: 0,
                    correctReviews: 0,
                  },
                  ...prev,
                ]);
              }}
              onMarkMastered={(id) => {
                setVocab((prev) => prev.map((v) => (v.id === id ? { ...v, masteredAt: Date.now(), confidenceScore: 5 } : v)));
                incrementGoalProgress(1);
              }}
            />
          </motion.div>
        )}

        {screen === "flashcards" && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Flashcards
              cards={flashcards}
              onBack={() => setScreen("dashboard")}
              onReviewed={(updated) => {
                setFlashcards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
                incrementGoalProgress(1);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

// -----------------------------
// Screens
// -----------------------------

function Dashboard(props: {
  user: any;
  stats: any;
  dailyGoal: any;
  grammarRings: any[];
  weeklyFocus: any;
  onStartVoice: () => void;
  onStartChat: () => void;
  onStartLessons: () => void;
  onWeeklyFocus: () => void;
}) {
  const pct = Math.round((props.dailyGoal.progress / props.dailyGoal.target) * 100);

  return (
    <div className="space-y-4">
      <SectionTitle title="Dashboard" icon={<LayoutDashboard className="h-5 w-5" />} />

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" /> Today’s goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium">{props.dailyGoal.label}</div>
              <div className="text-sm text-muted-foreground">
                {props.dailyGoal.progress}/{props.dailyGoal.target}
              </div>
            </div>
            <Badge variant={pct >= 100 ? "default" : "secondary"} className="rounded-full">
              {pct >= 100 ? "Done" : `${pct}%`}
            </Badge>
          </div>
          <Progress value={pct} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Progress overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Current level</div>
              <div className="font-semibold">{props.user.currentLevel}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Streak</div>
              <div className="font-semibold">{props.stats.streakDays} days</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Minutes this month</div>
              <div className="font-semibold">{props.stats.totalMinutesThisMonth}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Words tracked</div>
              <div className="font-semibold">{props.stats.vocabularyCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Grammar mastery</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {props.grammarRings.slice(0, 4).map((g) => (
              <div key={g.key} className="rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{g.label}</div>
                  <Pill>{confidenceToStars(g.stars)}</Pill>
                </div>
                <div className="mt-2">
                  <Progress value={g.mastery} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{g.mastery}% mastered</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe2 className="h-4 w-4" /> Weekly focus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">{props.weeklyFocus.area}</div>
              <div className="text-sm text-muted-foreground">{props.weeklyFocus.reason}</div>
              <div className="text-sm mt-1">{props.weeklyFocus.impact}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {props.weeklyFocus.plan.map((p: string) => (
                  <Badge key={p} variant="secondary" className="rounded-full">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
            <Button className="rounded-xl" onClick={props.onWeeklyFocus}>
              One-tap start
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button className="rounded-2xl h-12" onClick={props.onStartVoice}>
          <Mic className="h-4 w-4 mr-2" /> Voice practice
        </Button>
        <Button className="rounded-2xl h-12" variant="secondary" onClick={props.onStartChat}>
          <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp mode
        </Button>
        <Button className="rounded-2xl h-12" variant="outline" onClick={props.onStartLessons}>
          <BookOpen className="h-4 w-4 mr-2" /> Lessons
        </Button>
      </div>
    </div>
  );
}

function VoicePractice(props: {
  preferredDifficulty: Difficulty;
  onBack: () => void;
  onSessionComplete: (payload: { minutes: number; ai: AIConversationResult; difficulty: Difficulty }) => void;
}) {
  const [difficulty, setDifficulty] = useState<Difficulty>(props.preferredDifficulty);
  const [topic, setTopic] = useState("Business meetings");
  const [length, setLength] = useState<5 | 10 | 15>(10);

  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid("m"),
      role: "assistant",
      content: "Bom dia! Vamos praticar. Me diga como foi sua semana.",
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [lastAI, setLastAI] = useState<AIConversationResult | null>(null);

  function start() {
    setStartedAt(Date.now());
    setStatus("listening");
  }

  async function send() {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: uid("m"), role: "user", content: input.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setStatus("processing");
    const ai = await mockAIConversation({ mode: "voice", difficulty, topic, messages: [...messages, userMsg] });
    setLastAI(ai);

    const assistantMsg: ChatMessage = {
      id: uid("m"),
      role: "assistant",
      content: ai.assistantReplyPt,
      timestamp: Date.now(),
    };

    setStatus("speaking");
    setTimeout(() => setStatus("listening"), 650);
    setMessages((prev) => [...prev, assistantMsg]);
  }

  function end() {
    const mins = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : 1;
    props.onSessionComplete({ minutes: Math.min(mins, length), ai: lastAI ?? { assistantReplyPt: "" }, difficulty });
    setStartedAt(null);
    setStatus("idle");
  }

  const statusChip =
    status === "listening"
      ? { label: "Listening", icon: <Mic className="h-4 w-4" /> }
      : status === "processing"
      ? { label: "Processing", icon: <Sparkles className="h-4 w-4" /> }
      : status === "speaking"
      ? { label: "Speaking", icon: <Volume2 className="h-4 w-4" /> }
      : { label: "Ready", icon: <Timer className="h-4 w-4" /> };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-xl" onClick={props.onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <SectionTitle title="Voice practice" icon={<Mic className="h-5 w-5" />} />
        </div>
        <Badge variant="secondary" className="rounded-full flex items-center gap-2">
          {statusChip.icon}
          {statusChip.label}
        </Badge>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Difficulty</div>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Topic</div>
              <Input className="rounded-xl" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Length</div>
              <Select value={String(length)} onValueChange={(v) => setLength(Number(v) as any)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="rounded-xl" onClick={start} disabled={Boolean(startedAt)}>
              Start session
            </Button>
            <Button variant="secondary" className="rounded-xl" onClick={end} disabled={!startedAt}>
              End session
            </Button>
          </div>

          <div className="rounded-2xl border overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 text-sm text-muted-foreground">Conversation</div>
            <ScrollArea className="h-[360px]">
              <div className="p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed " +
                        (m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")
                      }
                    >
                      {m.content}
                      <div className={"mt-1 text-[11px] opacity-70 " + (m.role === "user" ? "text-primary-foreground" : "text-foreground")}>
                        {formatTime(m.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

                {!!lastAI?.corrections?.length && (
                  <div className="rounded-2xl border p-3 bg-background">
                    <div className="text-sm font-medium">Real-time correction</div>
                    {lastAI.corrections.map((c, idx) => (
                      <div key={idx} className="mt-2 text-sm">
                        <div className="text-red-600">Almost! Better:</div>
                        <div className="mt-1">
                          <div className="text-muted-foreground">Mistake</div>
                          <div className="font-medium">{c.mistakeText}</div>
                        </div>
                        <div className="mt-1">
                          <div className="text-muted-foreground">Correct</div>
                          <div className="font-medium text-green-700">{c.correctText}</div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{c.explanation}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-3 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  className="rounded-xl"
                  placeholder="Type what you said (demo). In production, this comes from speech-to-text."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  disabled={!startedAt}
                />
                <Button className="rounded-xl" onClick={send} disabled={!startedAt}>
                  Send
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Prototype note: this simulates voice using text input. Hook this to Whisper in the backend.
              </div>
            </div>
          </div>

          {!!lastAI?.culturalTip && (
            <div className="rounded-2xl border p-3 flex gap-2">
              <Globe2 className="h-4 w-4 mt-0.5" />
              <div className="text-sm">{lastAI.culturalTip}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WhatsAppMode(props: {
  preferredDifficulty: Difficulty;
  onBack: () => void;
  onConversationComplete: (payload: {
    minutes: number;
    ai: AIConversationResult;
    difficulty: Difficulty;
    lookupsCount: number;
  }) => void;
}) {
  const [difficulty, setDifficulty] = useState<Difficulty>(props.preferredDifficulty);
  const [topic, setTopic] = useState("Weekend plans");
  const [thread, setThread] = useState<ChatMessage[]>(() => [
    {
      id: uid("m"),
      role: "assistant",
      content: "E aí, tudo bom? Bora fazer algo sábado?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [overlay, setOverlay] = useState<{ open: boolean; phrase: string; translation: string }>(
    { open: false, phrase: "", translation: "" }
  );
  const [lastAI, setLastAI] = useState<AIConversationResult | null>(null);
  const [lookups, setLookups] = useState(0);

  const wordsInLastAI = useMemo(() => {
    const a = thread.filter((m) => m.role === "assistant").slice(-1)[0]?.content ?? "";
    return a
      .split(/\s+/)
      .map((w) => w.replace(/[.,!?;:()\[\]{}"']/g, ""))
      .filter(Boolean)
      .slice(0, 18);
  }, [thread]);

  async function send() {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: uid("m"), role: "user", content: input.trim(), timestamp: Date.now() };
    setThread((prev) => [...prev, userMsg]);
    setInput("");

    setIsTyping(true);
    const ai = await mockAIConversation({ mode: "text", difficulty, topic, messages: [...thread, userMsg] });
    setLastAI(ai);
    const assistantMsg: ChatMessage = {
      id: uid("m"),
      role: "assistant",
      content: ai.assistantReplyPt,
      timestamp: Date.now(),
    };

    setTimeout(() => {
      setIsTyping(false);
      setThread((prev) => [...prev, assistantMsg]);
    }, 700 + Math.random() * 800);
  }

  async function tapWord(word: string) {
    const translation = await mockTranslate(word);
    setLookups((n) => n + 1);
    setOverlay({ open: true, phrase: word, translation });
  }

  function endConversation() {
    props.onConversationComplete({
      minutes: 5,
      ai: lastAI ?? { assistantReplyPt: "" },
      difficulty,
      lookupsCount: lookups,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-xl" onClick={props.onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <SectionTitle title="WhatsApp mode" icon={<MessageCircle className="h-5 w-5" />} />
        </div>
        <Button variant="secondary" className="rounded-xl" onClick={endConversation}>
          End chat
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Difficulty</div>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Topic</div>
              <Input className="rounded-xl" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 text-sm text-muted-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10" />
                <div>
                  <div className="text-foreground font-medium">Lucas</div>
                  <div className="text-xs">Online</div>
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full">Lookups: {lookups}</Badge>
            </div>

            <ScrollArea className="h-[360px]">
              <div className="p-4 space-y-3">
                {thread.map((m) => (
                  <div key={m.id} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed " +
                        (m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")
                      }
                    >
                      {m.content}
                      <div className={"mt-1 text-[11px] opacity-70 " + (m.role === "user" ? "text-primary-foreground" : "text-foreground")}>
                        {formatTime(m.timestamp)} {m.role === "assistant" ? "\u2713\u2713" : "\u2713"}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-3 py-2 text-sm bg-muted">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse" />
                        <span className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse" />
                        <span className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse" />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t bg-background space-y-2">
              <div className="flex gap-2">
                <Input
                  className="rounded-xl"
                  placeholder="Type a message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                />
                <Button className="rounded-xl" onClick={send}>
                  Send
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Tap a word below to translate (demo of inline translation).
              </div>
              <div className="flex flex-wrap gap-2">
                {wordsInLastAI.map((w) => (
                  <Button key={w + Math.random()} variant="outline" className="rounded-full h-7" onClick={() => tapWord(w)}>
                    {w}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {overlay.open && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="rounded-2xl border p-3 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-medium">{overlay.phrase}</div>
                  <div className="text-sm text-muted-foreground">{overlay.translation}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="rounded-xl"
                    onClick={() => {
                      // This would add to vocab library via parent in real app
                      setOverlay((o) => ({ ...o, open: false }));
                    }}
                  >
                    Add to library
                  </Button>
                  <Button variant="ghost" className="rounded-xl" onClick={() => setOverlay((o) => ({ ...o, open: false }))}>
                    Close
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!!lastAI?.culturalTip && (
            <div className="rounded-2xl border p-3 flex gap-2">
              <Globe2 className="h-4 w-4 mt-0.5" />
              <div className="text-sm">{lastAI.culturalTip}</div>
            </div>
          )}

          {!!lastAI?.corrections?.length && (
            <div className="rounded-2xl border p-3">
              <div className="text-sm font-medium">Post-conversation breakdown</div>
              <div className="mt-2 text-sm text-muted-foreground">Grammar spotted</div>
              {lastAI.corrections.map((c, idx) => (
                <div key={idx} className="mt-2 rounded-xl border p-3">
                  <div className="text-sm">
                    <span className="text-red-600">Mistake:</span> {c.mistakeText}
                  </div>
                  <div className="text-sm">
                    <span className="text-green-700">Correct:</span> {c.correctText}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.explanation}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CorrectionsHub(props: {
  corrections: Correction[];
  onBack: () => void;
  onCreateFlashcard: (c: Correction) => void;
  onPractice: (id: string) => void;
  onMarkMastered: (id: string) => void;
}) {
  const [tab, setTab] = useState<"all" | "active" | "mastered">("active");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const base =
      tab === "all"
        ? props.corrections
        : tab === "active"
        ? props.corrections.filter((c) => !c.masteredAt)
        : props.corrections.filter((c) => Boolean(c.masteredAt));

    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (c) =>
        c.mistakeText.toLowerCase().includes(q) ||
        c.correctText.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
    );
  }, [props.corrections, tab, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-xl" onClick={props.onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <SectionTitle title="Corrections hub" icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="rounded-xl pl-9 w-[220px]"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="rounded-2xl">
          <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
          <TabsTrigger value="active" className="rounded-xl">Active</TabsTrigger>
          <TabsTrigger value="mastered" className="rounded-xl">Mastered</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((c) => (
              <Card key={c.id} className="rounded-2xl shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">{c.type.replace(/_/g, " ")}</div>
                      <div className="mt-1 text-sm">
                        <div className="text-red-600">❌ {c.mistakeText}</div>
                        <div className="text-green-700">✅ {c.correctText}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Confidence</div>
                      <div className="text-sm font-medium">{confidenceToStars(c.confidenceScore)}</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">Rule</div>
                    <div className="font-medium">{c.grammarRule}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.explanation}</div>
                  </div>

                  {c.culturalContext && (
                    <div className="rounded-xl border p-3 text-sm">
                      <div className="text-xs text-muted-foreground">Cultural context</div>
                      {c.culturalContext}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">
                      Next review: {new Date(c.nextReviewDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={c.flashcardCreated ? "secondary" : "outline"}
                        className="rounded-xl"
                        onClick={() => props.onCreateFlashcard(c)}
                        disabled={c.flashcardCreated}
                      >
                        Flashcard
                      </Button>
                      <Button className="rounded-xl" onClick={() => props.onPractice(c.id)}>
                        Practice
                      </Button>
                      <Button variant="secondary" className="rounded-xl" onClick={() => props.onMarkMastered(c.id)}>
                        ✓
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No corrections match your filters.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LessonsView(props: {
  lessons: Lesson[];
  onBack: () => void;
  onCompleteLesson: (lesson: Lesson, accuracyRate: number) => void;
  onSaveTopic: (lesson: Lesson) => void;
}) {
  const [selected, setSelected] = useState<Lesson | null>(props.lessons[0] ?? null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const accuracy = useMemo(() => {
    if (!selected) return 0;
    const total = selected.exercises.length;
    if (total === 0) return 0;
    let correct = 0;
    for (const ex of selected.exercises) {
      const a = answers[ex.id];
      if (a === ex.answerIndex) correct += 1;
    }
    return Math.round((correct / total) * 100);
  }, [selected, answers]);

  function resetForLesson(l: Lesson) {
    setSelected(l);
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-xl" onClick={props.onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <SectionTitle title="Lessons" icon={<BookOpen className="h-5 w-5" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {props.lessons.map((l) => (
              <button
                key={l.id}
                className={
                  "w-full text-left rounded-xl p-3 border transition " +
                  (selected?.id === l.id ? "bg-muted" : "hover:bg-muted/50")
                }
                onClick={() => resetForLesson(l)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-sm">{l.title}</div>
                  <Badge variant="secondary" className="rounded-full">
                    {l.difficulty}
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {l.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline" className="rounded-full">
                      {t}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Lesson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selected ? (
              <div className="text-sm text-muted-foreground">Select a lesson.</div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-lg font-semibold">{selected.title}</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full">{selected.difficulty}</Badge>
                      <Badge variant="outline" className="rounded-full">{selected.topic}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-xl" onClick={() => props.onSaveTopic(selected)}>
                    Save topic
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Core explanation</div>
                    <div className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{selected.core}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Grammar deep dive</div>
                    <div className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{selected.deepDive}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Cultural context</div>
                    <div className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{selected.cultural}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium">Practice exercises</div>
                  <div className="mt-2 space-y-3">
                    {selected.exercises.map((ex) => {
                      const chosen = answers[ex.id];
                      const isCorrect = submitted && chosen === ex.answerIndex;
                      const isWrong = submitted && chosen !== undefined && chosen !== ex.answerIndex;
                      return (
                        <div key={ex.id} className="rounded-2xl border p-3">
                          <div className="text-sm font-medium">{ex.prompt}</div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {ex.choices.map((c, idx) => (
                              <button
                                key={c}
                                className={
                                  "rounded-xl border px-3 py-2 text-sm text-left transition " +
                                  (chosen === idx ? "bg-muted" : "hover:bg-muted/50")
                                }
                                onClick={() => setAnswers((a) => ({ ...a, [ex.id]: idx }))}
                              >
                                {c}
                              </button>
                            ))}
                          </div>

                          {submitted && (
                            <div className="mt-2 text-sm">
                              {isCorrect && <div className="text-green-700">Correct</div>}
                              {isWrong && <div className="text-red-600">Not quite</div>}
                              <div className="text-xs text-muted-foreground mt-1">{ex.explanation}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">Accuracy: {accuracy}%</div>
                    <div className="flex items-center gap-2">
                      <Button
                        className="rounded-xl"
                        onClick={() => {
                          setSubmitted(true);
                          props.onCompleteLesson(selected, accuracy);
                        }}
                      >
                        Submit
                      </Button>
                      <Button variant="secondary" className="rounded-xl" onClick={() => resetForLesson(selected)}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VocabularyLibrary(props: {
  entries: VocabularyEntry[];
  onBack: () => void;
  onAdd: (entry: VocabularyEntry) => void;
  onCreateFlashcard: (entry: VocabularyEntry) => void;
  onMarkMastered: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | VocabCategory>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return props.entries.filter((e) => {
      const matchesQ =
        !q ||
        e.portugueseText.toLowerCase().includes(q) ||
        e.englishTranslation.toLowerCase().includes(q) ||
        e.tags.join(" ").toLowerCase().includes(q);
      const matchesFilter = filter === "all" ? true : e.category === filter;
      return matchesQ && matchesFilter;
    });
  }, [props.entries, query, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-xl" onClick={props.onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <SectionTitle title="Vocabulary" icon={<Library className="h-5 w-5" />} />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="rounded-xl pl-9 w-[220px]"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Add vocabulary</DialogTitle>
              </DialogHeader>
              <VocabForm
                onSubmit={(entry) => {
                  props.onAdd(entry);
                  setDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "verb", "noun", "adjective", "phrase", "slang"] as const).map((k) => (
          <Button
            key={k}
            variant={filter === k ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setFilter(k as any)}
          >
            {k}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((e) => (
          <Card key={e.id} className="rounded-2xl shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{e.portugueseText}</div>
                  <div className="text-sm text-muted-foreground">{e.englishTranslation}</div>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {confidenceToStars(e.confidenceScore)}
                </Badge>
              </div>

              {e.exampleSentence && (
                <div className="rounded-xl border p-3 text-sm text-muted-foreground">{e.exampleSentence}</div>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full">{e.category}</Badge>
                <Badge variant="outline" className="rounded-full">{e.difficulty}</Badge>
                {e.tags.slice(0, 3).map((t) => (
                  <Badge key={t} variant="secondary" className="rounded-full">
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">Used {e.timesUsed}x</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="rounded-xl" onClick={() => props.onCreateFlashcard(e)}>
                    Create flashcard
                  </Button>
                  <Button variant="secondary" className="rounded-xl" onClick={() => props.onMarkMastered(e.id)}>
                    Mark mastered
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No vocabulary matches your filters.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function VocabForm(props: { onSubmit: (entry: VocabularyEntry) => void }) {
  const [pt, setPt] = useState("");
  const [en, setEn] = useState("");
  const [example, setExample] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<VocabCategory>("phrase");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [tags, setTags] = useState("business, casual");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">Portuguese</div>
          <Input className="rounded-xl" value={pt} onChange={(e) => setPt(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">English</div>
          <Input className="rounded-xl" value={en} onChange={(e) => setEn(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Example sentence (optional)</div>
        <Input className="rounded-xl" value={example} onChange={(e) => setExample(e.target.value)} />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Personal note (optional)</div>
        <Textarea className="rounded-xl" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">Category</div>
          <Select value={category} onValueChange={(v) => setCategory(v as any)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verb">Verb</SelectItem>
              <SelectItem value="noun">Noun</SelectItem>
              <SelectItem value="adjective">Adjective</SelectItem>
              <SelectItem value="phrase">Phrase</SelectItem>
              <SelectItem value="slang">Slang</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Difficulty</div>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Tags (comma separated)</div>
          <Input className="rounded-xl" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          className="rounded-xl"
          onClick={() => {
            if (!pt.trim() || !en.trim()) return;
            props.onSubmit({
              id: uid("v"),
              createdAt: Date.now(),
              portugueseText: pt.trim(),
              englishTranslation: en.trim(),
              exampleSentence: example.trim() || undefined,
              personalNote: note.trim() || undefined,
              category,
              tags: tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
              difficulty,
              source: "manual",
              timesUsed: 0,
              timesLookedUp: 0,
              confidenceScore: 2,
            });
          }}
        >
          Save
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        In production: validate duplicates, persist to DB, and wire into spaced repetition.
      </div>
    </div>
  );
}

function Flashcards(props: {
  cards: Flashcard[];
  onBack: () => void;
  onReviewed: (card: Flashcard) => void;
}) {
  const due = useMemo(() => props.cards.filter((c) => c.nextReviewDate <= Date.now()), [props.cards]);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const card = due[index] ?? null;

  function rate(rating: "easy" | "medium" | "hard") {
    if (!card) return;
    const updated = sm2Review(card, rating);
    props.onReviewed(updated);
    setShowBack(false);
    setIndex((i) => i + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-xl" onClick={props.onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <SectionTitle title="Flashcards" icon={<Layers className="h-5 w-5" />} />
        </div>
        <Badge variant="secondary" className="rounded-full">
          Due today: {due.length}
        </Badge>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          {!card ? (
            <div className="text-center">
              <div className="text-lg font-semibold">All caught up</div>
              <div className="text-sm text-muted-foreground mt-1">No cards due right now.</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Card {index + 1} of {due.length}
              </div>

              <motion.div
                layout
                className="rounded-2xl border p-6 min-h-[180px] flex items-center justify-center text-center"
              >
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">{card.type}</div>
                  <div className="text-xl font-semibold whitespace-pre-line">
                    {showBack ? card.back : card.front}
                  </div>
                  {card.hint && !showBack && (
                    <div className="text-sm text-muted-foreground">Hint: {card.hint}</div>
                  )}
                </div>
              </motion.div>

              <div className="flex items-center justify-between gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setShowBack((b) => !b)}>
                  {showBack ? "Show front" : "Reveal"}
                </Button>

                <div className="flex items-center gap-2">
                  <Button className="rounded-xl" onClick={() => rate("hard")} disabled={!showBack}>
                    Hard
                  </Button>
                  <Button variant="secondary" className="rounded-xl" onClick={() => rate("medium")} disabled={!showBack}>
                    Medium
                  </Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => rate("easy")} disabled={!showBack}>
                    Easy
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                This uses a simplified SM-2 variant. In production, track accuracy by card type and integrate with daily goals.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
