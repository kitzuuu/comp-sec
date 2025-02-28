import { NextResponse } from "next/server";

// This is intentionally insecure — it exposes environment variables
export async function GET() {
    return NextResponse.json({
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        SECRET_KEY: process.env.JWT_SECRET || "no-secret-key-found",  // Example of exposing sensitive keys
    });
}
