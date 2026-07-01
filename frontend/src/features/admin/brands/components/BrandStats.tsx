import type { BrandResponse } from "../adminBrandTypes";

type BrandStatsProps = {
    brands: BrandResponse[];
};

export function BrandStats({ brands }: BrandStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <p className="text-sm font-semibold text-muted">Total</p>
                <p className="mt-2 text-2xl font-extrabold text-text">{brands.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <p className="text-sm font-semibold text-muted">Active</p>
                <p className="mt-2 text-2xl font-extrabold text-success">
                    {brands.filter((brand) => brand.active).length}
                </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <p className="text-sm font-semibold text-muted">Inactive</p>
                <p className="mt-2 text-2xl font-extrabold text-text">
                    {brands.filter((brand) => !brand.active).length}
                </p>
            </div>
        </div>
    );
}
