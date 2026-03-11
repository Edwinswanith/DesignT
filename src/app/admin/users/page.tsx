"use client";

import { useEffect, useMemo, useState } from "react";
import { ClockIcon, PackageIcon, UsersIcon, LoginIcon } from "@/components/admin/Icons";

interface User {
  _id: string;
  email: string;
  name: string;
  lastLogin?: string;
  loginCount: number;
  totalOrders: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }

  const analytics = useMemo(() => {
    const totalOrders = users.reduce((sum, user) => sum + user.totalOrders, 0);
    const totalLogins = users.reduce((sum, user) => sum + user.loginCount, 0);

    const activeUsers = users.filter((user) => {
      if (!user.lastLogin) {
        return false;
      }
      const delta = Date.now() - new Date(user.lastLogin).getTime();
      return delta <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      totalUsers: users.length,
      totalOrders,
      totalLogins,
      activeUsers,
    };
  }, [users]);

  if (loading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  if (users.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-8">Users</h1>
        <div className="text-center py-12 text-[var(--text-secondary)]">No users found</div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-5 md:p-7">
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[var(--text-primary)] tracking-tight">
              Users
            </h1>
            <span className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-widest">
              {users.length}
            </span>
          </div>
          <p className="text-lg text-[var(--text-secondary)] font-light">
            Registered users and their activity summary
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Users</p>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <UsersIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-serif font-bold text-cyan-700">{analytics.totalUsers}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Orders</p>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <PackageIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-serif font-bold text-sky-700">{analytics.totalOrders}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Logins</p>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <LoginIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-serif font-bold text-teal-700">{analytics.totalLogins}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Active</p>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ClockIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-serif font-bold text-slate-700">{analytics.activeUsers}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--surface-inset)]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Logins
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Last Active
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-[var(--surface-inset)] transition-colors duration-200 group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center text-sm font-semibold text-[var(--accent-primary)]">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {user.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-[var(--text-secondary)] font-mono break-all max-w-xs">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center justify-center min-w-10 h-10 rounded-lg bg-sky-100 text-sky-700 font-semibold text-sm">
                      {user.totalOrders}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center justify-center min-w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-semibold text-sm">
                      {user.loginCount}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-[var(--text-secondary)]">
                      {user.lastLogin ? (
                        <>
                          <div className="font-medium">
                            {new Date(user.lastLogin).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-[var(--text-tertiary)] mt-1">
                            {new Date(user.lastLogin).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </>
                      ) : (
                        <span className="text-[var(--text-tertiary)] italic">Never logged in</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-[var(--text-secondary)]">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-[var(--border-default)]">
          {users.map((user) => (
            <div key={`mobile-${user._id}`} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center text-sm font-semibold text-[var(--accent-primary)]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] break-all">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-sky-50 border border-sky-100 p-2 text-sm text-sky-700 font-semibold">
                  Orders: {user.totalOrders}
                </div>
                <div className="rounded-lg bg-teal-50 border border-teal-100 p-2 text-sm text-teal-700 font-semibold">
                  Logins: {user.loginCount}
                </div>
              </div>

              <div className="text-xs text-[var(--text-secondary)]">
                {user.lastLogin ? (
                  <>
                    <div>
                      Last Active: {new Date(user.lastLogin).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div>
                      Joined: {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div>Last Active: Never logged in</div>
                    <div>
                      Joined: {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
