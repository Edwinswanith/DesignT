"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/studio";

  async function handleGoogleSignIn() {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="min-h-screen bg-[var(--surface-default)] relative texture-noise flex flex-col items-center justify-center px-4">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[var(--accent-primary)]/5 blur-3xl pointer-events-none" />

      {/* Back to home — top left */}
      <div className="absolute top-5 left-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="DesignT"
            width={32}
            height={32}
            className="h-8 w-auto object-contain rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
            priority
          />
          <span className="text-base font-serif tracking-tight text-[var(--text-primary)]">
            DesignT
          </span>
        </Link>
      </div>

      {/* Login Card */}
      <div
        className="relative w-full max-w-sm bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)] p-8 animate-fade-in"
        style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)" }}
      >
        {/* Top edge highlight — matches studio panel pattern */}
        <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />

        {/* Header */}
        <div className="text-center mb-8 animate-slide-up stagger-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5 border border-blue-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4f6df5" strokeWidth="1.5" className="w-5 h-5">
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
              <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-[var(--text-primary)] mb-1.5">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Sign in to access your designs and orders
          </p>
        </div>

        {/* Divider with label */}
        <div className="relative flex items-center gap-3 mb-6 animate-slide-up stagger-2">
          <div className="flex-1 h-px bg-[var(--border-default)]" />
          <span className="text-xs text-[var(--text-tertiary)] font-medium tracking-wide">
            Continue with
          </span>
          <div className="flex-1 h-px bg-[var(--border-default)]" />
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="
            animate-slide-up stagger-3
            w-full h-11 flex items-center justify-center gap-3
            bg-[var(--surface-raised)] text-[var(--text-primary)]
            border border-[var(--border-default)] rounded-xl
            text-sm font-medium font-sans
            hover:border-[var(--border-hover)] hover:bg-[var(--surface-inset)]
            active:scale-[0.98]
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-sm
          "
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-[var(--text-tertiary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            /* Google SVG — official colors */
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
          )}
          {isLoading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-[var(--text-tertiary)] animate-slide-up stagger-4 leading-relaxed">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-[var(--accent-primary)] hover:underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[var(--accent-primary)] hover:underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* Studio CTA for non-account users */}
      <p className="mt-6 text-sm text-[var(--text-tertiary)] animate-fade-in">
        Just browsing?{" "}
        <Link
          href="/studio"
          className="text-[var(--accent-primary)] font-medium hover:underline underline-offset-2 transition-colors"
        >
          Start designing without an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}>
      <LoginContent />
    </Suspense>
  );
}
