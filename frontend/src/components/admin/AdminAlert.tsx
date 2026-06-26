import type { ReactNode } from "react";

type AdminAlertProps = {
  tone: "success" | "error" | "info" | "warning";
  children: ReactNode;
  className?: string;
};

const toneClass: Record<AdminAlertProps["tone"], string> = {
  success: "border-emerald-100 bg-emerald-50 text-emerald-700",
  error: "border-red-100 bg-red-50 text-red-600",
  info: "border-blue-100 bg-blue-50 text-blue-700",
  warning: "border-amber-100 bg-amber-50 text-amber-700",
};

export function AdminAlert({ tone, children, className = "" }: AdminAlertProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${toneClass[tone]} ${className}`}>
      {children}
    </div>
  );
}