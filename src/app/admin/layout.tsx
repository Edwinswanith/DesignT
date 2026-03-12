"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, useState, useEffect } from "react";
import { GridIcon, PackageIcon, UsersIcon } from "@/components/admin/Icons";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: GridIcon },
  { href: "/admin/orders", label: "Orders", icon: PackageIcon },
  { href: "/admin/users", label: "User Activity", icon: UsersIcon },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (status === "unauthenticated") {
      router.push(`/admin-login?callbackUrl=${pathname}`);
    } else if (status === "authenticated" && !isAdmin) {
      router.push("/");
    }
  }, [status, isAdmin, pathname, router]);

  // Show loading state while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--surface-default)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--border-default)] border-t-[var(--accent-primary)] animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Render nothing while redirecting
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-default)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--surface-raised)] border-b border-[var(--border-default)]">
        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[var(--surface-inset)] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[var(--text-primary)]">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <Link href="/admin" className="flex items-center gap-3 group">
              <Image src="/logo.png" alt="DesignT" width={64} height={64} className="h-14 w-auto object-contain" priority />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-[var(--text-tertiary)] tracking-widest uppercase">Admin</span>
                <span className="text-sm font-serif font-semibold text-[var(--text-primary)]">Panel</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session?.user?.name && (
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--surface-inset)]">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-xs font-semibold">
                  {session.user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">{session.user.name}</span>
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/admin-login" })}
              className="inline-flex items-center justify-center h-10 px-4 text-xs font-medium text-[var(--text-primary)] rounded-lg border border-[var(--border-default)] hover:bg-[var(--surface-inset)] transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-700/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-72 bg-[var(--surface-overlay)] border-r border-[var(--border-default)] overflow-y-auto transition-transform duration-300 z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-colors ${
                  isActive
                    ? "bg-sky-100 border-sky-200 text-sky-800"
                    : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-inset)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span className="flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </span>
                <span className="font-semibold tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="overflow-auto md:ml-72">
        <div className="p-4 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
