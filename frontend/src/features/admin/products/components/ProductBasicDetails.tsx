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
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-text">Basic Details</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {isEditMode && (
                    <label className="flex items-center gap-3 rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-bold text-text md:col-span-2">
                        <input
                            type="checkbox"
                            checked={productActive}
                            onChange={(event) => onActiveChange(event.target.checked)}
                            className="h-4 w-4 rounded border-border-strong accent-emerald-500"
                        />
                        Active product
                    </label>
                )}

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-text">
                        Product Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        maxLength={200}
                        value={formValues.name}
                        onChange={onChange}
                        placeholder="e.g. iPhone 15"
                        className="w-full rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-medium text-text focus:border-success focus:outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-text">Short Description</label>
                    <textarea
                        name="shortDescription"
                        maxLength={255}
                        value={formValues.shortDescription}
                        onChange={onChange}
                        placeholder="Brief summary of your product..."
                        className="min-h-[80px] w-full resize-none rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-medium text-text focus:border-success focus:outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-text">Product Description</label>
                    <textarea
                        name="description"
                        value={formValues.description}
                        onChange={onChange}
                        placeholder="Describe your product..."
                        className="min-h-[140px] w-full resize-none rounded-lg border border-border-strong bg-surface-alt px-4 py-4 text-sm font-medium text-text focus:border-success focus:outline-none"
                    />
                </div>
            </div>
        </section>
    );
}
