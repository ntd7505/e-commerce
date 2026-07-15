import { Link } from "react-router-dom";
import { PlusCircle, RefreshCw } from "lucide-react";
import { Button } from "../../../../components/common";

type ProductListHeaderProps = {
    loading: boolean;
    onRefresh: () => void;
};

export function ProductListHeader({ loading, onRefresh }: ProductListHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-wrap-balance text-2xl font-bold text-text">Sản phẩm</h1>
                <p className="mt-1 text-sm font-medium text-muted">
                    Quản lý danh sách, giá bán, tồn kho và hình ảnh.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="secondary"
                    onClick={onRefresh}
                    disabled={loading}
                    leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
                >
                    Làm mới
                </Button>
                <Link
                    to="/admin/products/add"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:pointer-events-none disabled:opacity-50"
                >
                    <PlusCircle className="h-4 w-4" /> Thêm sản phẩm
                </Link>
            </div>
        </div>
    );
}
