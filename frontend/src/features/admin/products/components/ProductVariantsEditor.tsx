import { PlusCircle, Trash2 } from "lucide-react";
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
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-text">Variants</h3>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted shadow-sm hover:bg-surface"
                >
                    <PlusCircle className="h-4 w-4" /> Add variant
                </button>
            </div>

            <div className="space-y-4">
                {variants.map((variant, index) => (
                    <div key={variant.id ?? `new-${index}`} className="rounded-lg border border-border-strong p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <input
                                value={variant.variantName}
                                onChange={(event) => onChange(index, { variantName: event.target.value })}
                                placeholder="Variant name"
                                className="rounded-lg border border-border-strong bg-surface-alt px-3 py-2.5 text-sm font-semibold focus:border-success focus:outline-none md:col-span-2"
                            />
                            <input
                                type="number"
                                value={variant.stockQuantity}
                                onChange={(event) => onChange(index, { stockQuantity: event.target.value })}
                                placeholder="Stock"
                                className="rounded-lg border border-border-strong bg-surface-alt px-3 py-2.5 text-sm font-semibold focus:border-success focus:outline-none"
                            />
                            <input
                                type="number"
                                value={variant.price}
                                onChange={(event) => onChange(index, { price: event.target.value })}
                                placeholder="Price"
                                className="rounded-lg border border-border-strong bg-surface-alt px-3 py-2.5 text-sm font-semibold focus:border-success focus:outline-none"
                            />
                            <input
                                type="number"
                                value={variant.salePrice}
                                onChange={(event) => onChange(index, { salePrice: event.target.value })}
                                placeholder="Sale"
                                className="rounded-lg border border-border-strong bg-surface-alt px-3 py-2.5 text-sm font-semibold focus:border-success focus:outline-none"
                            />
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-text">
                                <input
                                    type="checkbox"
                                    checked={variant.active}
                                    onChange={(event) => onChange(index, { active: event.target.checked })}
                                    className="h-4 w-4 accent-emerald-500"
                                />
                                Active
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onSave(index)}
                                    disabled={savingVariantIndex === index}
                                    className="rounded-lg bg-success px-4 py-2 text-xs font-bold text-white hover:bg-success disabled:opacity-50"
                                >
                                    {savingVariantIndex === index ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(index)}
                                    className="rounded-2xl border border-border bg-surface p-2 text-muted hover:bg-danger-soft hover:text-danger"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
