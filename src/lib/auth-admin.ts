import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

export interface AdminSessionResult {
  session?: Session | null;
  error?: NextResponse;
}

/**
 * Check if the current request has an admin session.
 * Returns either the session or an error response (403 Unauthorized).
 * Usage in API routes:
 *   const { session, error } = await getAdminSession();
 *   if (error) return error;
 *   // Use session safely
 */
export async function getAdminSession(): Promise<AdminSessionResult> {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 403 }),
    };
  }

  return { session };
}
