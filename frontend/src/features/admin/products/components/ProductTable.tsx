import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Edit, Filter, MoreHorizontal, Package, Search } from "lucide-react";
import { AdminBadge } from "../../../../components/admin/AdminBadge";
import { AdminEmptyState } from "../../../../components/admin/AdminEmptyState";
import { AdminImage } from "../../../../components/admin/AdminImage";
import { AdminSkeletonTable } from "../../../../components/admin/AdminSkeletonTable";
import type { ProductResponse } from "../adminProductTypes";
import {
    currencyFormatter,
    formatProductDate,
    getPrimaryVariant,
    getProductThumbnail,
} from "../adminProductViewUtils";

type ProductTableProps = {
    products: ProductResponse[];
    filteredProducts: ProductResponse[];
    paginatedProducts: ProductResponse[];
    loading: boolean;
    error: string;
    searchTerm: string;
    statusFilter: "all" | "active" | "inactive";
    updatingId: number | null;
    page: number;
    pageSize: number;
    totalPages: number;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
    onPageChange: (page: number) => void;
    onToggleStatus: (product: ProductResponse) => void;
};

export function ProductTable({
    products,
    filteredProducts,
    paginatedProducts,
    loading,
    error,
    searchTerm,
    statusFilter,
    updatingId,
    page,
    pageSize,
    totalPages,
    onSearchChange,
    onStatusFilterChange,
    onPageChange,
    onToggleStatus,
}: ProductTableProps) {
    const activeCount = products.filter((p) => p.active).length;
    const inactiveCount = products.filter((p) => !p.active).length;
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, filteredProducts.length);

    const tabClass = (tab: "all" | "active" | "inactive") =>
        statusFilter === tab
            ? "rounded-md border border-gray-200/60 bg-white px-5 py-2 text-[13px] font-bold text-emerald-800 shadow-sm"
            : "rounded-md px-5 py-2 text-[13px] font-bold text-gray-500 transition-colors hover:text-gray-900";

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4">
                <div className="flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 p-1.5 shadow-inner">
                    <button className={tabClass("all")} onClick={() => onStatusFilterChange("all")}>
                        All Products ({products.length})
                    </button>
                    <button className={tabClass("active")} onClick={() => onStatusFilterChange("active")}>
                        Active ({activeCount})
                    </button>
                    <button className={tabClass("inactive")} onClick={() => onStatusFilterChange("inactive")}>
                        Inactive ({inactiveCount})
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Search products"
                            className="w-72 rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-4 pr-10 text-[13px] font-medium outline-none placeholder:font-normal placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800">
                        <Filter className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {loading && <AdminSkeletonTable columns={8} rows={4} />}

            {!loading && error && (
                <div className="p-6 text-center text-sm font-semibold text-red-600">{error}</div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
                <AdminEmptyState
                    icon={Package}
                    title={
                        statusFilter === "all"
                            ? "Chưa có sản phẩm nào"
                            : statusFilter === "active"
                                ? "Không có sản phẩm active"
                                : "Không có sản phẩm inactive"
                    }
                    description="Sản phẩm sẽ xuất hiện ở đây sau khi được tạo."
                    compact
                />
            )}

            {!loading && !error && filteredProducts.length > 0 && (
                <>
                <div className="overflow-x-auto px-5 py-4">
                    <table className="w-full text-left text-[14px]">
                        <thead>
                            <tr className="border-none bg-emerald-50/60 font-bold text-emerald-900">
                                <th className="rounded-l-lg px-4 py-4 text-[13px] font-bold">Product</th>
                                <th className="px-4 py-4 text-[13px] font-bold">Brand</th>
                                <th className="px-4 py-4 text-[13px] font-bold">Category</th>
                                <th className="px-4 py-4 text-[13px] font-bold">Price</th>
                                <th className="px-4 py-4 text-[13px] font-bold">Stock</th>
                                <th className="px-4 py-4 text-[13px] font-bold">Created</th>
                                <th className="px-4 py-4 text-[13px] font-bold">Status</th>
                                <th className="rounded-r-lg px-4 py-4 text-right text-[13px] font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedProducts.map((product) => {
                                const thumbnail = getProductThumbnail(product);
                                const variant = getPrimaryVariant(product);
                                const salePrice = variant?.salePrice ?? 0;
                                const price = variant?.price ?? 0;
                                const displayPrice = salePrice > 0 ? salePrice : price;

                                return (
                                    <tr key={product.id} className="group transition-colors hover:bg-gray-50/50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-1.5">
                                                    <AdminImage
                                                        src={thumbnail}
                                                        alt={product.name}
                                                        fallbackLabel={product.name}
                                                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                                                        fallbackClassName="h-full w-full rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold leading-snug text-gray-900 transition-colors group-hover:text-emerald-600">
                                                        {product.name}
                                                    </p>
                                                    <p className="mt-1 text-[12px] font-medium text-gray-500">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[13px] font-bold text-gray-900">
                                            {product.brand?.name ?? "-"}
                                        </td>
                                        <td className="px-4 py-4 text-[13px] font-bold text-gray-900">
                                            {product.category?.name ?? "-"}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-[13px] font-extrabold text-gray-900">
                                                {currencyFormatter.format(displayPrice)}
                                            </div>
                                            {salePrice > 0 && price > salePrice && (
                                                <div className="mt-1 text-[12px] font-semibold text-gray-400 line-through">
                                                    {currencyFormatter.format(price)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-[13px] font-bold text-gray-900">
                                            {variant?.stockQuantity ?? 0}
                                        </td>
                                        <td className="px-4 py-4 text-[13px] font-semibold text-gray-500">
                                            {formatProductDate(product.createdAt)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <AdminBadge
                                                variant={product.active ? "success" : "neutral"}
                                                onClick={() => onToggleStatus(product)}
                                                disabled={updatingId === product.id}
                                            >
                                                {product.active ? "Active" : "Inactive"}
                                            </AdminBadge>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    to={`/admin/products/${product.id}/edit`}
                                                    className="text-gray-400 transition-colors hover:text-emerald-600"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                    <p className="text-[12px] font-medium text-gray-500">
                        {filteredProducts.length > 0
                            ? `Showing ${startItem}-${endItem} of ${filteredProducts.length}`
                            : "No results"}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Previous
                        </button>
                        <span className="text-[12px] font-bold text-gray-700">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
                </>
            )}
        </div>
    );
}
