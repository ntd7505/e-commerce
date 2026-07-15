import { Edit, Search, Trash2 } from "lucide-react";
import { Badge, Button } from "../../../../components/common";
import { AdminImage } from "../../../../components/admin/AdminImage";
import type { BrandResponse } from "../adminBrandTypes";

type BrandTableProps = {
  brands: BrandResponse[];
  filteredBrands: BrandResponse[];
  loading: boolean;
  error: string;
  searchTerm: string;
  updatingId: number | null;
  onSearchChange: (value: string) => void;
  onEdit: (brand: BrandResponse) => void;
  onDelete: (brand: BrandResponse) => void;
  onToggleStatus: (brand: BrandResponse) => void;
};

export function BrandTable({
  brands,
  filteredBrands,
  loading,
  error,
  searchTerm,
  updatingId,
  onSearchChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: BrandTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-alt p-4">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1 shadow-inner">
          <button className="rounded-md bg-surface-alt px-4 py-1.5 text-xs font-bold text-primary shadow-sm">
            Tất cả ({brands.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm kiếm thương hiệu..."
              className="w-72 rounded-lg border border-border-strong bg-surface py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-6 text-center text-sm font-semibold text-muted">
          Đang tải thương hiệu...
        </div>
      )}

      {!loading && error && (
        <div className="p-6 text-center text-sm font-semibold text-danger">{error}</div>
      )}

      {!loading && !error && filteredBrands.length === 0 && (
        <div className="p-6 text-center text-sm font-semibold text-muted">
          Chưa có thương hiệu phù hợp.
        </div>
      )}

      {!loading && !error && filteredBrands.length > 0 && (
        <div className="overflow-x-auto px-5 py-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-surface-alt text-muted">
                <th className="rounded-l-lg px-4 py-3 text-xs font-bold uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Thương hiệu</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Đường dẫn</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Trạng thái</th>
                <th className="rounded-r-lg px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBrands.map((brand, index) => (
                <tr key={brand.id} className="group transition-colors hover:bg-surface/50">
                  <td className="px-4 py-4 text-sm font-extrabold text-text">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-surface p-2 shadow-sm">
                        <AdminImage
                          src={brand.logoUrl}
                          alt={brand.name}
                          fallbackLabel={brand.name}
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                          fallbackClassName="h-full w-full rounded-full"
                        />
                      </div>
                      <span className="font-bold text-text transition-colors group-hover:text-success">
                        {brand.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-muted">
                    {brand.slug}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(brand)}
                      disabled={updatingId === brand.id}
                      className="transition-opacity hover:opacity-80 disabled:opacity-50"
                    >
                      <Badge variant={brand.active ? "success" : "neutral"}>
                        {brand.active ? "Đang hiển thị" : "Đã ẩn"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(brand)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(brand)}
                        disabled={updatingId === brand.id}
                        loading={updatingId === brand.id}
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
