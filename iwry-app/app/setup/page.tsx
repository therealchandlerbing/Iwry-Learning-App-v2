"use client";

import { useState } from "react";

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const initializeDatabase = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/setup/database", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Database initialized successfully! You can now register and use the app.");
      } else {
        setStatus("error");
        setMessage(data.details || data.error || "Failed to initialize database");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-gradient-to-br from-[#009c3b] to-[#002776] flex items-center justify-center text-white text-3xl font-bold">
            I
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Iwry Setup</h1>
          <p className="mt-2 text-gray-600">
            Initialize the database to get started
          </p>
        </div>

        {status === "success" && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-green-700 text-sm">{message}</p>
            <a
              href="/register"
              className="mt-3 inline-block text-green-700 font-medium hover:underline"
            >
              Go to Registration →
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-700 text-sm">{message}</p>
          </div>
        )}

        <button
          onClick={initializeDatabase}
          disabled={status === "loading"}
          className="w-full py-3 px-4 bg-[#009c3b] text-white font-semibold rounded-lg hover:bg-[#00852f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? "Initializing..." : "Initialize Database"}
        </button>

        <p className="mt-6 text-center text-xs text-gray-500">
          This will create all necessary database tables.
          <br />
          Safe to run multiple times.
        </p>
      </div>
    </div>
  );
}
