import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            return null;
          }

          const { email, password } = parsedCredentials.data;

          // Find user in database
          const result = await sql`
            SELECT * FROM users WHERE email = ${email}
          `;

          if (result.rows.length === 0) {
            return null;
          }

          const user = result.rows[0];

          // Verify password
          const passwordMatch = await bcrypt.compare(password, user.password_hash);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  }
});

// Helper function to create a new user
export async function createUser(email: string, password: string, name: string) {
  try {
    // Check if user exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existing.rows.length > 0) {
      return { error: 'User already exists' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING id, email, name
    `;

    const user = result.rows[0];

    // Create default user settings
    await sql`
      INSERT INTO user_settings (user_id, difficulty_level, native_language, preferred_accent)
      VALUES (${user.id}, 'beginner', 'en', 'sao-paulo')
    `;

    return { user };
  } catch (error) {
    console.error('Create user error:', error);
    return { error: 'Failed to create user' };
  }
}
