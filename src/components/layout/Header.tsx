"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Container } from "./Container";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 glass">
      <Container>
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="DesignT"
              width={130}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="relative text-sm font-medium text-[var(--text-secondary)] transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-[var(--accent-primary)] after:transition-all after:duration-200 hover:text-[var(--accent-primary)] hover:after:w-full"
            >
              How It Works
            </Link>
            <Link
              href="#quality"
              className="relative text-sm font-medium text-[var(--text-secondary)] transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-[var(--accent-primary)] after:transition-all after:duration-200 hover:text-[var(--accent-primary)] hover:after:w-full"
            >
              Quality
            </Link>
            <Link
              href="#faq"
              className="relative text-sm font-medium text-[var(--text-secondary)] transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-[var(--accent-primary)] after:transition-all after:duration-200 hover:text-[var(--accent-primary)] hover:after:w-full"
            >
              FAQ
            </Link>
          </nav>

          {/* CTA / User Menu */}
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/studio"
                className="inline-flex items-center justify-center h-9 px-5 text-sm font-medium
                  bg-[var(--accent-primary)] text-white rounded-xl
                  hover:shadow-md transition-all duration-200 active:scale-[0.98]"
              >
                Start Designing
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 h-9 px-3 rounded-xl border border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-inset)] transition-all duration-200 group"
                title={`Signed in as ${session.user.name} — click to sign out`}
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:inline max-w-[100px] truncate">
                  {session.user.name?.split(" ")[0]}
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium
                  text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl
                  hover:bg-[var(--surface-inset)] transition-all duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/studio"
                className="inline-flex items-center justify-center h-9 px-5 text-sm font-medium
                  bg-[var(--accent-primary)] text-white rounded-xl
                  hover:shadow-md transition-all duration-200 active:scale-[0.98]"
              >
                Start Designing
              </Link>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
