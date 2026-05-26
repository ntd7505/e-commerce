import { useState } from "react";
import { Edit, RotateCcw, Search, Trash2 } from "lucide-react";
import type { CouponViewMode } from "../hook/useAdminCoupons";
import type { CouponResponse } from "../adminCouponTypes";

type CouponStatusFilter = "ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED";

type CouponTableProps = {
    coupons: CouponResponse[];
    loading: boolean;
    error: string;
    viewMode: CouponViewMode;
    actionCouponId: number | null;
    onViewModeChange: (mode: CouponViewMode) => void;
    onEdit: (coupon: CouponResponse) => void;
    onDelete: (id: number) => void;
    onRestore: (id: number) => void;
    onToggleStatus: (id: number, active: boolean) => void;
};

function isExpired(coupon: CouponResponse) {
    return Boolean(coupon.endAt && new Date(coupon.endAt) < new Date());
}

function formatMoney(value: number | null) {
    if (value === null) {
        return "-";
    }

    return value.toLocaleString("vi-VN");
}

function formatDate(value: string | null) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function CouponTable({
    coupons,
    loading,
    error,
    viewMode,
    actionCouponId,
    onViewModeChange,
    onEdit,
    onDelete,
    onRestore,
    onToggleStatus,
}: CouponTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<CouponStatusFilter>("ALL");

    const filteredCoupons = coupons.filter((coupon) => {
        const keyword = searchTerm.toLowerCase();
        const matchesKeyword =
            coupon.code.toLowerCase().includes(keyword) ||
            coupon.name.toLowerCase().includes(keyword);

        if (!matchesKeyword) {
            return false;
        }

        if (viewMode === "DELETED") {
            return true;
        }

        if (statusFilter === "ACTIVE") {
            return coupon.active;
        }

        if (statusFilter === "INACTIVE") {
            return !coupon.active;
        }

        if (statusFilter === "EXPIRED") {
            return isExpired(coupon);
        }

        return true;
    });

    const filterOptions: Array<{ label: string; value: CouponStatusFilter }> = [
        { label: "All", value: "ALL" },
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
        { label: "Expired", value: "EXPIRED" },
    ];

    const viewOptions: Array<{ label: string; value: CouponViewMode }> = [
        { label: "Active coupons", value: "ACTIVE" },
        { label: "Deleted coupons", value: "DELETED" },
    ];

    const hasActiveFilters =
        searchTerm.trim() !== "" || (viewMode === "ACTIVE" && statusFilter !== "ALL");

    function clearFilters() {
        setSearchTerm("");
        setStatusFilter("ALL");
    }

    function changeViewMode(mode: CouponViewMode) {
        setStatusFilter("ALL");
        onViewModeChange(mode);
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
                <div>
                    <h3 className="font-bold text-gray-900">Coupon List</h3>
                    <p className="mt-1 text-xs font-medium text-gray-500">
                        Showing {filteredCoupons.length} of {coupons.length} coupons
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                        {viewOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => changeViewMode(option.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                                    viewMode === option.value
                                        ? "bg-white text-emerald-700 shadow-sm"
                                        : "text-gray-500 hover:text-gray-800"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {viewMode === "ACTIVE" && (
                        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setStatusFilter(option.value)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                                        statusFilter === option.value
                                            ? "bg-white text-emerald-700 shadow-sm"
                                            : "text-gray-500 hover:text-gray-800"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search coupons"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {loading && <div className="p-6 text-sm text-gray-500">Loading coupons...</div>}

            {!loading && error && (
                <div className="p-6 text-sm font-semibold text-red-600">{error}</div>
            )}

            {!loading && !error && filteredCoupons.length === 0 && (
                <div className="p-6 text-sm text-gray-500">No coupons found.</div>
            )}

            {!loading && !error && filteredCoupons.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1120px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-3">Code</th>
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Discount</th>
                                <th className="px-5 py-3">Conditions</th>
                                <th className="px-5 py-3">Usage</th>
                                <th className="px-5 py-3">Validity</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredCoupons.map((coupon) => {
                                const busy = actionCouponId === coupon.id;

                                return (
                                    <tr key={coupon.id}>
                                        <td className="px-5 py-4 font-bold text-gray-900">{coupon.code}</td>
                                        <td className="px-5 py-4 text-gray-700">{coupon.name}</td>
                                        <td className="px-5 py-4 text-gray-700">
                                            {coupon.discountType === "PERCENT"
                                                ? `${coupon.discountValue}%`
                                                : formatMoney(coupon.discountValue)}
                                            {coupon.maxDiscountAmount !== null && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Max {formatMoney(coupon.maxDiscountAmount)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">
                                            <p>Min order: {formatMoney(coupon.minOrderAmount)}</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Per user: {coupon.perUserLimit ?? "Unlimited"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">
                                            {coupon.usedCount}/{coupon.usageLimit ?? "Unlimited"}
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">
                                            <p>{formatDate(coupon.startAt)}</p>
                                            <p className="mt-1 text-xs text-gray-500">to {formatDate(coupon.endAt)}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {viewMode === "DELETED" ? (
                                                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                                                    Deleted
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => onToggleStatus(coupon.id, !coupon.active)}
                                                    disabled={busy}
                                                    className={`rounded-full px-3 py-1 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 ${
                                                        coupon.active
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {coupon.active ? "Active" : "Inactive"}
                                                </button>
                                            )}
                                            {isExpired(coupon) && (
                                                <p className="mt-2 text-xs font-semibold text-amber-600">Expired</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                {viewMode === "DELETED" ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => onRestore(coupon.id)}
                                                        disabled={busy}
                                                        className="rounded-md p-2 text-emerald-600 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        aria-label="Restore coupon"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => onEdit(coupon)}
                                                            disabled={busy}
                                                            className="rounded-md p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                            aria-label="Edit coupon"
                                                        >
                                                            <Edit className="h-4 w-4 text-gray-500" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => onDelete(coupon.id)}
                                                            disabled={busy}
                                                            className="rounded-md p-2 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                            aria-label="Delete coupon"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </button>
                                                    </>
                                                )}
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
