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
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-600",
    neutral: "bg-slate-100 text-slate-600",
    info: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
};

const dotClass: Record<BadgeVariant, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-400",
    neutral: "bg-slate-400",
    info: "bg-blue-500",
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
