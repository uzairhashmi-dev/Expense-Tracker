"use client";

import { useMemo, useState } from "react";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Receipt } from "lucide-react";

import {
  getExpensesByCategory,
  getTotalAmount,
  getExpensesFromStorage,
  saveExpensesToStorage,
} from "@/lib/expenseStorage";

import ExpenseList from "@/components/ExpenseList";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

import type { Expense, ExpenseCategory } from "@/types/expense";

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record <
  ExpenseCategory,
  { label: string; dot: string; badge: string; icon: string; desc: string }
> = {
  food:          { label: "Food",          dot: "bg-orange-400",  icon: "🍔", desc: "Groceries, restaurants, takeout",     badge: "bg-orange-50 dark:bg-orange-400/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-400/20" },
  transport:     { label: "Transport",     dot: "bg-blue-400",    icon: "🚗", desc: "Fuel, rides, public transit",         badge: "bg-blue-50 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-400/20" },
  shopping:      { label: "Shopping",      dot: "bg-pink-400",    icon: "🛍️", desc: "Clothes, electronics, online orders", badge: "bg-pink-50 dark:bg-pink-400/10 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-400/20" },
  bills:         { label: "Bills",         dot: "bg-red-400",     icon: "📄", desc: "Rent, utilities, subscriptions",      badge: "bg-red-50 dark:bg-red-400/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/20" },
  entertainment: { label: "Entertainment", dot: "bg-purple-400",  icon: "🎬", desc: "Movies, games, events, dining out",   badge: "bg-purple-50 dark:bg-purple-400/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-400/20" },
  health:        { label: "Health",        dot: "bg-green-400",   icon: "💊", desc: "Doctor, pharmacy, gym, wellness",     badge: "bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-400/20" },
  other:         { label: "Other",         dot: "bg-slate-400",   icon: "📦", desc: "Anything that doesn't fit above",     badge: "bg-slate-50 dark:bg-slate-400/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-400/20" },
};

const VALID_CATEGORIES = Object.keys(CATEGORY_CONFIG) as ExpenseCategory[];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const params   = useParams();
  const category = params.category as string;

  const { toasts, showToast, dismissToast } = useToast();

  // ── Validate 
  const isValid = VALID_CATEGORIES.includes(category as ExpenseCategory);
  // Pehle check karo URL valid hai ya nahi
  // Agar /categories/pizza → isValid = false → error UI dikhao

  const [localExpenses, setLocalExpenses] = useState<Expense[]>(() =>
    isValid ? getExpensesByCategory(category as ExpenseCategory) : []
  );
  // useState ka initializer function use kiya —
  // Pehli render pe hi localStorage se data load ho jaata hai
  // Koi useEffect nahi, koi "loading" state nahi
  // Real-world: jaise class shuru hone se pehle hi register dekh lo
  // wait mat karo — seedha nikalo

  const total = useMemo(
    () => getTotalAmount(localExpenses),
    [localExpenses]
    // localExpenses change hone par total bhi update hoga
    // delete karne ke baad automatically recalculate
  );

  function handleDelete(id: string) {
    // Step 1: sab expenses lo
    const all = getExpensesFromStorage();
    // Step 2: deleted wala hatao
    const updated = all.filter((e) => e.id !== id);
    // Step 3: localStorage update karo
    saveExpensesToStorage(updated);
    // Step 4: local state bhi update karo — UI reflect kare
    setLocalExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast("Expense deleted", "delete");
  }

  if (!isValid) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Category not found
          </p>
          <Link
            href="/categories"
            className="mt-4 inline-block text-sm text-violet-500 hover:text-violet-600"
          >
            ← Back to Categories
          </Link>
        </div>
      </main>
    );
  }

  const cfg = CATEGORY_CONFIG[category as ExpenseCategory];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/categories"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          All Categories
        </Link>

        {/* Category header */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <div className="text-4xl">{cfg.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {cfg.label}
              </h1>
            </div>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400">
              {cfg.desc}
            </p>
          </div>
        </div>

        {/* Summary strip */}
        <div className="mb-6 flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Spent
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Rs. {total.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Entries
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {localExpenses.length}
            </p>
          </div>
          <Link
            href="/expenses/add"
            className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-violet-500 hover:bg-violet-600 text-white transition-colors"
          >
            + Add Expense
          </Link>
        </div>

        {/* Empty state */}
        {localExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5 mb-4">
              <Receipt size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              No {cfg.label} expenses yet
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Add your first {cfg.label.toLowerCase()} expense
            </p>
            <Link
              href="/expenses/add"
              className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold bg-violet-500 hover:bg-violet-600 text-white transition-colors"
            >
              + Add Expense
            </Link>
          </div>
        ) : (
          <ExpenseList expenses={localExpenses} onDelete={handleDelete} />
        )}

        <ToastContainer toasts={toasts} dismissToast={dismissToast} />
      </div>
    </main>
  );
}