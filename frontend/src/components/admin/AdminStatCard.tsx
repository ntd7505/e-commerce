import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  label: string;
  value: number | string;
  helper?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  accent?: "emerald" | "blue" | "violet" | "amber" | "rose" | "sky";
};

const accentIconBg: Record<NonNullable<AdminStatCardProps["accent"]>, string> = {
  emerald: "bg-success-soft text-success",
  blue: "bg-primary-soft text-primary",
  violet: "bg-violet-100 text-violet-600",
  amber: "bg-warning-soft text-warning",
  rose: "bg-rose-100 text-rose-600",
  sky: "bg-sky-100 text-sky-600",
};

export function AdminStatCard({ label, value, helper, icon: Icon, iconClassName, accent }: AdminStatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-bold text-text leading-none">{value}</p>
          {helper && <p className="mt-1.5 text-xs text-muted">{helper}</p>}
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClassName ?? accentIconBg[accent ?? "emerald"]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
