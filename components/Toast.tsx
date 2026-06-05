"use client";

import { X, CheckCircle, Trash2, RotateCcw, AlertCircle } from "lucide-react";
import type { Toast, ToastType } from "@/hooks/useToast";

type ToastContainerProps = {
  toasts: Toast[];           // array of all active toasts
  dismissToast: (id: string) => void; // function to remove a toast
};
// Yeh props parent se aayengi — jahan bhi Toast use hoga
// woh apna toasts[] aur dismissToast pass karega

// ─── Per-type styles + icons ─
const TOAST_CONFIG: Record <
  ToastType,
  { bar: string; bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  success: {
    bar:    "bg-emerald-500",               // left colored strip
    bg:     "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    text:   "text-emerald-800 dark:text-emerald-200",
    icon:   <CheckCircle size={16} />,
  },
  delete: {
    bar:    "bg-red-500",
    bg:     "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    text:   "text-red-800 dark:text-red-200",
    icon:   <Trash2 size={16} />,
  },
  restore: {
    bar:    "bg-blue-500",
    bg:     "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
    text:   "text-blue-800 dark:text-blue-200",
    icon:   <RotateCcw size={16} />,
  },
  error: {
    bar:    "bg-violet-500",
    bg:     "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-800",
    text:   "text-violet-800 dark:text-violet-200",
    icon:   <AlertCircle size={16} />,
  },
};

// ─── Single Toast Item 
// Yeh ek toast banata hai — container ne render karna hai isko
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const cfg = TOAST_CONFIG[toast.type];
  // toast.type = "success" | "delete" | "restore" | "error"
  // cfg = us type ka config object (colors, icon)

  return (
    <div
      className={[
        "flex items-start gap-3 rounded-xl border px-4 py-3",
        "shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50",
        "min-w-70 max-w-90",
        "animate-in slide-in-from-right-5 fade-in duration-300",
        cfg.bg,
        cfg.border,
      ].join(" ")}
    >
      {/* Left color strip — type identify karane ke liye */}
      <div className={`mt-0.5 shrink-0 ${cfg.text}`}>
        {cfg.icon}
      </div>

      <p className={`flex-1 text-sm font-medium leading-5 ${cfg.text}`}>
        {toast.message}
      </p>

      {/* Close button */}
      <button
        type="button"
        onClick={onDismiss}
        // onDismiss = parent se aayi dismissToast(id) function
        className={`shrink-0 rounded-lg p-0.5 transition-colors hover:opacity-60 ${cfg.text}`}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// Yeh screen ke corner mein fixed position mein rahega
// Sab toasts yahan stack honge
export default function ToastContainer({
  toasts,
  dismissToast,
}: ToastContainerProps) {
  // Agar koi toast nahi → kuch render hi mat karo
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2"
      aria-live="polite"
      // ↑ screen readers ko batao: "yahan notifications aati hain"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
          // har toast apna id pass karta hai dismiss ke liye
        />
      ))}
    </div>
  );
}