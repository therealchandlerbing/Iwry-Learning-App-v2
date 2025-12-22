"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Create user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Sign in automatically
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but login failed. Please try logging in.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-[#1e2433] p-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-gradient-to-br from-[#00d9ff] to-[#a855f7] flex items-center justify-center text-white text-2xl font-bold glow-cyan-sm">
            I
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Start learning Portuguese for free
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 p-3 text-sm text-[#ef4444]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-[#0f1419] px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-[#00d9ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00d9ff]/20 transition-all duration-300"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-[#0f1419] px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-[#00d9ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00d9ff]/20 transition-all duration-300"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-[#0f1419] px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-[#00d9ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00d9ff]/20 transition-all duration-300"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-muted-foreground">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#00d9ff] to-[#00b8d9] px-4 py-3 font-semibold text-[#0f1419] shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border"></div>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#00d9ff] hover:underline">
            Sign in
          </Link>
        </p>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
