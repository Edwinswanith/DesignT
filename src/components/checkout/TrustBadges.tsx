"use client";

const BADGES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Secure Payment",
    description: "256-bit SSL encryption",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: "Quality Guarantee",
    description: "Premium materials",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: "Easy Returns",
    description: "7-day policy",
  },
];

export function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {BADGES.map((badge, index) => (
        <div key={index} className="flex items-center gap-2 text-[var(--text-tertiary)]">
          {badge.icon}
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              {badge.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
