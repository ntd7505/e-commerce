import { useEffect, useState } from "react";
import type { CouponRequest, CouponResponse, DiscountType } from "../adminCouponTypes";

type CouponModalProps = {
    open: boolean;
    saving: boolean;
    editingCoupon: CouponResponse | null;
    onClose: () => void;
    onSubmit: (payload: CouponRequest) => void;
};

type CouponFormErrors = Partial<Record<keyof CouponRequest, string>>;

const emptyForm: CouponRequest = {
    code: "",
    name: "",
    description: "",
    discountType: "PERCENT",
    discountValue: 10,
};

function validateCouponForm(values: CouponRequest): CouponFormErrors {
    const errors: CouponFormErrors = {};

    if (!values.code.trim()) {
        errors.code = "Code is required.";
    }

    if (!values.name.trim()) {
        errors.name = "Name is required.";
    }

    if (!Number.isFinite(values.discountValue) || values.discountValue <= 0) {
        errors.discountValue = "Discount value must be greater than 0.";
    }

    if (values.discountType === "PERCENT" && values.discountValue > 100) {
        errors.discountValue = "Percent discount cannot exceed 100.";
    }

    if (values.minOrderAmount !== undefined && values.minOrderAmount < 0) {
        errors.minOrderAmount = "Min order amount cannot be negative.";
    }

    if (values.maxDiscountAmount !== undefined && values.maxDiscountAmount < 0) {
        errors.maxDiscountAmount = "Max discount amount cannot be negative.";
    }

    if (values.usageLimit !== undefined && values.usageLimit < 1) {
        errors.usageLimit = "Usage limit must be at least 1.";
    }

    if (values.perUserLimit !== undefined && values.perUserLimit < 1) {
        errors.perUserLimit = "Per user limit must be at least 1.";
    }

    if (values.startAt && values.endAt) {
        const startDate = new Date(values.startAt);
        const endDate = new Date(values.endAt);

        if (endDate <= startDate) {
            errors.endAt = "End date must be after start date.";
        }
    }

    return errors;
}

export function CouponModal({
    open,
    saving,
    editingCoupon,
    onClose,
    onSubmit,
}: CouponModalProps) {
    const [formValues, setFormValues] = useState<CouponRequest>(emptyForm);
    const [formErrors, setFormErrors] = useState<CouponFormErrors>({});

    useEffect(() => {
        if (!open) return;

        setFormErrors({});

        if (editingCoupon) {
            setFormValues({
                code: editingCoupon.code,
                name: editingCoupon.name,
                description: editingCoupon.description ?? "",
                discountType: editingCoupon.discountType,
                discountValue: editingCoupon.discountValue,
                minOrderAmount: editingCoupon.minOrderAmount ?? undefined,
                maxDiscountAmount: editingCoupon.maxDiscountAmount ?? undefined,
                usageLimit: editingCoupon.usageLimit ?? undefined,
                perUserLimit: editingCoupon.perUserLimit ?? undefined,
                startAt: editingCoupon.startAt ?? undefined,
                endAt: editingCoupon.endAt ?? undefined,
            });
        } else {
            setFormValues(emptyForm);
        }
    }, [open, editingCoupon]);

    if (!open) return null;

    function updateField<K extends keyof CouponRequest>(
        key: K,
        value: CouponRequest[K]
    ) {
        setFormValues((current) => ({
            ...current,
            [key]: value,
        }));

        setFormErrors((current) => ({
            ...current,
            [key]: undefined,
        }));
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const errors = validateCouponForm(formValues);
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        onSubmit(formValues);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl"
            >
                <h3 className="text-lg font-bold text-gray-900">
                    {editingCoupon ? "Edit Coupon" : "Add Coupon"}
                </h3>

                <div className="mt-5 grid gap-4">
                    <div>
                        <input
                            value={formValues.code}
                            onChange={(event) => updateField("code", event.target.value)}
                            placeholder="Code"
                            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                        />
                        {formErrors.code && (
                            <p className="mt-1 text-xs font-medium text-red-600">{formErrors.code}</p>
                        )}
                    </div>

                    <div>
                        <input
                            value={formValues.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Name"
                            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                        />
                        {formErrors.name && (
                            <p className="mt-1 text-xs font-medium text-red-600">{formErrors.name}</p>
                        )}
                    </div>

                    <select
                        value={formValues.discountType}
                        onChange={(event) =>
                            updateField("discountType", event.target.value as DiscountType)
                        }
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                    >
                        <option value="PERCENT">Percent</option>
                        <option value="FIXED_AMOUNT">Fixed amount</option>
                    </select>

                    <div>
                        <input
                            type="number"
                            value={formValues.discountValue}
                            onChange={(event) =>
                                updateField("discountValue", Number(event.target.value))
                            }
                            placeholder="Discount value"
                            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                        />
                        {formErrors.discountValue && (
                            <p className="mt-1 text-xs font-medium text-red-600">
                                {formErrors.discountValue}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="number"
                                value={formValues.minOrderAmount ?? ""}
                                onChange={(event) =>
                                    updateField(
                                        "minOrderAmount",
                                        event.target.value ? Number(event.target.value) : undefined
                                    )
                                }
                                placeholder="Min order amount"
                                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                            />
                            {formErrors.minOrderAmount && (
                                <p className="mt-1 text-xs font-medium text-red-600">
                                    {formErrors.minOrderAmount}
                                </p>
                            )}
                        </div>

                        <div>
                            <input
                                type="number"
                                value={formValues.maxDiscountAmount ?? ""}
                                onChange={(event) =>
                                    updateField(
                                        "maxDiscountAmount",
                                        event.target.value ? Number(event.target.value) : undefined
                                    )
                                }
                                placeholder="Max discount amount"
                                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                            />
                            {formErrors.maxDiscountAmount && (
                                <p className="mt-1 text-xs font-medium text-red-600">
                                    {formErrors.maxDiscountAmount}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="number"
                                value={formValues.usageLimit ?? ""}
                                onChange={(event) =>
                                    updateField(
                                        "usageLimit",
                                        event.target.value ? Number(event.target.value) : undefined
                                    )
                                }
                                placeholder="Usage limit"
                                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                            />
                            {formErrors.usageLimit && (
                                <p className="mt-1 text-xs font-medium text-red-600">
                                    {formErrors.usageLimit}
                                </p>
                            )}
                        </div>

                        <div>
                            <input
                                type="number"
                                value={formValues.perUserLimit ?? ""}
                                onChange={(event) =>
                                    updateField(
                                        "perUserLimit",
                                        event.target.value ? Number(event.target.value) : undefined
                                    )
                                }
                                placeholder="Per user limit"
                                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                            />
                            {formErrors.perUserLimit && (
                                <p className="mt-1 text-xs font-medium text-red-600">
                                    {formErrors.perUserLimit}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="datetime-local"
                            value={formValues.startAt ?? ""}
                            onChange={(event) =>
                                updateField("startAt", event.target.value || undefined)
                            }
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                        />

                        <div>
                            <input
                                type="datetime-local"
                                value={formValues.endAt ?? ""}
                                onChange={(event) =>
                                    updateField("endAt", event.target.value || undefined)
                                }
                                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                            />
                            {formErrors.endAt && (
                                <p className="mt-1 text-xs font-medium text-red-600">
                                    {formErrors.endAt}
                                </p>
                            )}
                        </div>
                    </div>

                    <textarea
                        value={formValues.description ?? ""}
                        onChange={(event) => updateField("description", event.target.value)}
                        placeholder="Description"
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}