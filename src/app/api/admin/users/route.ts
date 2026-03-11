import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth-admin";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const { session, error } = await getAdminSession();
    if (error) return error;

    await connectDB();

    // Get all users sorted by createdAt desc
    const users = await User.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
