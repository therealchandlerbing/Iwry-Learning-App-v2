export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type PortugueseAccent = 'sao-paulo' | 'rio' | 'northeast' | 'portugal';

// Shared constants for validation (v1 Architecture)
export const VALID_DIFFICULTY_LEVELS: readonly DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'] as const;

export const VALID_PORTUGUESE_ACCENTS: readonly PortugueseAccent[] = ['sao-paulo', 'rio', 'northeast', 'portugal'] as const;

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface UserSettings {
  userId: string;
  difficultyLevel: DifficultyLevel;
  nativeLanguage: string;
  preferredAccent: PortugueseAccent;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  difficultyLevel: DifficultyLevel;
  preferredAccent: PortugueseAccent;
  startedAt: Date;
  endedAt: Date | null;
  messageCount: number;
}

export interface Correction {
  id: string;
  userId: string;
  conversationId: string;
  mistake: string;
  correction: string;
  explanation: string;
  grammarCategory: string;
  createdAt: Date;
  confidenceScore: number; // 1-5
}

export interface Vocabulary {
  id: string;
  userId: string;
  word: string;
  translation: string;
  context: string | null;
  timesEncountered: number;
  firstSeenAt: Date;
}

export interface ProgressStats {
  totalConversations: number;
  totalVocabulary: number;
  totalCorrections: number;
  currentStreak: number;
  lastPracticeDate: Date | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  corrections?: Correction[];
}
