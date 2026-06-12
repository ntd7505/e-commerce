import { PlusCircle } from "lucide-react";

type CategoryHeaderProps = {
  loading: boolean;
  onRefresh: () => void;
  onAdd: () => void;
};

export function CategoryHeader({ loading, onRefresh, onAdd }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-[22px] font-bold text-gray-900">Categories</h2>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Manage parent and child product categories.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-emerald-700"
        >
          <PlusCircle className="h-4 w-4" /> Add Category
        </button>
      </div>
    </div>
  );
}
