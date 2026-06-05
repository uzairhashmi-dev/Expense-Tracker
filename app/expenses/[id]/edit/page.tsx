
"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getExpenseById } from "@/lib/expenseStorage";
import ExpenseForm from "@/components/ExpenseForm";

export default function EditExpensePage() {
  const params = useParams();
  const expense = useMemo(() => {
  const id = params.id as string;
  return getExpenseById(id);
}, [params.id]);

  

  if (!expense) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Expense not found</p>
          <Link href="/expenses" className="mt-4 inline-block text-sm text-violet-500">
            ← Back to Expenses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

        <Link href={`/expenses/${expense.id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={15} />
          Back to Expense
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Expense</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update the details below
          </p>
        </div>

        {/* mode="edit" + initialData = form prefill ho jaata hai */}
        <ExpenseForm mode="edit" initialData={expense} />
      </div>
    </main>
  );
}