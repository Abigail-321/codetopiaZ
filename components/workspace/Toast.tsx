"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  variant: "success" | "error";
  onDismiss: () => void;
}

export default function Toast({ message, variant, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
        variant === "success" ? "bg-emerald-600" : "bg-rose-600"
      }`}
    >
      <span>{variant === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
}