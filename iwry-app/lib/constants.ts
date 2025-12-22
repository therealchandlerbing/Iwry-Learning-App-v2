// Achievement thresholds for badges and progress tracking
export const ACHIEVEMENT_THRESHOLDS = {
  FIRST_LESSON: 1,
  VOCABULARY_MASTER: 10,
  STREAK_BADGE: 3,
} as const;

// Fluency calculation weights (should sum to 1)
export const FLUENCY_WEIGHTS = {
  CONVERSATIONS: 0.3,
  VOCABULARY: 0.4,
  STREAK: 0.3,
} as const;

// Target values for 100% fluency in each category
export const FLUENCY_TARGETS = {
  CONVERSATIONS: 50,
  VOCABULARY: 500,
  STREAK: 30,
} as const;

// Calculate fluency percentage based on user stats
export function calculateFluencyPercentage(stats: {
  totalConversations: number;
  totalVocabulary: number;
  currentStreak: number;
}): number {
  const conversationScore = Math.min(stats.totalConversations / FLUENCY_TARGETS.CONVERSATIONS, 1);
  const vocabularyScore = Math.min(stats.totalVocabulary / FLUENCY_TARGETS.VOCABULARY, 1);
  const streakScore = Math.min(stats.currentStreak / FLUENCY_TARGETS.STREAK, 1);

  const weightedScore =
    conversationScore * FLUENCY_WEIGHTS.CONVERSATIONS +
    vocabularyScore * FLUENCY_WEIGHTS.VOCABULARY +
    streakScore * FLUENCY_WEIGHTS.STREAK;

  return Math.round(weightedScore * 100);
}
