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
            ? "rounded-md border border-border-strong/60 bg-surface px-5 py-2 text-sm font-bold text-success shadow-sm"
            : "rounded-md px-5 py-2 text-sm font-bold text-muted transition-colors hover:text-text";

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
                <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1.5 shadow-inner">
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
                            className="w-72 rounded-lg border border-border-strong bg-surface/50 py-2.5 pl-4 pr-10 text-sm font-medium outline-none placeholder:font-normal placeholder:text-muted focus:border-success focus:ring-1 focus:ring-success"
                        />
                        <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    </div>
                    <button className="rounded-2xl border border-border bg-surface p-2.5 text-muted shadow-sm transition-colors hover:bg-surface hover:text-text">
                        <Filter className="h-4 w-4" />
                    </button>
                    <button className="rounded-2xl border border-border bg-surface p-2.5 text-muted shadow-sm transition-colors hover:bg-surface hover:text-text">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {loading && <AdminSkeletonTable columns={8} rows={4} />}

            {!loading && error && (
                <div className="p-6 text-center text-sm font-semibold text-danger">{error}</div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
                <AdminEmptyState
                    icon={Package}
                    title={
                        statusFilter === "all"
                            ? "Chua có s?n ph?m nào"
                            : statusFilter === "active"
                                ? "Không có s?n ph?m active"
                                : "Không có s?n ph?m inactive"
                    }
                    description="S?n ph?m s? xu?t hi?n ? dây sau khi du?c t?o."
                    compact
                />
            )}

            {!loading && !error && filteredProducts.length > 0 && (
                <>
                <div className="overflow-x-auto px-5 py-4">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-none bg-success-soft/60 font-bold text-success">
                                <th className="rounded-l-lg px-4 py-4 text-sm font-bold">Product</th>
                                <th className="px-4 py-4 text-sm font-bold">Brand</th>
                                <th className="px-4 py-4 text-sm font-bold">Category</th>
                                <th className="px-4 py-4 text-sm font-bold">Price</th>
                                <th className="px-4 py-4 text-sm font-bold">Stock</th>
                                <th className="px-4 py-4 text-sm font-bold">Created</th>
                                <th className="px-4 py-4 text-sm font-bold">Status</th>
                                <th className="rounded-r-lg px-4 py-4 text-right text-sm font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedProducts.map((product) => {
                                const thumbnail = getProductThumbnail(product);
                                const variant = getPrimaryVariant(product);
                                const salePrice = variant?.salePrice ?? 0;
                                const price = variant?.price ?? 0;
                                const displayPrice = salePrice > 0 ? salePrice : price;

                                return (
                                    <tr key={product.id} className="group transition-colors hover:bg-surface/50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-1.5">
                                                    <AdminImage
                                                        src={thumbnail}
                                                        alt={product.name}
                                                        fallbackLabel={product.name}
                                                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                                                        fallbackClassName="h-full w-full rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold leading-snug text-text transition-colors group-hover:text-success">
                                                        {product.name}
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-muted">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-bold text-text">
                                            {product.brand?.name ?? "-"}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-bold text-text">
                                            {product.category?.name ?? "-"}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-extrabold text-text">
                                                {currencyFormatter.format(displayPrice)}
                                            </div>
                                            {salePrice > 0 && price > salePrice && (
                                                <div className="mt-1 text-xs font-semibold text-muted line-through">
                                                    {currencyFormatter.format(price)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-bold text-text">
                                            {variant?.stockQuantity ?? 0}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-semibold text-muted">
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
                                                    className="text-muted transition-colors hover:text-success"
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

                <div className="flex items-center justify-between border-t border-border px-5 py-3">
                    <p className="text-xs font-medium text-muted">
                        {filteredProducts.length > 0
                            ? `Showing ${startItem}-${endItem} of ${filteredProducts.length}`
                            : "No results"}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="flex items-center gap-1 rounded-2xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted shadow-sm hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Previous
                        </button>
                        <span className="text-xs font-bold text-text">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="flex items-center gap-1 rounded-2xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted shadow-sm hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
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
