import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateImageUsage } from "@/models/ImageUsage";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.email.toLowerCase();
    const usage = await getOrCreateImageUsage(userId);

    return NextResponse.json({
      remainingImagesToday: usage.remainingImagesToday,
      dailyLimit: usage.dailyLimit,
      todayImagesGenerated: usage.todayImagesGenerated,
    });
  } catch (error) {
    console.error("[image-usage] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image usage" },
      { status: 500 }
    );
  }
}
