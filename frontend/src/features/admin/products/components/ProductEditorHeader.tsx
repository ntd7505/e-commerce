import { Link } from "react-router-dom";
import { Save } from "lucide-react";

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
                <h2 className="text-[22px] font-bold text-[#0B2113]">
                    {isEditMode ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm font-medium text-gray-500">
                    {isEditMode
                        ? "Update product details, variants, inventory, and media."
                        : "Create a product with one initial variant and product images."}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    to="/admin/products"
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                    Back
                </Link>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={loading || loadingProduct}
                    className="flex items-center gap-2 rounded-lg bg-[#3c9c64] px-5 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : isEditMode ? "Update Product" : "Publish Product"}
                </button>
            </div>
        </div>
    );
}
