import type { ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info" | "purple";

type AdminBadgeProps = {
    variant: BadgeVariant;
    children: ReactNode;
    dot?: boolean;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
};

const variantClass: Record<BadgeVariant, string> = {
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    neutral: "bg-surface-alt text-muted",
    info: "bg-primary-soft text-primary",
    purple: "bg-purple-50 text-purple-700",
};

const dotClass: Record<BadgeVariant, string> = {
    success: "bg-success",
    warning: "bg-warning-soft0",
    danger: "bg-danger",
    neutral: "bg-border-strong",
    info: "bg-primary-soft0",
    purple: "bg-purple-500",
};

export function AdminBadge({
    variant,
    children,
    dot = false,
    className = "",
    onClick,
    disabled = false,
}: AdminBadgeProps) {
    const base = `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${variantClass[variant]} ${className}`;

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`${base} disabled:cursor-not-allowed disabled:opacity-60`}
            >
                {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotClass[variant]}`} />}
                {children}
            </button>
        );
    }

    return (
        <span className={base}>
            {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotClass[variant]}`} />}
            {children}
        </span>
    );
}
