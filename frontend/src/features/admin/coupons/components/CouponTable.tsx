import { useState } from "react";
import { Edit, RotateCcw, Search, Tag, Trash2 } from "lucide-react";
import { Badge, Button } from "../../../../components/common";
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
        { label: "Tất cả", value: "ALL" },
        { label: "Đang hoạt động", value: "ACTIVE" },
        { label: "Đã ẩn", value: "INACTIVE" },
        { label: "Hết hạn", value: "EXPIRED" },
    ];

    const viewOptions: Array<{ label: string; value: CouponViewMode }> = [
        { label: "Đang khả dụng", value: "ACTIVE" },
        { label: "Đã xóa", value: "DELETED" },
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
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-alt p-5">
                <div>
                    <h3 className="font-bold text-text">Danh sách mã giảm giá</h3>
                    <p className="mt-1 text-xs font-medium text-muted">
                        Hiển thị {filteredCoupons.length} / {coupons.length} mã
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-lg border border-border-strong bg-surface p-1 shadow-inner">
                        {viewOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => changeViewMode(option.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                                    viewMode === option.value
                                        ? "bg-surface-alt text-primary shadow-sm"
                                        : "text-muted hover:text-text"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {viewMode === "ACTIVE" && (
                        <div className="flex rounded-lg border border-border-strong bg-surface p-1 shadow-inner">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setStatusFilter(option.value)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                                        statusFilter === option.value
                                            ? "bg-surface-alt text-primary shadow-sm"
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
                            placeholder="Tìm kiếm mã giảm giá..."
                            className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted transition-colors hover:bg-surface-alt hover:text-text shadow-sm"
                        >
                            Xóa bộ lọc
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
                    title="Không tìm thấy mã"
                    description="Các mã giảm giá sẽ hiển thị ở đây."
                    compact
                />
            )}

            {!loading && !error && filteredCoupons.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1120px] text-left text-sm">
                        <thead className="bg-surface-alt text-xs uppercase tracking-wider text-muted">
                            <tr>
                                <th className="px-5 py-3 font-bold">Mã</th>
                                <th className="px-5 py-3 font-bold">Tên</th>
                                <th className="px-5 py-3 font-bold">Giảm giá</th>
                                <th className="px-5 py-3 font-bold">Điều kiện</th>
                                <th className="px-5 py-3 font-bold">Đã dùng</th>
                                <th className="px-5 py-3 font-bold">Hiệu lực</th>
                                <th className="px-5 py-3 font-bold">Trạng thái</th>
                                <th className="px-5 py-3 text-right font-bold">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {filteredCoupons.map((coupon) => {
                                const busy = actionCouponId === coupon.id;

                                return (
                                    <tr key={coupon.id}>
                                        <td className="px-5 py-4 font-bold text-text">{coupon.code}</td>
                                        <td className="px-5 py-4 font-semibold text-text">{coupon.name}</td>
                                        <td className="px-5 py-4 text-text">
                                            {coupon.discountType === "PERCENT"
                                                ? `${coupon.discountValue}%`
                                                : formatMoney(coupon.discountValue)}
                                            {coupon.maxDiscountAmount !== null && (
                                                <p className="mt-1 text-xs text-muted">
                                                    Tối đa {formatMoney(coupon.maxDiscountAmount)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-text">
                                            <p className="font-medium">Đơn tối thiểu: {formatMoney(coupon.minOrderAmount)}</p>
                                            <p className="mt-1 text-xs text-muted">
                                                Mỗi user: {coupon.perUserLimit ?? "Không giới hạn"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 font-medium text-text">
                                            {coupon.usedCount}/{coupon.usageLimit ?? "∞"}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-text">
                                            <p>{formatDate(coupon.startAt)}</p>
                                            <p className="mt-1 text-xs text-muted">đến {formatDate(coupon.endAt)}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {viewMode === "DELETED" ? (
                                                <Badge variant="danger">Đã xóa</Badge>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => onToggleStatus(coupon.id, !coupon.active)}
                                                    disabled={busy}
                                                    className="transition-opacity hover:opacity-80 disabled:opacity-50"
                                                >
                                                    <Badge variant={coupon.active ? "success" : "neutral"}>
                                                        {coupon.active ? "Đang hoạt động" : "Đã ẩn"}
                                                    </Badge>
                                                </button>
                                            )}
                                            {isExpired(coupon) && (
                                                <p className="mt-2 text-xs font-bold text-danger">Hết hạn</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                {viewMode === "DELETED" ? (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => onRestore(coupon.id)}
                                                        disabled={busy}
                                                        loading={busy}
                                                    >
                                                        <RotateCcw className="h-3.5 w-3.5" />
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => onEdit(coupon)}
                                                            disabled={busy}
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>

                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => onDelete(coupon.id)}
                                                            disabled={busy}
                                                            loading={busy}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
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
