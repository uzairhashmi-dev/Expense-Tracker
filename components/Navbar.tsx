"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Wallet,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import type { ExpenseCategory } from "@/types/expense";

const CATEGORIES: { label: string; value: ExpenseCategory }[] = [
  { label: "Food", value: "food" },
  { label: "Transport", value: "transport" },
  { label: "Shopping", value: "shopping" },
  { label: "Bills", value: "bills" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health", value: "health" },
  { label: "Other", value: "other" },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/expenses", label: "Expenses" },
  { href: "/stats", label: "Stats" },
];

// Category dot colors
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: "bg-orange-400",
  transport: "bg-blue-400",
  shopping: "bg-pink-400",
  bills: "bg-red-400",
  entertainment: "bg-purple-400",
  health: "bg-green-400",
  other: "bg-slate-400",
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);

  return (
    <header
      className={[
        "sticky top-0 z-50 backdrop-blur-md",
        "transition-colors duration-300",
        "border-b",
        "border-slate-200 dark:border-slate-800",
        "bg-white/90 dark:bg-slate-950/90",
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="rounded-xl bg-violet-500 p-1.5">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            ExpenseFlow
          </span>
        </Link>

        <div className="flex items-center gap-1">

          {/* DESKTOP LINKS */}
          <div className="hidden sm:flex items-center gap-1 text-sm font-medium">

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "rounded-full px-4 py-2 transition-colors",
                  "text-slate-600 dark:text-slate-300",
                  "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "hover:text-slate-900 dark:hover:text-white",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}

            {/* CATEGORIES DROPDOWN */}
            <div className="relative group">
              <button
                type="button"
                className={[
                  "flex items-center gap-1 rounded-full px-4 py-2",
                  "transition-colors text-sm font-medium",
                  "text-slate-600 dark:text-slate-300",
                  "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "hover:text-slate-900 dark:hover:text-white",
                ].join(" ")}
              >
                Categories
                <ChevronDown
                  size={14}
                  className="transition-transform duration-200 group-hover:rotate-180"
                />
              </button>

              {/* Dropdown */}
              <div
                className={[
                  "absolute top-full left-0 mt-2 w-44",
                  "rounded-xl border p-1.5 z-50",
                  "opacity-0 invisible",
                  "group-hover:opacity-100 group-hover:visible",
                  "transition-all duration-200",
                  "bg-white dark:bg-slate-900",
                  "border-slate-200 dark:border-slate-800",
                  "shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50",
                ].join(" ")}
              >
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/categories/${cat.value}`}
                    className={[
                      "flex items-center gap-2 rounded-lg px-3 py-2",
                      "text-sm font-medium transition-colors",
                      "text-slate-600 dark:text-slate-300",
                      "hover:bg-slate-50 dark:hover:bg-slate-800",
                      "hover:text-slate-900 dark:hover:text-white",
                    ].join(" ")}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_COLORS[cat.value]}`}
                    />
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* ADD EXPENSE BUTTON */}
            <Link
              href="/expenses/add"
              className={[
                "ml-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                "bg-violet-500 hover:bg-violet-600",
                "text-white",
              ].join(" ")}
            >
              + Add
            </Link>
          </div>

          {/* THEME TOGGLE */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={[
              "rounded-full p-2 transition-colors",
              "text-slate-600 dark:text-slate-300",
              "hover:bg-slate-100 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
            className={[
              "sm:hidden rounded-full p-2 transition-colors",
              "text-slate-600 dark:text-slate-300",
              "hover:bg-slate-100 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div
          className={[
            "sm:hidden border-t px-4 py-4 space-y-1",
            "border-slate-200 dark:border-slate-800",
            "bg-white dark:bg-slate-950",
          ].join(" ")}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={[
                "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                "text-slate-600 dark:text-slate-300",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}

          {/* MOBILE CATEGORIES */}
          <button
            type="button"
            onClick={() => setIsCatOpen(!isCatOpen)}
            className={[
              "w-full flex items-center justify-between",
              "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              "text-slate-600 dark:text-slate-300",
              "hover:bg-slate-100 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            <span>Categories</span>
            <ChevronDown
              size={14}
              className={[
                "transition-transform duration-200",
                isCatOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          {isCatOpen && (
            <div className="ml-4 space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/categories/${cat.value}`}
                  onClick={() => {
                    setIsOpen(false);
                    setIsCatOpen(false);
                  }}
                  className={[
                    "flex items-center gap-2 rounded-xl px-4 py-2.5",
                    "text-sm font-medium transition-colors",
                    "text-slate-600 dark:text-slate-300",
                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                  ].join(" ")}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat.value]}`}
                  />
                  {cat.label}
                </Link>
              ))}
            </div>
          )}

          {/* MOBILE ADD BUTTON */}
          <Link
            href="/expenses/add"
            onClick={() => setIsOpen(false)}
            className={[
              "block rounded-xl px-4 py-3 text-sm font-semibold",
              "text-center transition-colors mt-2",
              "bg-violet-500 hover:bg-violet-600 text-white",
            ].join(" ")}
          >
            + Add Expense
          </Link>
        </div>
      )}
    </header>
  );
}