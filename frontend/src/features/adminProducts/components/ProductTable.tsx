import { Link } from "react-router-dom";
import { Edit, Filter, Image as ImageIcon, MoreHorizontal, Search } from "lucide-react";
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
    loading: boolean;
    error: string;
    searchTerm: string;
    updatingId: number | null;
    onSearchChange: (value: string) => void;
    onToggleStatus: (product: ProductResponse) => void;
};

export function ProductTable({
    products,
    filteredProducts,
    loading,
    error,
    searchTerm,
    updatingId,
    onSearchChange,
    onToggleStatus,
}: ProductTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4">
                <div className="flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 p-1.5 shadow-inner">
                    <button className="rounded-md border border-gray-200/60 bg-white px-5 py-2 text-[13px] font-bold text-emerald-800 shadow-sm">
                        All Products ({products.length})
                    </button>
                    <button className="rounded-md px-5 py-2 text-[13px] font-bold text-gray-500 transition-colors hover:text-gray-900">
                        Active
                    </button>
                    <button className="rounded-md px-5 py-2 text-[13px] font-bold text-gray-500 transition-colors hover:text-gray-900">
                        Inactive
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

            {loading && (
                <div className="p-6 text-center text-sm font-semibold text-gray-500">Loading products...</div>
            )}

            {!loading && error && (
                <div className="p-6 text-center text-sm font-semibold text-red-600">{error}</div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
                <div className="p-6 text-center text-sm font-semibold text-gray-500">
                    Chưa có sản phẩm phù hợp.
                </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
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
                            {filteredProducts.map((product) => {
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
                                                    {thumbnail ? (
                                                        <img
                                                            src={thumbnail}
                                                            alt={product.name}
                                                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-gray-400" />
                                                    )}
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
                                            <button
                                                type="button"
                                                onClick={() => onToggleStatus(product)}
                                                disabled={updatingId === product.id}
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                                                    product.active
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {product.active ? "Active" : "Inactive"}
                                            </button>
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
            )}
        </div>
    );
}
