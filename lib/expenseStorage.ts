import type { Expense, ExpenseCategory } from "@/types/expense";

const STORAGE_KEY = "expense-tracker-data"     //browser may is namsy save hoga

type StoredExpense = Expense & { note?: string };

export function getExpensesFromStorage(): Expense[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved) as StoredExpense[];
    return parsed.map((expense) => ({
      ...expense,
      note: expense.note ?? "",
    }));
  } catch {
    return [];
  }
}

export function saveExpensesToStorage(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function getExpenseById(id: string): Expense | null {
  const expenses = getExpensesFromStorage();
  return expenses.find((e) => e.id === id) ?? null;
}

export function updateExpenseInStorage(updated: Expense): void {
  const expenses = getExpensesFromStorage();
  const newExpenses = expenses.map((e) =>
    e.id === updated.id ? updated : e
  );
  saveExpensesToStorage(newExpenses);
}

export function getExpensesByCategory(
  category: ExpenseCategory
): Expense[] {
  return getExpensesFromStorage().filter(
    (e) => e.category === category
  );
}

export function getTotalAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
  // reduce → array ka sum nikalo
  // sum = running total
  // e.amount = har expense ka amount
}