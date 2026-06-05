import Link from "next/link";
import { TrendingUp, PieChart, Wallet, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main
      className={[
        "min-h-screen px-4 py-16 sm:px-6 lg:px-8",
        "transition-colors duration-300",
        "bg-slate-50 dark:bg-slate-950",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl">

        {/* HERO */}
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1",
                "text-xs font-semibold border",
                "bg-violet-50 dark:bg-violet-400/10",
                "text-violet-600 dark:text-violet-300",
                "border-violet-200 dark:border-violet-400/20",
              ].join(" ")}
            >
              ✦ Next.js + TypeScript Project
            </span>

            <h1
              className={[
                "mt-5 text-4xl font-bold tracking-tight sm:text-6xl",
                "text-slate-900 dark:text-white",
              ].join(" ")}
            >
              Track your{" "}
              <span className="text-violet-500 dark:text-violet-400">
                expenses
              </span>{" "}
              smarter.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500 dark:text-slate-400">
              Add expenses, track categories, and visualize your spending
              habits with a clean and fast dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/expenses/add"
                className={[
                  "rounded-xl px-6 py-3 text-center font-semibold transition",
                  "bg-violet-500 hover:bg-violet-600",
                  "text-white",
                ].join(" ")}
              >
                + Add Expense
              </Link>
              <Link
                href="/expenses"
                className={[
                  "rounded-xl border px-6 py-3 text-center font-semibold transition",
                  "border-slate-300 dark:border-slate-700",
                  "text-slate-700 dark:text-slate-200",
                  "hover:bg-slate-100 dark:hover:bg-slate-900",
                ].join(" ")}
              >
                View All
              </Link>
            </div>

            {/* QUICK STATS */}
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { label: "Categories", value: "7 Types" },
                { label: "Storage", value: "Local" },
                { label: "Charts", value: "Stats Page" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PREVIEW CARD */}
          <div
            className={[
              "rounded-3xl border p-6 shadow-2xl transition-colors duration-300",
              "border-slate-200 dark:border-slate-800",
              "bg-white/70 dark:bg-slate-900/70",
            ].join(" ")}
          >
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-5">

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This Month
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Overview
                  </h2>
                </div>
                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-medium border",
                    "bg-emerald-50 dark:bg-emerald-400/10",
                    "text-emerald-600 dark:text-emerald-300",
                    "border-emerald-200 dark:border-emerald-400/20",
                  ].join(" ")}
                >
                  ● Live
                </span>
              </div>

              {/* Total */}
              <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Spent
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  Rs. 45,200
                </p>
              </div>

              {/* Preview Items */}
              <div className="mt-4 space-y-3">
                {[
                  {
                    title: "Groceries",
                    cat: "Food",
                    amount: "Rs. 3,500",
                    color: "bg-orange-400",
                  },
                  {
                    title: "Uber Ride",
                    cat: "Transport",
                    amount: "Rs. 850",
                    color: "bg-blue-400",
                  },
                  {
                    title: "Netflix",
                    cat: "Entertainment",
                    amount: "Rs. 1,100",
                    color: "bg-purple-400",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={[
                      "flex items-center justify-between rounded-xl border p-3",
                      "border-slate-200 dark:border-slate-800",
                      "bg-white dark:bg-slate-900",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${item.color}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {item.cat}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.amount}
                    </p>
                  </div>
                ))}
              </div>

              {/* View All Link */}
              <Link
                href="/expenses"
                className="mt-4 flex items-center justify-center gap-1
                           text-sm font-medium text-violet-500
                           hover:text-violet-600 transition-colors"
              >
                View all expenses
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-24">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500 dark:text-violet-400">
              Features
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Everything you need
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <Wallet size={22} />,
                title: "Track Expenses",
                desc: "Add expenses with title, amount, category, date, and notes.",
                color: "text-violet-500 bg-violet-50 dark:bg-violet-400/10",
              },
              {
                icon: <PieChart size={22} />,
                title: "Category Breakdown",
                desc: "See spending per category with dedicated pages and filters.",
                color: "text-blue-500 bg-blue-50 dark:bg-blue-400/10",
              },
              {
                icon: <TrendingUp size={22} />,
                title: "Stats & Insights",
                desc: "Visual progress bars, totals, and monthly breakdowns.",
                color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-400/10",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={[
                  "rounded-2xl border p-6 transition-colors duration-300",
                  "border-slate-200 dark:border-slate-800",
                  "bg-white dark:bg-slate-900/60",
                  "hover:border-violet-300 dark:hover:border-violet-400/30",
                  "hover:shadow-lg",
                ].join(" ")}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="mt-20">
          <div
            className={[
              "rounded-3xl border p-10 text-center transition-colors duration-300",
              "border-slate-200 dark:border-slate-800",
              "bg-white dark:bg-slate-900/60",
            ].join(" ")}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Start tracking today
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Add your first expense and take control of your finances.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/expenses/add"
                className="rounded-xl px-8 py-3 font-semibold transition bg-violet-500 hover:bg-violet-600 text-white"
              >
                + Add Expense
              </Link>
              <Link
                href="/stats"
                className={[
                  "rounded-xl border px-8 py-3 font-semibold transition",
                  "border-slate-300 dark:border-slate-700",
                  "text-slate-700 dark:text-slate-200",
                  "hover:bg-slate-100 dark:hover:bg-slate-900",
                ].join(" ")}
              >
                View Stats
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}