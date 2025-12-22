import { sql } from '@vercel/postgres';

export { sql };

// Database initialization - run this once to create tables
export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create user_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        difficulty_level VARCHAR(20) DEFAULT 'beginner',
        native_language VARCHAR(10) DEFAULT 'en',
        preferred_accent VARCHAR(20) DEFAULT 'sao-paulo',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create conversations table
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        difficulty_level VARCHAR(20) NOT NULL,
        preferred_accent VARCHAR(20) NOT NULL,
        started_at TIMESTAMP DEFAULT NOW(),
        ended_at TIMESTAMP,
        message_count INTEGER DEFAULT 0
      )
    `;

    // Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create corrections table
    await sql`
      CREATE TABLE IF NOT EXISTS corrections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        mistake TEXT NOT NULL,
        correction TEXT NOT NULL,
        explanation TEXT NOT NULL,
        grammar_category VARCHAR(100) NOT NULL,
        confidence_score INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create vocabulary table
    await sql`
      CREATE TABLE IF NOT EXISTS vocabulary (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        word VARCHAR(255) NOT NULL,
        translation VARCHAR(255) NOT NULL,
        context TEXT,
        times_encountered INTEGER DEFAULT 1,
        first_seen_at TIMESTAMP DEFAULT NOW(),
        last_seen_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, word)
      )
    `;

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_corrections_user_id ON corrections(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON vocabulary(user_id)`;

    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to get or create user settings
export async function getUserSettings(userId: string) {
  const result = await sql`
    SELECT * FROM user_settings WHERE user_id = ${userId}
  `;

  if (result.rows.length === 0) {
    // Create default settings
    await sql`
      INSERT INTO user_settings (user_id, difficulty_level, native_language, preferred_accent)
      VALUES (${userId}, 'beginner', 'en', 'sao-paulo')
    `;

    return {
      userId,
      difficultyLevel: 'beginner',
      nativeLanguage: 'en',
      preferredAccent: 'sao-paulo'
    };
  }

  const settings = result.rows[0];
  return {
    userId: settings.user_id,
    difficultyLevel: settings.difficulty_level,
    nativeLanguage: settings.native_language,
    preferredAccent: settings.preferred_accent
  };
}

// Get user progress stats
export async function getUserProgressStats(userId: string) {
  const conversations = await sql`
    SELECT COUNT(*) as count FROM conversations WHERE user_id = ${userId}
  `;

  const vocabulary = await sql`
    SELECT COUNT(*) as count FROM vocabulary WHERE user_id = ${userId}
  `;

  const corrections = await sql`
    SELECT COUNT(*) as count FROM corrections WHERE user_id = ${userId}
  `;

  const lastPractice = await sql`
    SELECT MAX(started_at) as last_date FROM conversations WHERE user_id = ${userId}
  `;

  // Calculate streak
  const recentDays = await sql`
    SELECT DISTINCT DATE(started_at) as practice_date
    FROM conversations
    WHERE user_id = ${userId}
    ORDER BY practice_date DESC
    LIMIT 30
  `;

  let currentStreak = 0;
  if (recentDays.rows.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < recentDays.rows.length; i++) {
      const practiceDate = new Date(recentDays.rows[i].practice_date);
      practiceDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - practiceDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    totalConversations: parseInt(conversations.rows[0].count),
    totalVocabulary: parseInt(vocabulary.rows[0].count),
    totalCorrections: parseInt(corrections.rows[0].count),
    currentStreak,
    lastPracticeDate: lastPractice.rows[0].last_date || null
  };
}
