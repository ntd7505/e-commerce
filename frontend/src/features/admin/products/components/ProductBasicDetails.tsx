import type { ChangeEvent } from "react";
import type { ProductCreateFormValues } from "../adminProductFormTypes";

type ProductBasicDetailsProps = {
    isEditMode: boolean;
    formValues: ProductCreateFormValues;
    productActive: boolean;
    onActiveChange: (active: boolean) => void;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

export function ProductBasicDetails({
    isEditMode,
    formValues,
    productActive,
    onActiveChange,
    onChange,
}: ProductBasicDetailsProps) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-gray-900">Basic Details</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {isEditMode && (
                    <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-bold text-gray-700 md:col-span-2">
                        <input
                            type="checkbox"
                            checked={productActive}
                            onChange={(event) => onActiveChange(event.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 accent-emerald-500"
                        />
                        Active product
                    </label>
                )}

                <div className="md:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        maxLength={200}
                        value={formValues.name}
                        onChange={onChange}
                        placeholder="e.g. iPhone 15"
                        className="w-full rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-medium text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">Short Description</label>
                    <textarea
                        name="shortDescription"
                        maxLength={255}
                        value={formValues.shortDescription}
                        onChange={onChange}
                        placeholder="Brief summary of your product..."
                        className="min-h-[80px] w-full resize-none rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-medium text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">Product Description</label>
                    <textarea
                        name="description"
                        value={formValues.description}
                        onChange={onChange}
                        placeholder="Describe your product..."
                        className="min-h-[140px] w-full resize-none rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-4 text-[13px] font-medium text-gray-700 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
            </div>
        </section>
    );
}
