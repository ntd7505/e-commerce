import type { ChangeEvent } from "react";
import type { ProductCreateFormValues } from "../adminProductFormTypes";

type ProductInitialVariantFormProps = {
    formValues: ProductCreateFormValues;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

export function ProductInitialVariantForm({ formValues, onChange }: ProductInitialVariantFormProps) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-gray-900">Initial Variant</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">Variant Name</label>
                    <input
                        type="text"
                        name="variantName"
                        value={formValues.variantName}
                        onChange={onChange}
                        className="w-full rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">Stock Quantity</label>
                    <input
                        type="number"
                        name="stockQuantity"
                        value={formValues.stockQuantity}
                        onChange={onChange}
                        className="w-full rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formValues.price}
                        onChange={onChange}
                        className="w-full rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">Sale Price</label>
                    <input
                        type="number"
                        name="salePrice"
                        value={formValues.salePrice}
                        onChange={onChange}
                        className="w-full rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
            </div>
        </section>
    );
}
