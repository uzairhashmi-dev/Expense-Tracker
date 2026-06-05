
import ExpenseDashboard from "@/components/ExpenseDashboard";

export const metadata = {
  title: "Expenses · ExpenseFlow",
  description: "View and manage all your expenses",
};
// Next.js metadata = <title> aur <meta> tags automatically set karta hai

export default function ExpensesPage() {
  // Yeh Server Component hai (no "use client")
  // Server pe render hoga, phir browser mein hydrate hoga
  // ExpenseDashboard "use client" hai — woh browser mein interactive hogi
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Expenses
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Track and manage all your spending
          </p>
        </div>

        {/* Dashboard — sab kuch yahan hai */}
        <ExpenseDashboard />
      </div>
    </main>
  );
}