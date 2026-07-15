import { Edit, Search, Trash2 } from "lucide-react";
import { Badge, Button } from "../../../../components/common";
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
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-alt p-4">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1 shadow-inner">
          <button className="rounded-md bg-surface-alt px-4 py-1.5 text-xs font-bold text-primary shadow-sm">
            Tất cả ({categories.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm kiếm danh mục..."
              className="w-72 rounded-lg border border-border-strong bg-surface py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
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
              <tr className="bg-surface-alt text-muted">
                <th className="rounded-l-lg px-4 py-3 text-xs font-bold uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Danh mục</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Đường dẫn</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Danh mục cha</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Danh mục con</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Trạng thái</th>
                <th className="rounded-r-lg px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                  Thao tác
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
                    <Badge variant={category.active ? "success" : "neutral"}>
                      {category.active ? "Đang hiển thị" : "Đã ẩn"}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(category)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(category)}
                        disabled={deletingId === category.id}
                        loading={deletingId === category.id}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
