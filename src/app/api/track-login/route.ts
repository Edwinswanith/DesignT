import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await connectDB();

    // Check if login already tracked in last 1 minute
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const lastModified = await User.findOne({
      email: session.user.email,
      updatedAt: { $gte: oneMinuteAgo },
    });

    if (lastModified) {
      return NextResponse.json({ success: true, cached: true });
    }

    // Upsert user with updated login info
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name: session.user.name || "User",
        lastLogin: new Date(),
        $inc: { loginCount: 1 },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
