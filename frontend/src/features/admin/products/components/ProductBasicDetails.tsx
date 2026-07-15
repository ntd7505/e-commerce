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
        <section className="rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-border bg-surface-alt px-6 py-4 rounded-t-xl">
                <h3 className="text-sm font-bold text-text">Thông tin cơ bản</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {isEditMode && (
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-bold text-text transition-colors hover:bg-surface-alt md:col-span-2">
                        <input
                            type="checkbox"
                            checked={productActive}
                            onChange={(event) => onActiveChange(event.target.checked)}
                            className="h-4 w-4 rounded border-border-strong text-primary focus:ring-primary/20"
                        />
                        Sản phẩm đang bán
                    </label>
                )}

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-text">
                        Tên sản phẩm <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        maxLength={200}
                        value={formValues.name}
                        onChange={onChange}
                        placeholder="VD: iPhone 15 Pro Max"
                        className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-medium text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-text">Mô tả ngắn</label>
                    <textarea
                        name="shortDescription"
                        maxLength={255}
                        value={formValues.shortDescription}
                        onChange={onChange}
                        placeholder="Tóm tắt ngắn gọn về sản phẩm..."
                        className="min-h-[80px] w-full resize-none rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm font-medium text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-text">Mô tả chi tiết</label>
                    <textarea
                        name="description"
                        value={formValues.description}
                        onChange={onChange}
                        placeholder="Mô tả đầy đủ chi tiết sản phẩm..."
                        className="min-h-[140px] w-full resize-none rounded-lg border border-border-strong bg-surface px-4 py-4 text-sm font-medium text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>
        </section>
    );
}
