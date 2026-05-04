import type { LucideIcon } from "lucide-react";

type AdminEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function AdminEmptyState({ icon: Icon, title, description }: AdminEmptyStateProps) {
  return (
    <div className="mx-auto flex min-h-[420px] max-w-[900px] items-center justify-center">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">{description}</p>
      </div>
    </div>
  );
}
