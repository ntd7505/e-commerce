import { Link } from "react-router-dom";
import { PlusCircle, RefreshCw } from "lucide-react";

type ProductListHeaderProps = {
    loading: boolean;
    onRefresh: () => void;
};

export function ProductListHeader({ loading, onRefresh }: ProductListHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
                <p className="mt-1 text-sm font-medium text-gray-500">
                    Manage products, pricing, stock, media, and status.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
                <Link
                    to="/admin/products/add"
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                    <PlusCircle className="h-4 w-4" /> Add Product
                </Link>
            </div>
        </div>
    );
}
