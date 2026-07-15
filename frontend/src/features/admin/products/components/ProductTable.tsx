import { Link } from "react-router-dom";
import { Edit, Filter, MoreHorizontal, Package, Search } from "lucide-react";
import { Badge, Pagination } from "../../../../components/common";
import { buttonVariants } from "../../../../components/common/buttonVariants";
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
    totalPages,
    onSearchChange,
    onStatusFilterChange,
    onPageChange,
    onToggleStatus,
}: ProductTableProps) {
    const activeCount = products.filter((p) => p.active).length;
    const inactiveCount = products.filter((p) => !p.active).length;

    const tabClass = (tab: "all" | "active" | "inactive") =>
        statusFilter === tab
            ? "rounded-md border border-border-strong/60 bg-surface px-5 py-2 text-sm font-bold text-primary shadow-sm transition-all"
            : "rounded-md px-5 py-2 text-sm font-bold text-muted transition-colors hover:text-text";

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-alt p-4">
                <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1 shadow-inner">
                        <button className={tabClass("all")} onClick={() => onStatusFilterChange("all")}>
                            Tất cả ({products.length})
                        </button>
                        <button className={tabClass("active")} onClick={() => onStatusFilterChange("active")}>
                            Đang bán ({activeCount})
                        </button>
                        <button className={tabClass("inactive")} onClick={() => onStatusFilterChange("inactive")}>
                            Ngừng bán ({inactiveCount})
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) => onSearchChange(event.target.value)}
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-72 rounded-lg border border-border-strong bg-surface py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    </div>
                    <button className="rounded-xl border border-border bg-surface p-2.5 text-muted shadow-sm transition-colors hover:bg-surface hover:text-text">
                        <Filter className="h-4 w-4" />
                    </button>
                    <button className="rounded-xl border border-border bg-surface p-2.5 text-muted shadow-sm transition-colors hover:bg-surface hover:text-text">
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface-alt text-xs text-muted uppercase tracking-wider border-b border-border">
                            <tr>
                                <th className="px-5 py-3 font-bold">Sản phẩm</th>
                                <th className="px-5 py-3 font-bold">Thương hiệu</th>
                                <th className="px-5 py-3 font-bold">Danh mục</th>
                                <th className="px-5 py-3 text-right font-bold">Giá bán</th>
                                <th className="px-5 py-3 text-center font-bold">Tồn kho</th>
                                <th className="px-5 py-3 font-bold">Ngày tạo</th>
                                <th className="px-5 py-3 font-bold">Trạng thái</th>
                                <th className="px-5 py-3 text-right font-bold">Thao tác</th>
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
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-1.5 transition-transform group-hover:scale-105">
                                                    <AdminImage
                                                        src={thumbnail}
                                                        alt={product.name}
                                                        fallbackLabel={product.name}
                                                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                                                        fallbackClassName="h-full w-full rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold leading-snug text-text transition-colors group-hover:text-primary">
                                                        {product.name}
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-muted">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-text">
                                            {product.brand?.name ?? "-"}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-text">
                                            {product.category?.name ?? "-"}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="text-sm font-extrabold text-text">
                                                {currencyFormatter.format(displayPrice)}
                                            </div>
                                            {salePrice > 0 && price > salePrice && (
                                                <div className="mt-1 text-xs font-semibold text-muted line-through">
                                                    {currencyFormatter.format(price)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-center text-sm font-medium text-text">
                                            {variant?.stockQuantity ?? 0}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-muted">
                                            {formatProductDate(product.createdAt)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div 
                                                className={`inline-block cursor-pointer ${updatingId === product.id ? 'opacity-50 pointer-events-none' : ''}`}
                                                onClick={() => onToggleStatus(product)}
                                            >
                                                <Badge
                                                    variant={product.active ? "success" : "neutral"}
                                                >
                                                    {product.active ? "Đang bán" : "Ngừng bán"}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    to={`/admin/products/${product.id}/edit`}
                                                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-border p-5">
                    <Pagination 
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
                </>
            )}
        </div>
    );
}
