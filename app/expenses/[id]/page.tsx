
"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Calendar, Tag, FileText } from "lucide-react";

import { getExpenseById, getExpensesFromStorage, saveExpensesToStorage } from "@/lib/expenseStorage";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

import type { ExpenseCategory } from "@/types/expense";

// Category config (same as ExpenseCard)
const CATEGORY_CONFIG: Record<ExpenseCategory, { dot: string; badge: string; label: string }> = {
  food:          { dot: "bg-orange-400", badge: "bg-orange-50 dark:bg-orange-400/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-400/20", label: "Food" },
  transport:     { dot: "bg-blue-400",   badge: "bg-blue-50 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-400/20",             label: "Transport" },
  shopping:      { dot: "bg-pink-400",   badge: "bg-pink-50 dark:bg-pink-400/10 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-400/20",             label: "Shopping" },
  bills:         { dot: "bg-red-400",    badge: "bg-red-50 dark:bg-red-400/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/20",                   label: "Bills" },
  entertainment: { dot: "bg-purple-400", badge: "bg-purple-50 dark:bg-purple-400/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-400/20", label: "Entertainment" },
  health:        { dot: "bg-green-400",  badge: "bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-400/20",       label: "Health" },
  other:         { dot: "bg-slate-400",  badge: "bg-slate-50 dark:bg-slate-400/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-400/20",       label: "Other" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

export default function ExpenseDetailPage() {
  const params = useParams();
  // useParams → URL se dynamic segments nikalo
  // /expenses/abc123 → params = { id: "abc123" }

  const router  = useRouter();
  const { toasts, showToast, dismissToast } = useToast();

  const expense = useMemo(() => {
  const id = params.id as string;
  return getExpenseById(id);
}, [params.id]);

  function handleDelete() {
    if (!expense) return;
    const updated = getExpensesFromStorage().filter((e) => e.id !== expense.id);
    saveExpensesToStorage(updated);
    showToast("Expense deleted", "delete");
    setTimeout(() => router.push("/expenses"), 1500);
    // 1.5 seconds baad list pe jao — toast dikhne do pehle
  }

 

  // ── Not found state 
  if (!expense) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Expense not found</p>
          <Link href="/expenses" className="mt-4 inline-block text-sm text-violet-500 hover:text-violet-600">
            ← Back to Expenses
          </Link>
        </div>
      </main>
    );
  }

  const cfg = CATEGORY_CONFIG[expense.category];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

        <Link href="/expenses" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={15} />
          Back to Expenses
        </Link>

        {/* Expense card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5">

          {/* Title + amount */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full shrink-0 ${cfg.dot}`} />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{expense.title}</h1>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white shrink-0">
              Rs. {expense.amount.toLocaleString()}
            </span>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Tag size={15} className="text-slate-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 w-20">Category</span>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.badge}`}>
                {cfg.label}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-slate-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 w-20">Date</span>
              <span className="text-slate-900 dark:text-white">{formatDate(expense.date)}</span>
            </div>

            {expense.note && (
              <div className="flex items-start gap-3 text-sm">
                <FileText size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-500 dark:text-slate-400 w-20">Note</span>
                <span className="text-slate-900 dark:text-white flex-1">{expense.note}</span>
              </div>
            )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/expenses/${expense.id}/edit`}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-violet-500 hover:bg-violet-600 text-white transition-colors"
            >
              <Pencil size={14} />
              Edit Expense
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        <ToastContainer toasts={toasts} dismissToast={dismissToast} />
      </div>
    </main>
  );
}