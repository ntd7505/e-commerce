import { Link } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/common";

type ProductEditorHeaderProps = {
    isEditMode: boolean;
    loading: boolean;
    loadingProduct: boolean;
    onSave: () => void;
};

export function ProductEditorHeader({
    isEditMode,
    loading,
    loadingProduct,
    onSave,
}: ProductEditorHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h2 className="text-2xl font-bold text-text">
                    {isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <p className="mt-1 text-sm font-medium text-muted">
                    {isEditMode
                        ? "Cập nhật thông tin, phiên bản, tồn kho và hình ảnh."
                        : "Tạo sản phẩm mới với phiên bản gốc và hình ảnh."}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    to="/admin/products"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-text transition-all hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                </Link>
                <Button
                    variant="primary"
                    onClick={onSave}
                    disabled={loading || loadingProduct}
                    loading={loading}
                    leftIcon={<Save className="h-4 w-4" />}
                >
                    {isEditMode ? "Cập nhật" : "Xuất bản"}
                </Button>
            </div>
        </div>
    );
}
