import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const conn = await connectDB();
    const isConnected = conn.connection.readyState === 1;

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: "MongoDB connected",
        mongodb: "✓ Connected",
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "MongoDB not ready",
        mongodb: "✗ Not connected",
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: errorMessage,
        mongodb: "✗ Failed",
      },
      { status: 500 }
    );
  }
}
