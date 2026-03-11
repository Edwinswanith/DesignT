"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageIcon, DollarSignIcon, UsersIcon, ClockIcon } from "@/components/admin/Icons";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12 text-red-600">Failed to load stats</div>;
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      color: "bg-blue-50",
      textColor: "text-blue-700",
      Icon: PackageIcon,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      color: "bg-yellow-50",
      textColor: "text-yellow-700",
      Icon: ClockIcon,
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      color: "bg-green-50",
      textColor: "text-green-700",
      Icon: DollarSignIcon,
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString()}`,
      color: "bg-purple-50",
      textColor: "text-purple-700",
      Icon: DollarSignIcon,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "bg-pink-50",
      textColor: "text-pink-700",
      Icon: UsersIcon,
    },
  ];

  return (
    <div className="w-full space-y-12">
      {/* Hero Section */}
      <div className="space-y-3 pb-8 border-b border-[var(--border-default)]/30">
        <div className="flex items-baseline gap-3">
          <h1 className="text-5xl md:text-6xl font-serif font-black text-[var(--text-primary)] tracking-tight">
            Dashboard
          </h1>
          <span className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-widest">Overview</span>
        </div>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl font-light leading-relaxed">
          Real-time insights into your business. Monitor orders, revenue, and user growth at a glance.
        </p>
      </div>

      {/* Stats Grid - Refined Minimalist */}
      <div className="space-y-6">
        <h2 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card, idx) => {
            const { Icon } = card;
            return (
              <div
                key={card.title}
                className="group relative"
                style={{
                  animationDelay: `${idx * 50}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
                <div className="relative p-6 rounded-2xl border border-[var(--border-default)]/50 bg-[var(--surface-raised)]/80 backdrop-blur-sm transition-all duration-300 group-hover:border-[var(--border-default)] group-hover:shadow-md">
                  <div className="mb-6 pb-4 border-b border-[var(--border-default)]/30 flex items-start justify-between">
                    <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                      {card.title}
                    </p>
                    <div className="text-[var(--accent-primary)]/60 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className={`text-3xl md:text-4xl font-bold font-serif ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="space-y-6 pt-8 border-t border-[var(--border-default)]/30">
        <h2 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/orders"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-transparent border border-blue-200/30 p-8 transition-all duration-300 hover:shadow-lg hover:border-blue-300/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                <PackageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">Manage Orders</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">View and manage all customer orders</p>
              </div>
            </div>
            <div className="absolute right-6 bottom-6 text-blue-300 group-hover:text-blue-400 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-transparent border border-purple-200/30 p-8 transition-all duration-300 hover:shadow-lg hover:border-purple-300/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">User Activity</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Track user logins and activities</p>
              </div>
            </div>
            <div className="absolute right-6 bottom-6 text-purple-300 group-hover:text-purple-400 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
