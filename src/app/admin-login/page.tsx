"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleAdminSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push(callbackUrl);
    } else {
      setError("Invalid credentials");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface-default)] relative texture-noise flex flex-col items-center justify-center px-4">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[var(--accent-primary)]/5 blur-3xl pointer-events-none" />

      {/* Back to home — top left */}
      <div className="absolute top-5 left-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.png" alt="DesignT" width={32} height={32} className="h-8 w-auto object-contain rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300" priority />
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
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up stagger-1">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-5 border border-sky-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" className="w-5 h-5">
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
              <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-[var(--text-primary)] mb-1.5">Admin Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">Sign in to manage orders and users</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 animate-slide-up stagger-2">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminSignIn} className="space-y-4 animate-slide-up stagger-3">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full h-10 px-4 rounded-lg border border-[var(--border-default)] bg-[var(--surface-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all duration-200 disabled:opacity-50"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full h-10 px-4 rounded-lg border border-[var(--border-default)] bg-[var(--surface-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all duration-200 disabled:opacity-50"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full h-11 flex items-center justify-center
              bg-[var(--accent-primary)] text-white
              border border-[var(--accent-primary)] rounded-xl
              text-sm font-medium
              hover:shadow-md
              active:scale-[0.98]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-[var(--text-tertiary)] animate-slide-up stagger-4 leading-relaxed">
          Admin access only. Contact support for credentials.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}>
      <AdminLoginContent />
    </Suspense>
  );
}
