import { Edit, Filter, Image as ImageIcon, MoreHorizontal, Search, Trash2 } from "lucide-react";
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4">
        <div className="flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 p-1.5 shadow-inner">
          <button className="rounded-md border border-gray-200/60 bg-white px-5 py-2 text-[13px] font-bold text-emerald-800 shadow-sm">
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
              className="w-72 rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-[13px] font-medium outline-none placeholder:font-normal placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          <button className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-800">
            <Filter className="h-4 w-4" />
          </button>
          <button className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-800">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-6 text-center text-sm font-semibold text-gray-500">
          Đang tải thương hiệu...
        </div>
      )}

      {!loading && error && (
        <div className="p-6 text-center text-sm font-semibold text-red-600">{error}</div>
      )}

      {!loading && !error && filteredBrands.length === 0 && (
        <div className="p-6 text-center text-sm font-semibold text-gray-500">
          Chưa có thương hiệu phù hợp.
        </div>
      )}

      {!loading && !error && filteredBrands.length > 0 && (
        <div className="overflow-x-auto px-5 py-4">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="bg-emerald-50/60 font-bold text-emerald-900">
                <th className="rounded-l-lg px-4 py-4 text-[13px] font-bold">No.</th>
                <th className="px-4 py-4 text-[13px] font-bold">Brand</th>
                <th className="px-4 py-4 text-[13px] font-bold">Slug</th>
                <th className="px-4 py-4 text-[13px] font-bold">Status</th>
                <th className="rounded-r-lg px-4 py-4 text-right text-[13px] font-bold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBrands.map((brand, index) => (
                <tr key={brand.id} className="group transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-4 text-[13px] font-extrabold text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white p-2 shadow-sm">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <span className="font-bold text-gray-900 transition-colors group-hover:text-emerald-600">
                        {brand.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] font-semibold text-gray-500">
                    {brand.slug}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(brand)}
                      disabled={updatingId === brand.id}
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                        brand.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {brand.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(brand)}
                        className="text-gray-400 transition-colors hover:text-emerald-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(brand)}
                        disabled={updatingId === brand.id}
                        className="text-gray-400 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
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
