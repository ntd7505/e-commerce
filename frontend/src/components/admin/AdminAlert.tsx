import type { ReactNode } from "react";

type AdminAlertProps = {
  tone: "success" | "error" | "info" | "warning";
  children: ReactNode;
  className?: string;
};

const toneClass: Record<AdminAlertProps["tone"], string> = {
  success: "border-success-soft bg-success-soft text-success",
  error: "border-danger-soft bg-danger-soft text-danger",
  info: "border-primary-soft bg-primary-soft text-primary",
  warning: "border-warning-soft bg-warning-soft text-warning",
};

export function AdminAlert({ tone, children, className = "" }: AdminAlertProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${toneClass[tone]} ${className}`}>
      {children}
    </div>
  );
}