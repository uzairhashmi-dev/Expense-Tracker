
import ExpenseForm from "@/components/ExpenseForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Add Expense · ExpenseFlow",
};

export default function AddExpensePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

        {/* Back button */}
        <Link
          href="/expenses"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Expenses
        </Link>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add New Expense
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Fill in the details below
          </p>
        </div>

        {/* Form — mode="add" → no initialData */}
        <ExpenseForm mode="add" />
      </div>
    </main>
  );
}