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
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-text">Classification</h3>
            <div className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-bold text-text">Category</label>
                    <div className="relative">
                        <select
                            name="categoryId"
                            value={formValues.categoryId}
                            onChange={onChange}
                            disabled={categoriesLoading}
                            className="w-full appearance-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text shadow-sm focus:border-success focus:outline-none disabled:opacity-60"
                        >
                            <option value="">{categoriesLoading ? "Loading categories..." : "Select Category"}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.parent ? `${category.parent.name} / ${category.name}` : category.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text" />
                    </div>
                    {categoriesError && <p className="mt-2 text-xs font-semibold text-danger">{categoriesError}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-text">Brand</label>
                    <div className="relative">
                        <select
                            name="brandId"
                            value={formValues.brandId}
                            onChange={onChange}
                            disabled={brandsLoading}
                            className="w-full appearance-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text shadow-sm focus:border-success focus:outline-none disabled:opacity-60"
                        >
                            <option value="">{brandsLoading ? "Loading brands..." : "Select Brand"}</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text" />
                    </div>
                    {brandsError && <p className="mt-2 text-xs font-semibold text-danger">{brandsError}</p>}
                </div>
            </div>
        </section>
    );
}
