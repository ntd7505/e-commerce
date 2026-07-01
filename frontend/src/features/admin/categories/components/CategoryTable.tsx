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
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1.5 shadow-inner">
          <button className="rounded-md border border-border-strong/60 bg-surface px-5 py-2 text-sm font-bold text-success shadow-sm">
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
              className="w-72 rounded-lg border border-border-strong bg-surface/50 py-2.5 pl-4 pr-10 text-sm font-medium outline-none placeholder:font-normal placeholder:text-muted focus:border-success focus:ring-1 focus:ring-success"
            />
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
          <button className="rounded-xl border border-border bg-surface p-2.5 text-muted shadow-sm hover:bg-surface hover:text-text">
            <Filter className="h-4 w-4" />
          </button>
          <button className="rounded-xl border border-border bg-surface p-2.5 text-muted shadow-sm hover:bg-surface hover:text-text">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-6 text-center text-sm font-semibold text-muted">
          Đang tải danh mục...
        </div>
      )}

      {!loading && error && (
        <div className="p-6 text-center text-sm font-semibold text-danger">{error}</div>
      )}

      {!loading && !error && filteredCategories.length === 0 && (
        <div className="p-6 text-center text-sm font-semibold text-muted">
          Chưa có danh mục phù hợp.
        </div>
      )}

      {!loading && !error && filteredCategories.length > 0 && (
        <div className="overflow-x-auto px-5 py-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-success-soft/60 font-bold text-success">
                <th className="rounded-l-lg px-4 py-4 text-sm font-bold">No.</th>
                <th className="px-4 py-4 text-sm font-bold">Category</th>
                <th className="px-4 py-4 text-sm font-bold">Slug</th>
                <th className="px-4 py-4 text-sm font-bold">Parent</th>
                <th className="px-4 py-4 text-sm font-bold">Children</th>
                <th className="px-4 py-4 text-sm font-bold">Status</th>
                <th className="rounded-r-lg px-4 py-4 text-right text-sm font-bold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCategories.map((category, index) => (
                <tr key={category.id} className="group transition-colors hover:bg-surface/50">
                  <td className="px-4 py-4 text-sm font-extrabold text-text">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-text transition-colors group-hover:text-success">
                      {category.name}
                    </p>
                    {category.description && (
                      <p className="mt-1 max-w-md truncate text-xs font-medium text-muted">
                        {category.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-muted">
                    {category.slug}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-text">
                    {category.parent?.name ?? "-"}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-text">
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
                        className="text-muted transition-colors hover:text-success"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(category)}
                        disabled={deletingId === category.id}
                        className="text-muted transition-colors hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
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
