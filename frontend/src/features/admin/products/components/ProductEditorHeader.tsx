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
                <h2 className="text-2xl font-bold text-text">
                    {isEditMode ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm font-medium text-muted">
                    {isEditMode
                        ? "Update product details, variants, inventory, and media."
                        : "Create a product with one initial variant and product images."}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    to="/admin/products"
                    className="rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-text shadow-sm hover:bg-surface"
                >
                    Back
                </Link>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={loading || loadingProduct}
                    className="flex items-center gap-2 rounded-lg bg-success px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-success disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : isEditMode ? "Update Product" : "Publish Product"}
                </button>
            </div>
        </div>
    );
}
