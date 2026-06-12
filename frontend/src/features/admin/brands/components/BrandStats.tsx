import type { BrandResponse } from "../adminBrandTypes";

type BrandStatsProps = {
    brands: BrandResponse[];
};

export function BrandStats({ brands }: BrandStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-[12px] font-bold uppercase text-gray-500">Total</p>
                <p className="mt-2 text-2xl font-extrabold text-gray-900">{brands.length}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-[12px] font-bold uppercase text-gray-500">Active</p>
                <p className="mt-2 text-2xl font-extrabold text-emerald-700">
                    {brands.filter((brand) => brand.active).length}
                </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-[12px] font-bold uppercase text-gray-500">Inactive</p>
                <p className="mt-2 text-2xl font-extrabold text-gray-900">
                    {brands.filter((brand) => !brand.active).length}
                </p>
            </div>
        </div>
    );
}
