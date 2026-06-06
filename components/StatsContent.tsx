// components/StatsContent.tsx
"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";
import { getExpensesFromStorage, getTotalAmount } from "@/lib/expenseStorage";
import type { Expense, ExpenseCategory } from "@/types/expense";

// Har category ka color + label — stats page pe bars aur badges ke liye
const CATEGORY_CONFIG: Record <
  ExpenseCategory,
  { label: string; bar: string; badge: string; dot: string }
> = {
  food:          { label: "Food",          dot: "bg-orange-400",  bar: "bg-orange-400",  badge: "bg-orange-50 dark:bg-orange-400/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-400/20" },
  transport:     { label: "Transport",     dot: "bg-blue-400",    bar: "bg-blue-400",    badge: "bg-blue-50 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-400/20" },
  shopping:      { label: "Shopping",      dot: "bg-pink-400",    bar: "bg-pink-400",    badge: "bg-pink-50 dark:bg-pink-400/10 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-400/20" },
  bills:         { label: "Bills",         dot: "bg-red-400",     bar: "bg-red-400",     badge: "bg-red-50 dark:bg-red-400/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/20" },
  entertainment: { label: "Entertainment", dot: "bg-purple-400",  bar: "bg-purple-400",  badge: "bg-purple-50 dark:bg-purple-400/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-400/20" },
  health:        { label: "Health",        dot: "bg-green-400",   bar: "bg-green-400",   badge: "bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-400/20" },
  other:         { label: "Other",         dot: "bg-slate-400",   bar: "bg-slate-400",   badge: "bg-slate-50 dark:bg-slate-400/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-400/20" },
};

function getMonthLabel(dateStr: string): string {
  // "2024-06-05" → "Jun 2024"
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year:  "numeric",
  });
}

export default function StatsContent() {

  const expenses = useMemo(
  () => getExpensesFromStorage(),
  []
);

  // ── Summary numbers ───
  const total       = useMemo(() => getTotalAmount(expenses), [expenses]);
  const count       = expenses.length;
  const avgPerEntry = count > 0 ? total / count : 0;
  // Agar koi expense nahi → 0 dikhao (NaN se bacho)

  const highest = useMemo(
    () => expenses.reduce<Expense | null>(
      (max, e) => (!max || e.amount > max.amount ? e : max), null
    ),
    [expenses]
    // reduce: sab expenses mein se sabse zyada amount wali nikalo
  );

  const categoryBreakdown = useMemo(() => {
    // Har category ka total amount nikalo
    const map: Partial<Record<ExpenseCategory, number>> = {};

    expenses.forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
      // ?? 0 = pehli baar 0 se shuru karo
    });

    // Object ko array mein badlo, sort karo highest first
    return Object.entries(map)
      .map(([cat, amount]) => ({
        category: cat as ExpenseCategory,
        amount:   amount ?? 0,
        percent:  total > 0 ? Math.round(((amount ?? 0) / total) * 100) : 0,
        // percent = (category total / grand total) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
      // Highest category sabse upar
  }, [expenses, total]);

  // ── Monthly breakdown 
  const monthlyBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    // key = "Jun 2024", value = total amount

    expenses.forEach((e) => {
      const month = getMonthLabel(e.date);
      map[month] = (map[month] ?? 0) + e.amount;
    });

    // Sort: latest month pehle
    return Object.entries(map)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
      .slice(0, 6);
      // Sirf last 6 months dikhao
  }, [expenses]);

  // Monthly max — progress bar ke liye reference point
  const maxMonthly = useMemo(
    () => Math.max(...monthlyBreakdown.map((m) => m.amount), 1),
    // Math.max(...) = array ka sabse bada value
    // ,1 = agar empty ho toh 0 se divide na ho
    [monthlyBreakdown]
  );

  // ── Empty state ────
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-6 mb-4">
          <BarChart3 size={36} className="text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          No data yet
        </p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Add some expenses to see your stats
        </p>
      </div>
    );
  }

  // ─── Render
  return (
    <div className="space-y-8">

      {/* ── Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Spent",
            value: `Rs. ${total.toLocaleString()}`,
            icon:  <Wallet size={18} />,
            color: "text-violet-500 bg-violet-50 dark:bg-violet-400/10",
          },
          {
            label: "Total Expenses",
            value: count.toString(),
            icon:  <BarChart3 size={18} />,
            color: "text-blue-500 bg-blue-50 dark:bg-blue-400/10",
          },
          {
            label: "Avg per Entry",
            value: `Rs. ${Math.round(avgPerEntry).toLocaleString()}`,
            // Math.round → decimal nahi chahiye summary mein
            icon:  <TrendingUp size={18} />,
            color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-400/10",
          },
          {
            label: "Highest Expense",
            value: highest ? `Rs. ${highest.amount.toLocaleString()}` : "—",
            sub:   highest?.title,
            // ?. = highest null ho sakta hai
            icon:  <TrendingDown size={18} />,
            color: "text-orange-500 bg-orange-50 dark:bg-orange-400/10",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={[
              "rounded-2xl border p-5 transition-colors duration-300",
              "border-slate-200 dark:border-slate-800",
              "bg-white dark:bg-slate-900/60",
            ].join(" ")}
          >
            {/* Icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              {card.icon}
            </div>
            {/* Label */}
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {card.label}
            </p>
            {/* Value */}
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {card.value}
            </p>
            {/* Optional subtitle (highest expense ka title) */}
            {card.sub && (
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 truncate">
                {card.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Two column layout: Category + Monthly ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* ── Category Breakdown ── */}
        <div className={[
          "rounded-2xl border p-6 transition-colors duration-300",
          "border-slate-200 dark:border-slate-800",
          "bg-white dark:bg-slate-900/60",
        ].join(" ")}>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">
            Spending by Category
          </h2>

          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-slate-400">No data</p>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.map(({ category, amount, percent }) => {
                const cfg = CATEGORY_CONFIG[category];
                return (
                  <div key={category}>
                    {/* Row: dot + label + percent + amount */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {percent}%
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white min-w-[80px] text-right">
                          Rs. {amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                        style={{ width: `${percent}%` }}
                        // inline style: percent dynamic hai — Tailwind purge kar deta
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Monthly Breakdown ── */}
        <div className={[
          "rounded-2xl border p-6 transition-colors duration-300",
          "border-slate-200 dark:border-slate-800",
          "bg-white dark:bg-slate-900/60",
        ].join(" ")}>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">
            Monthly Spending
          </h2>

          {monthlyBreakdown.length === 0 ? (
            <p className="text-sm text-slate-400">No data</p>
          ) : (
            <div className="space-y-4">
              {monthlyBreakdown.map(({ month, amount }) => {
                const barWidth = Math.round((amount / maxMonthly) * 100);
                // maxMonthly ke relative width — sabse bada 100%, baaki proportional

                return (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {month}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        Rs. {amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-400 transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Top 5 Expenses Table ── */}
      <div className={[
        "rounded-2xl border transition-colors duration-300",
        "border-slate-200 dark:border-slate-800",
        "bg-white dark:bg-slate-900/60",
      ].join(" ")}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Top 5 Expenses
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[...expenses]
            .sort((a, b) => b.amount - a.amount)
            // [...expenses] = original array mutate mat karo
            .slice(0, 5)
            // Sirf top 5
            .map((e, index) => {
              const cfg = CATEGORY_CONFIG[e.category];
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  {/* Rank number */}
                  <span className="text-sm font-bold text-slate-300 dark:text-slate-600 w-5 shrink-0">
                    {index + 1}
                    {/* index 0 se shuru hota hai → +1 karo */}
                  </span>

                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />

                  {/* Title + category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {e.title}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {cfg.label}
                    </p>
                  </div>

                  {/* Amount */}
                  <span className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                    Rs. {e.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

    </div>
  );
}