import type { ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";
import type { ProductCreateFormValues } from "../adminProductFormTypes";
import type { BrandResponse } from "../../brands/adminBrandTypes";
import type { CategoryResponse } from "../../categories/adminCategoryTypes";

type ProductClassificationPanelProps = {
    formValues: ProductCreateFormValues;
    brands: BrandResponse[];
    brandsLoading: boolean;
    brandsError: string;
    categories: CategoryResponse[];
    categoriesLoading: boolean;
    categoriesError: string;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

export function ProductClassificationPanel({
    formValues,
    brands,
    brandsLoading,
    brandsError,
    categories,
    categoriesLoading,
    categoriesError,
    onChange,
}: ProductClassificationPanelProps) {
    return (
        <section className="rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-border bg-surface-alt px-6 py-4 rounded-t-xl">
                <h3 className="text-sm font-bold text-text">Phân loại sản phẩm</h3>
            </div>
            <div className="space-y-5 p-6">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-text">Danh mục</label>
                    <div className="relative">
                        <select
                            name="categoryId"
                            value={formValues.categoryId}
                            onChange={onChange}
                            disabled={categoriesLoading}
                            className="w-full appearance-none rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                        >
                            <option value="">{categoriesLoading ? "Đang tải danh mục..." : "Chọn danh mục"}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.parent ? `${category.parent.name} / ${category.name}` : category.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    </div>
                    {categoriesError && <p className="mt-2 text-xs font-semibold text-danger">{categoriesError}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-text">Thương hiệu</label>
                    <div className="relative">
                        <select
                            name="brandId"
                            value={formValues.brandId}
                            onChange={onChange}
                            disabled={brandsLoading}
                            className="w-full appearance-none rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                        >
                            <option value="">{brandsLoading ? "Đang tải thương hiệu..." : "Chọn thương hiệu"}</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    </div>
                    {brandsError && <p className="mt-2 text-xs font-semibold text-danger">{brandsError}</p>}
                </div>
            </div>
        </section>
    );
}
