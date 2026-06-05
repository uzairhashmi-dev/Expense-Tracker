// components/ExpenseForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";

import {
  getExpensesFromStorage,
  saveExpensesToStorage,
  updateExpenseInStorage,
} from "@/lib/expenseStorage";

import type { Expense, ExpenseCategory } from "@/types/expense";

// ─── Category options 
const CATEGORIES: { label: string; value: ExpenseCategory }[] = [
  { label: "Food",          value: "food" },
  { label: "Transport",     value: "transport" },
  { label: "Shopping",      value: "shopping" },
  { label: "Bills",         value: "bills" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health",        value: "health" },
  { label: "Other",         value: "other" },
];

// ─── Props 
type ExpenseFormProps = {
  mode: "add" | "edit";        // add = nayi expense, edit = purani update
  initialData?: Expense;        // edit mode mein purani values fill karo
  onSuccess?: () => void;       // save hone ke baad optional callback
};

// Ek jagah define karo → har field mein reuse karo
const inputCls = [
  "w-full rounded-xl border px-4 py-2.5 text-sm",
  "bg-white dark:bg-slate-900",
  "border-slate-200 dark:border-slate-700",
  "text-slate-900 dark:text-white",
  "placeholder:text-slate-400 dark:placeholder:text-slate-500",
  "focus:outline-none focus:border-violet-400 dark:focus:border-violet-500",
  "focus:ring-2 focus:ring-violet-400/20",
  "transition-colors",
].join(" ");

const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

// ─── Components
export default function ExpenseForm({
  mode,
  initialData,
  onSuccess,
}: ExpenseFormProps) {
  const router = useRouter();
  // router.push("/path") = programmatically navigate karo

  // ── Form state 
  const [title,    setTitle]    = useState(initialData?.title    ?? "");
  const [amount,   setAmount]   = useState(initialData?.amount   ? String(initialData.amount) : "");
  const [category, setCategory] = useState<ExpenseCategory>(initialData?.category ?? "food");
  const [date,     setDate]     = useState(initialData?.date     ?? new Date().toISOString().split("T")[0]);
  const [note,     setNote]     = useState(initialData?.note     ?? "");
  // ?. = optional chaining: initialData ho toh .title nikalo, warna undefined
  // ?? = nullish coalescing: undefined/null ho toh default do
  // edit mode mein initialData se prefill, add mode mein empty

  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Validatio
  function validate(): boolean {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Enter a valid amount greater than 0");
      return false;
    }
    if (!date) {
      setError("Date is required");
      return false;
    }
    setError("");
    return true;
    // true = valid, false = invalid (form submit mat karo)
  }

  // ── Submit ───
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    // Expense object banao
    const expenseData: Expense = {
      id:        mode === "edit" && initialData ? initialData.id : crypto.randomUUID(),
      // edit mode = same id rakho, add mode = nayi unique id banao
      title:     title.trim(),
      amount:    parseFloat(amount),
      category,
      date,
      note:      note.trim(),
      createdAt: mode === "edit" && initialData ? initialData.createdAt : new Date().toISOString(),
      // edit mode = original creation time rakho
    };

    if (mode === "add") {
      const existing = getExpensesFromStorage();
      saveExpensesToStorage([expenseData, ...existing]);
      // ...existing = spread operator = existing array ko unpack karo
      // Nayi expense sabse pehle
    } else {
      updateExpenseInStorage(expenseData);
    }

    setIsLoading(false);
    onSuccess?.();
    // ?. = onSuccess agar pass ki gayi ho tabhi call karo

    router.push("/expenses");
    // Save ke baad expenses list pe le jao
  }

  // ─── Render 
  return (
    <div
      className={[
        "rounded-2xl border p-6 transition-colors",
        "border-slate-200 dark:border-slate-800",
        "bg-white dark:bg-slate-900/60",
      ].join(" ")}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* noValidate = browser ki default validation band karo, hamari use karenge */}

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* ── Title ── */}
        <div>
          <label htmlFor="title" className={labelCls}>Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // onChange = user type kare → state update karo
            placeholder="e.g. Grocery shopping"
            className={inputCls}
          />
        </div>

        {/* ── Amount ── */}
        <div>
          <label htmlFor="amount" className={labelCls}>Amount (Rs.)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className={inputCls}
          />
        </div>

        {/* ── Category ── */}
        <div>
          <label htmlFor="category" className={labelCls}>Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            // as ExpenseCategory = TypeScript ko batao: yeh string valid category hai
            className={inputCls}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Date ── */}
        <div>
          <label htmlFor="date" className={labelCls}>Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* ── Note (optional) ── */}
        <div>
          <label htmlFor="note" className={labelCls}>
            Note
            <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any additional details..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* ── Buttons ── */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className={[
              "flex items-center gap-2 rounded-xl px-5 py-2.5",
              "text-sm font-semibold transition-colors",
              "bg-violet-500 hover:bg-violet-600 text-white",
              isLoading ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            <Save size={15} />
            {isLoading ? "Saving..." : mode === "add" ? "Add Expense" : "Save Changes"}
            {/* Ternary chaining: loading? → else: add ya edit? */}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            // router.back() = previous page pe jao (browser back button jaisa)
            className={[
              "flex items-center gap-2 rounded-xl border px-5 py-2.5",
              "text-sm font-semibold transition-colors",
              "border-slate-200 dark:border-slate-700",
              "text-slate-600 dark:text-slate-300",
              "hover:bg-slate-50 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            <X size={15} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}