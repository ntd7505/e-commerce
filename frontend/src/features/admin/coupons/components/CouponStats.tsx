import { AdminStatCard } from "../../../../components/admin/AdminStatCard";
import type { CouponResponse } from "../adminCouponTypes";

type CouponStatsProps = {
    coupons: CouponResponse[];
};

export function CouponStats({ coupons }: CouponStatsProps) {
    const total = coupons.length;
    const active = coupons.filter((coupon) => coupon.active).length;
    const inactive = total - active;

    const expired = coupons.filter((coupon) => {
        if (!coupon.endAt) return false;
        return new Date(coupon.endAt) < new Date();
    }).length;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                <AdminStatCard label="Tổng cộng" value={total} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <AdminStatCard label="Đang hoạt động" value={active} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <AdminStatCard label="Đã ẩn" value={inactive} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <AdminStatCard label="Đã hết hạn" value={expired} />
            </div>
        </div>
    );
}
