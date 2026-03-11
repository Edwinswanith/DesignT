"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { LoginTracker } from "./LoginTracker";

export function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <LoginTracker />
      {children}
    </NextAuthSessionProvider>
  );
}
