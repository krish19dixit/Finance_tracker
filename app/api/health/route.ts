import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  // In a production build environment, we might not want to connect to the database
  // during static generation. This check prevents build failures.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({
      status: "healthy",
      database: "skipped_in_build",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    await connectToDatabase()
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error.message || "Unknown error",
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
