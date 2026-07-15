import type { BrandResponse } from "../adminBrandTypes";
import { AdminStatCard } from "../../../../components/admin/AdminStatCard";

type BrandStatsProps = {
    brands: BrandResponse[];
};

export function BrandStats({ brands }: BrandStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                <AdminStatCard label="Tổng cộng" value={brands.length} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <AdminStatCard label="Đang hiển thị" value={brands.filter((brand) => brand.active).length} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <AdminStatCard label="Đã ẩn" value={brands.filter((brand) => !brand.active).length} />
            </div>
        </div>
    );
}
