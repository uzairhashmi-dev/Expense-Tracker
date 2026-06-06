
import StatsContent from "@/components/StatsContent";

export const metadata = {
  title: "Stats · ExpenseFlow",
  description: "Visual breakdown of your spending habits",
};

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="mb-8">
          <span className={[
            "inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3",
            "text-xs font-semibold border",
            "bg-violet-50 dark:bg-violet-400/10",
            "text-violet-600 dark:text-violet-300",
            "border-violet-200 dark:border-violet-400/20",
          ].join(" ")}>
            ✦ Analytics
          </span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Spending Stats
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Visual breakdown of where your money goes
          </p>
        </div>

        <StatsContent />
      </div>
    </main>
  );
}