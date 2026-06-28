import { useState } from "react";
import { Edit, RotateCcw, Search, Tag, Trash2 } from "lucide-react";
import { AdminBadge } from "../../../../components/admin/AdminBadge";
import { AdminEmptyState } from "../../../../components/admin/AdminEmptyState";
import { AdminSkeletonTable } from "../../../../components/admin/AdminSkeletonTable";
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
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
                <div>
                    <h3 className="font-bold text-text">Coupon List</h3>
                    <p className="mt-1 text-xs font-medium text-muted">
                        Showing {filteredCoupons.length} of {coupons.length} coupons
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-lg border border-border-strong bg-surface p-1">
                        {viewOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => changeViewMode(option.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                                    viewMode === option.value
                                        ? "bg-surface text-success shadow-sm"
                                        : "text-muted hover:text-text"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {viewMode === "ACTIVE" && (
                        <div className="flex rounded-lg border border-border-strong bg-surface p-1">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setStatusFilter(option.value)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                                        statusFilter === option.value
                                            ? "bg-surface text-success shadow-sm"
                                            : "text-muted hover:text-text"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search coupons"
                            className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-success"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-2xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted transition-colors hover:bg-surface"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {loading && <AdminSkeletonTable columns={8} rows={4} />}

            {!loading && error && (
                <div className="p-6 text-sm font-semibold text-danger">{error}</div>
            )}

            {!loading && !error && filteredCoupons.length === 0 && (
                <AdminEmptyState
                    icon={Tag}
                    title="No coupons found"
                    description="Coupons will appear here once created."
                    compact
                />
            )}

            {!loading && !error && filteredCoupons.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1120px] text-left text-sm">
                        <thead className="bg-surface text-xs uppercase text-muted">
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

                        <tbody className="divide-y divide-border">
                            {filteredCoupons.map((coupon) => {
                                const busy = actionCouponId === coupon.id;

                                return (
                                    <tr key={coupon.id}>
                                        <td className="px-5 py-4 font-bold text-text">{coupon.code}</td>
                                        <td className="px-5 py-4 text-text">{coupon.name}</td>
                                        <td className="px-5 py-4 text-text">
                                            {coupon.discountType === "PERCENT"
                                                ? `${coupon.discountValue}%`
                                                : formatMoney(coupon.discountValue)}
                                            {coupon.maxDiscountAmount !== null && (
                                                <p className="mt-1 text-xs text-muted">
                                                    Max {formatMoney(coupon.maxDiscountAmount)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-text">
                                            <p>Min order: {formatMoney(coupon.minOrderAmount)}</p>
                                            <p className="mt-1 text-xs text-muted">
                                                Per user: {coupon.perUserLimit ?? "Unlimited"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-text">
                                            {coupon.usedCount}/{coupon.usageLimit ?? "Unlimited"}
                                        </td>
                                        <td className="px-5 py-4 text-text">
                                            <p>{formatDate(coupon.startAt)}</p>
                                            <p className="mt-1 text-xs text-muted">to {formatDate(coupon.endAt)}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {viewMode === "DELETED" ? (
                                                <AdminBadge variant="danger">Deleted</AdminBadge>
                                            ) : (
                                                <AdminBadge
                                                    variant={coupon.active ? "success" : "neutral"}
                                                    onClick={() => onToggleStatus(coupon.id, !coupon.active)}
                                                    disabled={busy}
                                                >
                                                    {coupon.active ? "Active" : "Inactive"}
                                                </AdminBadge>
                                            )}
                                            {isExpired(coupon) && (
                                                <p className="mt-2 text-xs font-semibold text-warning">Expired</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                {viewMode === "DELETED" ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => onRestore(coupon.id)}
                                                        disabled={busy}
                                                        className="rounded-md p-2 text-success transition-colors hover:bg-success-soft disabled:cursor-not-allowed disabled:opacity-60"
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
                                                            className="rounded-md p-2 transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
                                                            aria-label="Edit coupon"
                                                        >
                                                            <Edit className="h-4 w-4 text-muted" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => onDelete(coupon.id)}
                                                            disabled={busy}
                                                            className="rounded-md p-2 transition-colors hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-60"
                                                            aria-label="Delete coupon"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-danger" />
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
