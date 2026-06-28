import type { ProductResponse } from "../adminProductTypes";

type ProductStatsProps = {
    products: ProductResponse[];
};

export function ProductStats({ products }: ProductStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <p className="text-sm font-semibold text-muted">Total Products</p>
                <p className="mt-2 text-2xl font-extrabold text-text">{products.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <p className="text-sm font-semibold text-muted">Active</p>
                <p className="mt-2 text-2xl font-extrabold text-success">
                    {products.filter((product) => product.active).length}
                </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <p className="text-sm font-semibold text-muted">Inactive</p>
                <p className="mt-2 text-2xl font-extrabold text-text">
                    {products.filter((product) => !product.active).length}
                </p>
            </div>
        </div>
    );
}
