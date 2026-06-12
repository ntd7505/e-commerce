import { Plus, RefreshCw } from "lucide-react";

type CouponHeaderProps = {
    loading: boolean;
    onRefresh: () => void;
    onAdd: () => void;
};

export function CouponHeader({ loading, onRefresh, onAdd }: CouponHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Coupons</h2>
                <p className="text-sm text-gray-500">
                    Manage discount codes and campaign rules
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>

                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                    <Plus className="h-4 w-4" />
                    Add Coupon
                </button>
            </div>
        </div>
    )
}