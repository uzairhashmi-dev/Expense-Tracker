"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, SlidersHorizontal } from "lucide-react";

import ExpenseList from "@/components/ExpenseList";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

import {
  getExpensesFromStorage,
  saveExpensesToStorage,
  getTotalAmount,
} from "@/lib/expenseStorage";

import type { Expense, ExpenseCategoryFilter, SortOrder } from "@/types/expense";

// ─── Filter + Sort options
const CATEGORY_FILTERS: { label: string; value: ExpenseCategoryFilter }[] = [
  { label: "All",           value: "all" },
  { label: "Food",          value: "food" },
  { label: "Transport",     value: "transport" },
  { label: "Shopping",      value: "shopping" },
  { label: "Bills",         value: "bills" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health",        value: "health" },
  { label: "Other",         value: "other" },
];

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Highest",      value: "highest" },
  { label: "Lowest",       value: "lowest" },
];

export default function ExpenseDashboard() {
  // ── State
  const [filter,   setFilter]         = useState<ExpenseCategoryFilter>("all");
  const [sort,     setSort]           = useState<SortOrder>("newest");
  const [showFilters, setShowFilters] = useState(false);
  // filter   = konsi category dikhani hai
  // sort     = kis order mein dikhani hain
  // showFilters = filter panel open/close (mobile ke liye)

  const { toasts, showToast, dismissToast } = useToast();
  // useToast hook se notification system le lo

const [expenses, setExpenses] = useState<Expense[]>(() =>
  getExpensesFromStorage()
);

  // ── Delete handler 
  function handleDelete(id: string) {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveExpensesToStorage(updated);
    // State update + localStorage update dono karo
    showToast("Expense deleted", "delete");
  }

  // ── Filtered + sorted list
  const displayed = useMemo(() => {
    // useMemo = expenses/filter/sort change hone par hi recalculate karo
    // Har render pe unnecessarily compute mat karo

    // Step 1: Category filter lagao
    let result = filter === "all"
      ? expenses
      : expenses.filter((e) => e.category === filter);

    // Step 2: Sort karo
    result = [...result].sort((a, b) => {
      if (sort === "newest")  return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sort === "oldest")  return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sort === "highest") return b.amount - a.amount;
      if (sort === "lowest")  return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [expenses, filter, sort]);
  // Dependency array: in mein se koi bhi badle → recalculate

  // ── Total for current filter 
  const total = useMemo(
    () => getTotalAmount(displayed),
    [displayed]
    // displayed change  par total bhi update ho
  );

  // ─── Render 
  return (
    <div className="space-y-6">

      {/* ── Header: total + add button ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filter === "all" ? "Total Spent" : `Total · ${filter}`}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Rs. {total.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            {displayed.length} expense{displayed.length !== 1 ? "s" : ""}
            {/* "1 expense" ya "3 expenses" — plural handle karo */}
          </p>
        </div>

        <Link
          href="/expenses/add"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-violet-500 hover:bg-violet-600 text-white transition-colors"
        >
          <Plus size={16} />
          Add Expense
        </Link>
      </div>

      {/* ── Filter toggle button (mobile friendly) ── */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className={[
          "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
          "border transition-colors",
          showFilters
            ? "border-violet-300 dark:border-violet-400/30 bg-violet-50 dark:bg-violet-400/10 text-violet-600 dark:text-violet-300"
            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
        ].join(" ")}
      >
        <SlidersHorizontal size={15} />
        Filters & Sort
        {filter !== "all" && (
          // Agar filter active hai → dot dikhao
          <span className="w-2 h-2 rounded-full bg-violet-500" />
        )}
      </button>

      {/* ── Filter + Sort Panel ── */}
      {showFilters && (
        <div className={[
          "rounded-2xl border p-4 space-y-4",
          "border-slate-200 dark:border-slate-800",
          "bg-white dark:bg-slate-900/60",
        ].join(" ")}>

          {/* Category filter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filter === f.value
                      ? "bg-violet-500 border-violet-500 text-white"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-400/30",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort options */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              Sort By
            </p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSort(s.value)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    sort === s.value
                      ? "bg-violet-500 border-violet-500 text-white"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-400/30",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Expense List ── */}
      <ExpenseList expenses={displayed} onDelete={handleDelete} />
      {/* displayed = filtered + sorted list */}
      {/* handleDelete = id milega → state + storage update karega */}

      {/* ── Toast Notifications ── */}
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </div>
  );
}