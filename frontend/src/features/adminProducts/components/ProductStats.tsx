import type { ProductResponse } from "../adminProductTypes";

type ProductStatsProps = {
    products: ProductResponse[];
};

export function ProductStats({ products }: ProductStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-[12px] font-bold uppercase text-gray-500">Total Products</p>
                <p className="mt-2 text-2xl font-extrabold text-gray-900">{products.length}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-[12px] font-bold uppercase text-gray-500">Active</p>
                <p className="mt-2 text-2xl font-extrabold text-emerald-700">
                    {products.filter((product) => product.active).length}
                </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-[12px] font-bold uppercase text-gray-500">Inactive</p>
                <p className="mt-2 text-2xl font-extrabold text-gray-900">
                    {products.filter((product) => !product.active).length}
                </p>
            </div>
        </div>
    );
}
