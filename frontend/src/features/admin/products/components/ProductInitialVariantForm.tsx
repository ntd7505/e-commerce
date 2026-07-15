import type { ChangeEvent } from "react";
import type { ProductCreateFormValues } from "../adminProductFormTypes";

type ProductInitialVariantFormProps = {
    formValues: ProductCreateFormValues;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

export function ProductInitialVariantForm({ formValues, onChange }: ProductInitialVariantFormProps) {
    return (
        <section className="rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-border bg-surface-alt px-6 py-4 rounded-t-xl">
                <h3 className="text-sm font-bold text-text">Phiên bản ban đầu</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-text">Tên phiên bản</label>
                    <input
                        type="text"
                        name="variantName"
                        value={formValues.variantName}
                        onChange={onChange}
                        className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-bold text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-text">Số lượng tồn kho</label>
                    <input
                        type="number"
                        name="stockQuantity"
                        value={formValues.stockQuantity}
                        onChange={onChange}
                        className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-bold text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-text">Giá gốc</label>
                    <input
                        type="number"
                        name="price"
                        value={formValues.price}
                        onChange={onChange}
                        className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-bold text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-text">Giá khuyến mãi</label>
                    <input
                        type="number"
                        name="salePrice"
                        value={formValues.salePrice}
                        onChange={onChange}
                        className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-bold text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>
        </section>
    );
}
