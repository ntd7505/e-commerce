import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "../../../../components/common";
import type { VariantDraft } from "../adminProductFormTypes";

type ProductVariantsEditorProps = {
    variants: VariantDraft[];
    savingVariantIndex: number | null;
    onAdd: () => void;
    onSave: (index: number) => void;
    onDelete: (index: number) => void;
    onChange: (index: number, patch: Partial<VariantDraft>) => void;
};

export function ProductVariantsEditor({
    variants,
    savingVariantIndex,
    onAdd,
    onSave,
    onDelete,
    onChange,
}: ProductVariantsEditorProps) {
    return (
        <section className="rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between border-b border-border bg-surface-alt px-6 py-4 rounded-t-xl">
                <h3 className="text-sm font-bold text-text">Các phiên bản (Variants)</h3>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onAdd}
                    leftIcon={<PlusCircle className="h-4 w-4" />}
                >
                    Thêm phiên bản
                </Button>
            </div>

            <div className="space-y-4 p-6">
                {variants.map((variant, index) => (
                    <div key={variant.id ?? `new-${index}`} className="rounded-xl border border-border-strong bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <input
                                value={variant.variantName}
                                onChange={(event) => onChange(index, { variantName: event.target.value })}
                                placeholder="Tên phiên bản"
                                className="rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 md:col-span-2"
                            />
                            <input
                                type="number"
                                value={variant.stockQuantity}
                                onChange={(event) => onChange(index, { stockQuantity: event.target.value })}
                                placeholder="Tồn kho"
                                className="rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <input
                                type="number"
                                value={variant.price}
                                onChange={(event) => onChange(index, { price: event.target.value })}
                                placeholder="Giá gốc"
                                className="rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <input
                                type="number"
                                value={variant.salePrice}
                                onChange={(event) => onChange(index, { salePrice: event.target.value })}
                                placeholder="Khuyến mãi"
                                className="rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-text transition-colors hover:text-primary">
                                <input
                                    type="checkbox"
                                    checked={variant.active}
                                    onChange={(event) => onChange(index, { active: event.target.checked })}
                                    className="h-4 w-4 rounded border-border-strong text-primary focus:ring-primary/20"
                                />
                                Đang bán
                            </label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => onSave(index)}
                                    disabled={savingVariantIndex === index}
                                    loading={savingVariantIndex === index}
                                >
                                    Lưu
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDelete(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
