// app/categories/page.tsx
// URL: /categories → sab categories ki overview

import Link from "next/link";
import type { ExpenseCategory } from "@/types/expense";

// ─── All categories with their display config ─────────────────────────────────
const CATEGORIES: {
  value: ExpenseCategory;
  label: string;
  desc:  string;
  dot:   string;
  badge: string;
  icon:  string;
}[] = [
  { value: "food",          label: "Food",          desc: "Groceries, restaurants, takeout",    dot: "bg-orange-400",  badge: "bg-orange-50 dark:bg-orange-400/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-400/20",       icon: "🍔" },
  { value: "transport",     label: "Transport",     desc: "Fuel, rides, public transit",        dot: "bg-blue-400",    badge: "bg-blue-50 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-400/20",                 icon: "🚗" },
  { value: "shopping",      label: "Shopping",      desc: "Clothes, electronics, online orders",dot: "bg-pink-400",    badge: "bg-pink-50 dark:bg-pink-400/10 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-400/20",                 icon: "🛍️" },
  { value: "bills",         label: "Bills",         desc: "Rent, utilities, subscriptions",     dot: "bg-red-400",     badge: "bg-red-50 dark:bg-red-400/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/20",                       icon: "📄" },
  { value: "entertainment", label: "Entertainment", desc: "Movies, games, events, dining out",  dot: "bg-purple-400",  badge: "bg-purple-50 dark:bg-purple-400/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-400/20",     icon: "🎬" },
  { value: "health",        label: "Health",        desc: "Doctor, pharmacy, gym, wellness",    dot: "bg-green-400",   badge: "bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-400/20",           icon: "💊" },
  { value: "other",         label: "Other",         desc: "Anything that doesn't fit above",    dot: "bg-slate-400",   badge: "bg-slate-50 dark:bg-slate-400/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-400/20",           icon: "📦" },
];

export const metadata = {
  title: "Categories · ExpenseFlow",
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Categories
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Browse expenses by category
          </p>
        </div>

        {/* Category grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/categories/${cat.value}`}
              className={[
                "group rounded-2xl border p-5 transition-all duration-200",
                "border-slate-200 dark:border-slate-800",
                "bg-white dark:bg-slate-900/60",
                "hover:border-violet-300 dark:hover:border-violet-400/30",
                "hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-slate-950",
              ].join(" ")}
            >
              {/* Emoji icon */}
              <div className="text-2xl mb-3">{cat.icon}</div>

              {/* Label + dot */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dot}`} />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {cat.label}
                </h2>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-5">
                {cat.desc}
              </p>

              {/* Arrow — hover pe dikhao */}
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity">
                View expenses →
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}