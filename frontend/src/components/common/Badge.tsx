import React from "react";
import { clsx } from "../../utils/cn";

type BadgeVariant =
  | "primary"
  | "danger"
  | "success"
  | "warning"
  | "neutral"
  | "outline";

type BadgeSize = "sm" | "md";

const VARIANT: Record<BadgeVariant, string> = {
  primary: "bg-primary-soft text-primary",
  danger: "bg-danger-soft text-danger",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  neutral: "bg-surface-alt text-text-muted",
  outline: "bg-canvas text-text border border-border-strong",
};

const DOT: Record<BadgeVariant, string> = {
  primary: "bg-primary",
  danger: "bg-danger",
  success: "bg-success",
  warning: "bg-warning",
  neutral: "bg-text-subtle",
  outline: "bg-text",
};

const SIZE: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

type BadgeProps = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  dot = false,
  className,
  children,
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full font-bold",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {dot && <span className={clsx("h-1.5 w-1.5 rounded-full", DOT[variant])} />}
      {children}
    </span>
  );
};

export default Badge;
