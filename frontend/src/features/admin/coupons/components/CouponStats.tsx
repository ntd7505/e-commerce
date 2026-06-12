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
        <div className="grid grid-cols-4 gap-4">
            <AdminStatCard label="Total Coupons" value={total} />
            <AdminStatCard label="Active" value={active} />
            <AdminStatCard label="Inactive" value={inactive} />
            <AdminStatCard label="Expired" value={expired} />
        </div>

    );
}
