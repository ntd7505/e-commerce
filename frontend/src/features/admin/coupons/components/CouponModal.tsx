import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../../components/common";
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
        errors.code = "Vui lòng nhập mã giảm giá.";
    }

    if (!values.name.trim()) {
        errors.name = "Vui lòng nhập tên chương trình.";
    }

    if (!Number.isFinite(values.discountValue) || values.discountValue <= 0) {
        errors.discountValue = "Giá trị giảm phải lớn hơn 0.";
    }

    if (values.discountType === "PERCENT" && values.discountValue > 100) {
        errors.discountValue = "Phần trăm giảm không được vượt quá 100%.";
    }

    if (values.minOrderAmount !== undefined && values.minOrderAmount < 0) {
        errors.minOrderAmount = "Đơn hàng tối thiểu không được âm.";
    }

    if (values.maxDiscountAmount !== undefined && values.maxDiscountAmount < 0) {
        errors.maxDiscountAmount = "Số tiền giảm tối đa không được âm.";
    }

    if (values.usageLimit !== undefined && values.usageLimit < 1) {
        errors.usageLimit = "Tổng giới hạn phải lớn hơn hoặc bằng 1.";
    }

    if (values.perUserLimit !== undefined && values.perUserLimit < 1) {
        errors.perUserLimit = "Giới hạn mỗi user phải lớn hơn hoặc bằng 1.";
    }

    if (values.startAt && values.endAt) {
        const startDate = new Date(values.startAt);
        const endDate = new Date(values.endAt);

        if (endDate <= startDate) {
            errors.endAt = "Ngày kết thúc phải sau ngày bắt đầu.";
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl overflow-hidden rounded-xl bg-surface shadow-xl animate-fade-in-up"
            >
                <div className="flex items-center justify-between border-b border-border bg-surface-alt px-6 py-4">
                    <h3 className="text-base font-bold text-text">
                        {editingCoupon ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 px-6 py-5 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Mã giảm giá <span className="text-danger">*</span></label>
                            <input
                                value={formValues.code}
                                onChange={(event) => updateField("code", event.target.value)}
                                placeholder="VD: SUMMER2023"
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {formErrors.code && (
                                <p className="mt-1 text-xs font-medium text-danger">{formErrors.code}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Tên chương trình <span className="text-danger">*</span></label>
                            <input
                                value={formValues.name}
                                onChange={(event) => updateField("name", event.target.value)}
                                placeholder="VD: Khuyến mãi Mùa hè"
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {formErrors.name && (
                                <p className="mt-1 text-xs font-medium text-danger">{formErrors.name}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Loại giảm giá</label>
                            <select
                                value={formValues.discountType}
                                onChange={(event) =>
                                    updateField("discountType", event.target.value as DiscountType)
                                }
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="PERCENT">Phần trăm (%)</option>
                                <option value="FIXED_AMOUNT">Số tiền cố định</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Giá trị giảm <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                value={formValues.discountValue}
                                onChange={(event) =>
                                    updateField("discountValue", Number(event.target.value))
                                }
                                placeholder="VD: 10"
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {formErrors.discountValue && (
                                <p className="mt-1 text-xs font-medium text-danger">
                                    {formErrors.discountValue}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Đơn hàng tối thiểu (₫)</label>
                            <input
                                type="number"
                                value={formValues.minOrderAmount ?? ""}
                                onChange={(event) =>
                                    updateField(
                                        "minOrderAmount",
                                        event.target.value ? Number(event.target.value) : undefined
                                    )
                                }
                                placeholder="Không yêu cầu"
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {formErrors.minOrderAmount && (
                                <p className="mt-1 text-xs font-medium text-danger">
                                    {formErrors.minOrderAmount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Giảm tối đa (₫)</label>
                            <input
                                type="number"
                                value={formValues.maxDiscountAmount ?? ""}
                                onChange={(event) =>
                                    updateField(
                                        "maxDiscountAmount",
                                        event.target.value ? Number(event.target.value) : undefined
                                    )
                                }
                                placeholder="Không giới hạn"
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {formErrors.maxDiscountAmount && (
                                <p className="mt-1 text-xs font-medium text-danger">
                                    {formErrors.maxDiscountAmount}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Giới hạn tổng số lượt sử dụng</label>
                            <input
                                type="number"
                                value={formValues.usageLimit ?? ""}
                                onChange={(event) =>
                                    updateField(
                                        "usageLimit",
                                        event.target.value ? Number(event.target.value) : undefined
                                    )
                                }
                                placeholder="Không giới hạn"
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {formErrors.usageLimit && (
                                <p className="mt-1 text-xs font-medium text-danger">
                                    {formErrors.usageLimit}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Giới hạn mỗi khách hàng</label>
                            <input
                                type="number"
                                value={formValues.perUserLimit ?? ""}
                                onChange={(event) =>
                                    updateField(
                                        "perUserLimit",
                                        event.target.value ? Number(event.target.value) : undefined
                                    )
                                }
                                placeholder="Không giới hạn"
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {formErrors.perUserLimit && (
                                <p className="mt-1 text-xs font-medium text-danger">
                                    {formErrors.perUserLimit}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Ngày bắt đầu</label>
                            <input
                                type="datetime-local"
                                value={formValues.startAt ?? ""}
                                onChange={(event) =>
                                    updateField("startAt", event.target.value || undefined)
                                }
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-text">Ngày kết thúc</label>
                            <input
                                type="datetime-local"
                                value={formValues.endAt ?? ""}
                                onChange={(event) =>
                                    updateField("endAt", event.target.value || undefined)
                                }
                                className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {formErrors.endAt && (
                                <p className="mt-1 text-xs font-medium text-danger">
                                    {formErrors.endAt}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-text">Mô tả chi tiết</label>
                        <textarea
                            value={formValues.description ?? ""}
                            onChange={(event) => updateField("description", event.target.value)}
                            placeholder="Nhập ghi chú hoặc mô tả về mã giảm giá"
                            className="w-full resize-none rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-border bg-surface px-6 py-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={saving}
                        loading={saving}
                    >
                        Lưu mã giảm giá
                    </Button>
                </div>
            </form>
        </div>
    );
}