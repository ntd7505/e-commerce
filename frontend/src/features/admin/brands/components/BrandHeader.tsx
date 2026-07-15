import { PlusCircle, RefreshCw } from "lucide-react";
import { Button } from "../../../../components/common";

type BrandHeaderProps = {
    loading: boolean;
    onRefresh: () => void;
    onAdd: () => void;
};

export function BrandHeader({ loading, onRefresh, onAdd }: BrandHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-text">Thương hiệu</h1>
                <p className="mt-1 text-sm font-medium text-muted">
                    Quản lý thương hiệu sản phẩm.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="secondary"
                    onClick={onRefresh}
                    disabled={loading}
                    leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
                >
                    Tải lại
                </Button>
                <Button
                    variant="primary"
                    onClick={onAdd}
                    leftIcon={<PlusCircle className="h-4 w-4" />}
                >
                    Thêm thương hiệu
                </Button>
            </div>
        </div>
    );
}
