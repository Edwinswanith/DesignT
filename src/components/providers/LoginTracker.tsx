"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function LoginTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      // Track login
      fetch("/api/track-login", { method: "POST" }).catch((err) =>
        console.error("Failed to track login:", err)
      );
    }
  }, [status, session?.user?.email]);

  return null;
}
