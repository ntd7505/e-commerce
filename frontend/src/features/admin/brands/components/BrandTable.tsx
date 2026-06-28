import { Edit, Filter, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { AdminBadge } from "../../../../components/admin/AdminBadge";
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
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1.5 shadow-inner">
          <button className="rounded-md border border-border-strong/60 bg-surface px-5 py-2 text-sm font-bold text-success shadow-sm">
            All Brands ({brands.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search brands"
              className="w-72 rounded-lg border border-border-strong bg-surface/50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none placeholder:font-normal placeholder:text-muted focus:border-success focus:ring-1 focus:ring-success"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
          <button className="rounded-2xl border border-border bg-surface p-2.5 text-muted shadow-sm hover:bg-surface hover:text-text">
            <Filter className="h-4 w-4" />
          </button>
          <button className="rounded-2xl border border-border bg-surface p-2.5 text-muted shadow-sm hover:bg-surface hover:text-text">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-6 text-center text-sm font-semibold text-muted">
          Ðang t?i thuong hi?u...
        </div>
      )}

      {!loading && error && (
        <div className="p-6 text-center text-sm font-semibold text-danger">{error}</div>
      )}

      {!loading && !error && filteredBrands.length === 0 && (
        <div className="p-6 text-center text-sm font-semibold text-muted">
          Chua có thuong hi?u phù h?p.
        </div>
      )}

      {!loading && !error && filteredBrands.length > 0 && (
        <div className="overflow-x-auto px-5 py-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-success-soft/60 font-bold text-success">
                <th className="rounded-l-lg px-4 py-4 text-sm font-bold">No.</th>
                <th className="px-4 py-4 text-sm font-bold">Brand</th>
                <th className="px-4 py-4 text-sm font-bold">Slug</th>
                <th className="px-4 py-4 text-sm font-bold">Status</th>
                <th className="rounded-r-lg px-4 py-4 text-right text-sm font-bold">
                  Action
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
                    <AdminBadge
                      variant={brand.active ? "success" : "neutral"}
                      onClick={() => onToggleStatus(brand)}
                      disabled={updatingId === brand.id}
                    >
                      {brand.active ? "Active" : "Inactive"}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(brand)}
                        className="text-muted transition-colors hover:text-success"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(brand)}
                        disabled={updatingId === brand.id}
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
