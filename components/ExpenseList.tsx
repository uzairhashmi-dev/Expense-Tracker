"use client";

import { Receipt } from "lucide-react";
import ExpenseCard from "@/components/ExpenseCard";
import type { Expense } from "@/types/expense";

// ─── Props
type ExpenseListProps = {
  expenses: Expense[];             // jo expenses dikhani hain
  onDelete: (id: string) => void;  // delete handler — ExpenseDashboard se aayega
};
// ExpenseList khud kuch manage nahi karta
// Yeh "dumb component" pattern hai — sirf display, logic nahi

// ─── Component ─
export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {

  // ── Empty state 
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5 mb-4">
          <Receipt size={32} className="text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-base font-semibold text-slate-900 dark:text-white">
          No expenses yet
        </p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Add your first expense to get started...
        </p>
      </div>
    );
  }

  // ── List 
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          // key = React ka requirement for lists
          // id unique hai → perfect key
          expense={expense}
          onDelete={onDelete}
          // onDelete yahan se ExpenseCard tak pass ho raha hai
        />
      ))}
    </div>
  );
}