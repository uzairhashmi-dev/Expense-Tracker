"use client";

import Link from "next/link";
import { Pencil, Trash2, Calendar, Tag } from "lucide-react";
import type { Expense, ExpenseCategory } from "@/types/expense";

// Har category ka apna color dot + label
const CATEGORY_CONFIG: Record <
  ExpenseCategory,
  { dot: string; badge: string; label: string }
> = {
  food:          { dot: "bg-orange-400", badge: "bg-orange-50 dark:bg-orange-400/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-400/20", label: "Food" },
  transport:     { dot: "bg-blue-400",   badge: "bg-blue-50 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-400/20",           label: "Transport" },
  shopping:      { dot: "bg-pink-400",   badge: "bg-pink-50 dark:bg-pink-400/10 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-400/20",           label: "Shopping" },
  bills:         { dot: "bg-red-400",    badge: "bg-red-50 dark:bg-red-400/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/20",                 label: "Bills" },
  entertainment: { dot: "bg-purple-400", badge: "bg-purple-50 dark:bg-purple-400/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-400/20", label: "Entertainment" },
  health:        { dot: "bg-green-400",  badge: "bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-400/20",     label: "Health" },
  other:         { dot: "bg-slate-400",  badge: "bg-slate-50 dark:bg-slate-400/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-400/20",     label: "Other" },
};


type ExpenseCardProps = {
  expense: Expense;               // single expense object
  onDelete: (id: string) => void; // delete button press hone par
};
// onDelete parent se aata hai — card khud delete nahi karta

// ─── Helper: date format karo
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
  });
}

// ─── Component
export default function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  const cfg = CATEGORY_CONFIG[expense.category];

  return (
    <div
      className={[
        "group rounded-2xl border p-4 transition-all duration-200",
        "border-slate-200 dark:border-slate-800",
        "bg-white dark:bg-slate-900/60",
        "hover:border-violet-300 dark:hover:border-violet-400/30",
        "hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-slate-950",
        // group = hover pe child elements bhi react kar sakein
      ].join(" ")}
    >
      {/* ── Top Row: dot + title + amount ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">

          <span className={`shrink-0 w-2.5 h-2.5 rounded-full mt-1 ${cfg.dot}`} />

          {/* Title — truncate karo agar bohot lamba ho */}
          <Link
            href={`/expenses/${expense.id}`}
            className="text-sm font-semibold text-slate-900 dark:text-white truncate hover:text-violet-500 transition-colors"
          >
            {expense.title}
          </Link>
        </div>

        {/* Amount — right side */}
        <span className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
          Rs. {expense.amount.toLocaleString()}
        </span>
      </div>

      {/* ── Middle Row: category badge + date ── */}
      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
        {/* Category badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.badge}`}
        >
          <Tag size={10} />
          {cfg.label}
        </span>

        {/* Date */}
        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Calendar size={12} />
          {formatDate(expense.date)}
        </span>
      </div>

      {/* ── Note (optional) ── */}
      {expense.note && (
        // Sirf tab render karo jab note ho — empty string = falsy = skip
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 line-clamp-2">
          {expense.note}
        </p>
      )}

      {/* ── Action buttons: hover pe dikhao ── */}
      <div
        className={[
          "mt-3 flex items-center justify-end gap-2",
          "opacity-0 group-hover:opacity-100",
          // group-hover: jab parent card hover ho tab buttons dikhao
          "transition-opacity duration-200",
        ].join(" ")}
      >
        {/* Edit button */}
        <Link
          href={`/expenses/${expense.id}/edit`}
          className={[
            "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-600 dark:text-slate-300",
            "hover:bg-violet-50 dark:hover:bg-violet-400/10",
            "hover:text-violet-600 dark:hover:text-violet-300",
            "hover:border-violet-300 dark:hover:border-violet-400/30",
            "transition-colors",
          ].join(" ")}
        >
          <Pencil size={12} />
          Edit
        </Link>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(expense.id)}
          // Parent ko batao: "is id wala delete karo"
          className={[
            "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-600 dark:text-slate-300",
            "hover:bg-red-50 dark:hover:bg-red-400/10",
            "hover:text-red-600 dark:hover:text-red-300",
            "hover:border-red-300 dark:hover:border-red-400/30",
            "transition-colors",
          ].join(" ")}
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
}