export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "health"
  | "other";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note: string;
  createdAt: string;
};

export type ExpenseCategoryFilter = "all" | ExpenseCategory;

export type SortOrder = "newest" | "oldest" | "highest" | "lowest";