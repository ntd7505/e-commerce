import type { LucideIcon } from "lucide-react";

type AdminEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  compact?: boolean;
};

export function AdminEmptyState({ icon: Icon, title, description, compact = false }: AdminEmptyStateProps) {
  return (
    <div className="flex items-center justify-center">
      <div className={`w-full rounded-2xl border border-border bg-surface text-center shadow-sm ${compact ? "px-6 py-8" : "min-h-[300px] p-10"}`}>
        <div className={`mx-auto mb-4 flex items-center justify-center rounded-2xl bg-success-soft text-success ${compact ? "h-10 w-10" : "h-14 w-14"}`}>
          <Icon className={compact ? "h-5 w-5" : "h-7 w-7"} />
        </div>
        <h2 className={compact ? "text-base font-bold text-text" : "text-xl font-bold text-text"}>{title}</h2>
        <p className={`mx-auto mt-2 text-muted ${compact ? "max-w-md text-sm" : "max-w-xl text-sm"}`}>{description}</p>
      </div>
    </div>
  );
}