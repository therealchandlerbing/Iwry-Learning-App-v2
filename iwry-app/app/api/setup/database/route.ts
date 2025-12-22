import { initializeDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await initializeDatabase();

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Send a POST request to initialize the database",
    endpoint: "/api/setup/database",
  });
}
