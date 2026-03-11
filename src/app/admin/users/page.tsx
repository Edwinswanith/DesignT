"use client";

import { useEffect, useState } from "react";

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
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-8 border-b border-[var(--border-default)]/30 space-y-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-5xl font-serif font-black text-[var(--text-primary)] tracking-tight">
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

      {/* Users Table */}
      <div className="rounded-2xl border border-[var(--border-default)]/50 bg-[var(--surface-raised)]/80 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-default)]/50 bg-[var(--surface-inset)]/50">
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
            <tbody className="divide-y divide-[var(--border-default)]/30">
              {users.map((user, idx) => (
                <tr
                  key={user._id}
                  className="hover:bg-[var(--surface-inset)]/40 transition-colors duration-200 group"
                  style={{
                    animationDelay: `${idx * 25}ms`,
                  }}
                >
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
                    <div className="inline-flex items-center justify-center min-w-10 h-10 rounded-lg bg-blue-100/50 text-blue-700 font-semibold text-sm">
                      {user.totalOrders}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center justify-center min-w-10 h-10 rounded-lg bg-green-100/50 text-green-700 font-semibold text-sm">
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
      </div>

    </div>
  );
}
