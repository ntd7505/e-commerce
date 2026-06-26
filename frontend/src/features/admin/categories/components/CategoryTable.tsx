import { Edit, Filter, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { AdminBadge } from "../../../../components/admin/AdminBadge";
import type { CategoryResponse } from "../adminCategoryTypes";

type CategoryTableProps = {
  categories: CategoryResponse[];
  filteredCategories: CategoryResponse[];
  loading: boolean;
  error: string;
  searchTerm: string;
  deletingId: number | null;
  onSearchChange: (value: string) => void;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (category: CategoryResponse) => void;
};

export function CategoryTable({
  categories,
  filteredCategories,
  loading,
  error,
  searchTerm,
  deletingId,
  onSearchChange,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-4">
        <div className="flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 p-1.5 shadow-inner">
          <button className="rounded-md border border-slate-200/60 bg-white px-5 py-2 text-[13px] font-bold text-emerald-800 shadow-sm">
            All Categories ({categories.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search categories"
              className="w-72 rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-4 pr-10 text-[13px] font-medium outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <button className="rounded-2xl border border-slate-100 bg-white p-2.5 text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-800">
            <Filter className="h-4 w-4" />
          </button>
          <button className="rounded-2xl border border-slate-100 bg-white p-2.5 text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-800">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-6 text-center text-sm font-semibold text-slate-500">
          Đang tải danh mục...
        </div>
      )}

      {!loading && error && (
        <div className="p-6 text-center text-sm font-semibold text-red-600">{error}</div>
      )}

      {!loading && !error && filteredCategories.length === 0 && (
        <div className="p-6 text-center text-sm font-semibold text-slate-500">
          Chưa có danh mục phù hợp.
        </div>
      )}

      {!loading && !error && filteredCategories.length > 0 && (
        <div className="overflow-x-auto px-5 py-4">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="bg-emerald-50/60 font-bold text-emerald-900">
                <th className="rounded-l-lg px-4 py-4 text-[13px] font-bold">No.</th>
                <th className="px-4 py-4 text-[13px] font-bold">Category</th>
                <th className="px-4 py-4 text-[13px] font-bold">Slug</th>
                <th className="px-4 py-4 text-[13px] font-bold">Parent</th>
                <th className="px-4 py-4 text-[13px] font-bold">Children</th>
                <th className="px-4 py-4 text-[13px] font-bold">Status</th>
                <th className="rounded-r-lg px-4 py-4 text-right text-[13px] font-bold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((category, index) => (
                <tr key={category.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-4 py-4 text-[13px] font-extrabold text-slate-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                      {category.name}
                    </p>
                    {category.description && (
                      <p className="mt-1 max-w-md truncate text-[12px] font-medium text-slate-500">
                        {category.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-[13px] font-semibold text-slate-500">
                    {category.slug}
                  </td>
                  <td className="px-4 py-4 text-[13px] font-bold text-slate-900">
                    {category.parent?.name ?? "-"}
                  </td>
                  <td className="px-4 py-4 text-[13px] font-bold text-slate-900">
                    {category.children?.length ?? 0}
                  </td>
                  <td className="px-4 py-4">
                    <AdminBadge variant={category.active ? "success" : "neutral"}>
                      {category.active ? "Active" : "Inactive"}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="text-slate-400 transition-colors hover:text-emerald-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(category)}
                        disabled={deletingId === category.id}
                        className="text-slate-400 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
