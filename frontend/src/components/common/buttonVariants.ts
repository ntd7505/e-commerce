import { clsx } from "../../utils/cn";

type Size = "sm" | "md" | "lg";
type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

const SIZE: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5 rounded-md",
  md: "h-11 px-5 text-sm gap-2 rounded-lg",
  lg: "h-13 px-7 text-base gap-2 rounded-lg",
};

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:scale-[0.98] shadow-sm",
  secondary:
    "bg-surface-alt text-text hover:bg-border border border-border-strong active:scale-[0.98]",
  outline:
    "bg-canvas text-text border border-border-strong hover:bg-surface active:scale-[0.98]",
  ghost: "bg-transparent text-text hover:bg-surface",
  danger:
    "bg-danger text-white hover:bg-danger-hover active:scale-[0.98] shadow-sm",
  success:
    "bg-success text-white hover:bg-emerald-600 active:scale-[0.98] shadow-sm",
};

const BASE =
  "inline-flex items-center justify-center font-semibold no-underline transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none cursor-pointer whitespace-nowrap";

export interface ButtonVariants {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: ButtonVariants = {}): string {
  return clsx(BASE, SIZE[size], VARIANT[variant], fullWidth && "w-full");
}
