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
  emerald: "bg-emerald-100 text-emerald-600",
  blue: "bg-blue-100 text-blue-600",
  violet: "bg-violet-100 text-violet-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
  sky: "bg-sky-100 text-sky-600",
};

export function AdminStatCard({ label, value, helper, icon: Icon, iconClassName, accent }: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName ?? accentIconBg[accent ?? "emerald"]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-extrabold text-slate-900">{value}</p>
      {helper && <p className="mt-1 text-xs font-medium text-slate-400">{helper}</p>}
    </div>
  );
}