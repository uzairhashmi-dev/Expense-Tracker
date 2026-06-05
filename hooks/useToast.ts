import { useState, useRef } from "react";

export type ToastType = "delete" | "restore" | "success" | "error";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }

  function showToast(
    message: string,
    type: ToastType,
    duration = 3000
  ): string {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    const timer = setTimeout(() => {
      dismissToast(id);
    }, duration);
    timers.current.set(id, timer);
    return id;
  }

  return { toasts, showToast, dismissToast };
}