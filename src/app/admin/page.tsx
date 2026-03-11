"use client";

import { ComponentType, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PackageIcon, DollarSignIcon, UsersIcon, ClockIcon } from "@/components/admin/Icons";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalUsers: number;
}

interface StatCard {
  title: string;
  value: string | number;
  textColor: string;
  iconColor: string;
  panelTone: string;
  Icon: ComponentType<{ className?: string }>;
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

  const statCards = useMemo<StatCard[]>(() => {
    if (!stats) {
      return [];
    }

    return [
      {
        title: "Total Orders",
        value: stats.totalOrders,
        textColor: "text-sky-700",
        iconColor: "text-sky-700",
        panelTone: "bg-sky-50",
        Icon: PackageIcon,
      },
      {
        title: "Pending Orders",
        value: stats.pendingOrders,
        textColor: "text-slate-700",
        iconColor: "text-slate-700",
        panelTone: "bg-slate-50",
        Icon: ClockIcon,
      },
      {
        title: "Total Revenue",
        value: `₹${stats.totalRevenue.toLocaleString()}`,
        textColor: "text-cyan-700",
        iconColor: "text-cyan-700",
        panelTone: "bg-cyan-50",
        Icon: DollarSignIcon,
      },
      {
        title: "Today's Revenue",
        value: `₹${stats.todayRevenue.toLocaleString()}`,
        textColor: "text-blue-700",
        iconColor: "text-blue-700",
        panelTone: "bg-blue-50",
        Icon: DollarSignIcon,
      },
      {
        title: "Total Users",
        value: stats.totalUsers,
        textColor: "text-teal-700",
        iconColor: "text-teal-700",
        panelTone: "bg-teal-50",
        Icon: UsersIcon,
      },
    ];
  }, [stats]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12 text-red-600">Failed to load stats</div>;
  }

  return (
    <div className="w-full space-y-7">
      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-5 md:p-7">
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[var(--text-primary)] tracking-tight">
              Dashboard
            </h1>
            <span className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-widest">Overview</span>
          </div>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl font-light leading-relaxed">
            Real-time insights into your business. Monitor orders, revenue, and user growth at a glance.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {statCards.map((card) => {
            const { Icon } = card;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-5"
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                    {card.title}
                  </p>
                  <div className={`w-8 h-8 rounded-lg ${card.panelTone} flex items-center justify-center ${card.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className={`mt-4 text-3xl font-bold font-serif ${card.textColor}`}>{card.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/orders"
            className="group rounded-2xl border border-sky-200/80 bg-[var(--surface-raised)] p-5 transition-colors hover:bg-sky-50"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center">
                  <PackageIcon className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">Manage Orders</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">View and manage all customer orders</p>
                </div>
              </div>
              <span className="w-9 h-9 rounded-full border border-sky-200 bg-white text-sky-700 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="group rounded-2xl border border-cyan-200/80 bg-[var(--surface-raised)] p-5 transition-colors hover:bg-cyan-50"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-cyan-700" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">User Activity</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Track user logins and activities</p>
                </div>
              </div>
              <span className="w-9 h-9 rounded-full border border-cyan-200 bg-white text-cyan-700 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
