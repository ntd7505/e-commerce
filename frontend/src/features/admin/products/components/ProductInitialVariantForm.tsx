import type { ChangeEvent } from "react";
import type { ProductCreateFormValues } from "../adminProductFormTypes";

type ProductInitialVariantFormProps = {
    formValues: ProductCreateFormValues;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

export function ProductInitialVariantForm({ formValues, onChange }: ProductInitialVariantFormProps) {
    return (
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-text">Initial Variant</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-bold text-text">Variant Name</label>
                    <input
                        type="text"
                        name="variantName"
                        value={formValues.variantName}
                        onChange={onChange}
                        className="w-full rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-bold text-text focus:border-success focus:outline-none"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-text">Stock Quantity</label>
                    <input
                        type="number"
                        name="stockQuantity"
                        value={formValues.stockQuantity}
                        onChange={onChange}
                        className="w-full rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-bold text-text focus:border-success focus:outline-none"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-text">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formValues.price}
                        onChange={onChange}
                        className="w-full rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-bold text-text focus:border-success focus:outline-none"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-text">Sale Price</label>
                    <input
                        type="number"
                        name="salePrice"
                        value={formValues.salePrice}
                        onChange={onChange}
                        className="w-full rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-bold text-text focus:border-success focus:outline-none"
                    />
                </div>
            </div>
        </section>
    );
}
