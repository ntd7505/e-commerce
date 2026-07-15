import type { ProductResponse } from "../adminProductTypes";

type ProductStatsProps = {
    products: ProductResponse[];
};

export function ProductStats({ products }: ProductStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="animate-fade-in-up rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-md" style={{ animationDelay: '100ms' }}>
                <p className="text-sm font-semibold text-muted">Tổng sản phẩm</p>
                <p className="mt-2 text-2xl font-extrabold text-text">{products.length}</p>
            </div>
            <div className="animate-fade-in-up rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-md" style={{ animationDelay: '150ms' }}>
                <p className="text-sm font-semibold text-muted">Đang bán</p>
                <p className="mt-2 text-2xl font-extrabold text-success">
                    {products.filter((product) => product.active).length}
                </p>
            </div>
            <div className="animate-fade-in-up rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-md" style={{ animationDelay: '200ms' }}>
                <p className="text-sm font-semibold text-muted">Ngừng bán</p>
                <p className="mt-2 text-2xl font-extrabold text-text">
                    {products.filter((product) => !product.active).length}
                </p>
            </div>
        </div>
    );
}
