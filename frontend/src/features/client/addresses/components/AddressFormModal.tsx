import { useEffect, useState } from "react";
import { Loader2, X, Home, Briefcase, MapPin } from "lucide-react";
import type { AddressRequest, AddressType } from "../../cart/cartTypes";
import {
  ADDRESS_TYPE_OPTIONS,
  createEmptyAddressForm,
  hasAddressErrors,
  validateAddressForm,
} from "../addressHelpers";

type AddressFormModalProps = {
  open: boolean;
  initial?: AddressRequest | null;
  title: string;
  submitLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: AddressRequest) => void;
};

const inputBase =
  "w-full rounded-xl border px-3.5 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:ring-2";

function fieldClass(hasError: boolean): string {
  return hasError
    ? `${inputBase} border-danger focus:ring-danger-soft`
    : `${inputBase} border-border-strong focus:border-primary focus:ring-primary-soft`;
}

const typeIcon: Record<AddressType, typeof Home> = {
  HOME: Home,
  OFFICE: Briefcase,
  OTHER: MapPin,
};

export function AddressFormModal({
  open,
  initial,
  title,
  submitLabel = "Lưu địa chỉ",
  loading = false,
  onClose,
  onSubmit,
}: AddressFormModalProps) {
  const [form, setForm] = useState<AddressRequest>(createEmptyAddressForm());
  const [errors, setErrors] = useState<ReturnType<typeof validateAddressForm>>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initial ?? createEmptyAddressForm());
      setErrors({});
      setTouched(false);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  function update<K extends keyof AddressRequest>(key: K, value: AddressRequest[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (touched) {
        setErrors(validateAddressForm(next));
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const validation = validateAddressForm(form);
    setErrors(validation);
    if (hasAddressErrors(validation)) return;
    onSubmit({
      ...form,
      recipientName: form.recipientName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      provinceName: form.provinceName.trim(),
      districtName: form.districtName.trim(),
      wardName: form.wardName.trim(),
      fullAddress: form.fullAddress.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-surface rounded-2xl border border-border overflow-hidden flex flex-col">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border shrink-0">
          <h3 className="text-lg font-bold text-text">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-muted hover:text-muted p-1 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="addr-recipient" className="block text-sm font-semibold text-text mb-1.5">
                Họ tên người nhận <span className="text-danger">*</span>
              </label>
              <input
                id="addr-recipient"
                type="text"
                maxLength={100}
                value={form.recipientName}
                onChange={(e) => update("recipientName", e.target.value)}
                disabled={loading}
                placeholder="Nguyễn Văn A"
                className={fieldClass(!!errors.recipientName)}
              />
              {errors.recipientName && (
                <p className="mt-1.5 text-xs text-danger font-medium">{errors.recipientName}</p>
              )}
            </div>

            <div>
              <label htmlFor="addr-phone" className="block text-sm font-semibold text-text mb-1.5">
                Số điện thoại <span className="text-danger">*</span>
              </label>
              <input
                id="addr-phone"
                type="tel"
                inputMode="tel"
                maxLength={20}
                value={form.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                disabled={loading}
                placeholder="0912345678"
                className={fieldClass(!!errors.phoneNumber)}
              />
              {errors.phoneNumber && (
                <p className="mt-1.5 text-xs text-danger font-medium">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="addr-province" className="block text-sm font-semibold text-text mb-1.5">
                Tỉnh/Thành phố <span className="text-danger">*</span>
              </label>
              <input
                id="addr-province"
                type="text"
                maxLength={100}
                value={form.provinceName}
                onChange={(e) => update("provinceName", e.target.value)}
                disabled={loading}
                placeholder="TP. Hồ Chí Minh"
                className={fieldClass(!!errors.provinceName)}
              />
              {errors.provinceName && (
                <p className="mt-1.5 text-xs text-danger font-medium">{errors.provinceName}</p>
              )}
            </div>
            <div>
              <label htmlFor="addr-district" className="block text-sm font-semibold text-text mb-1.5">
                Quận/Huyện <span className="text-danger">*</span>
              </label>
              <input
                id="addr-district"
                type="text"
                maxLength={100}
                value={form.districtName}
                onChange={(e) => update("districtName", e.target.value)}
                disabled={loading}
                placeholder="Quận 1"
                className={fieldClass(!!errors.districtName)}
              />
              {errors.districtName && (
                <p className="mt-1.5 text-xs text-danger font-medium">{errors.districtName}</p>
              )}
            </div>
            <div>
              <label htmlFor="addr-ward" className="block text-sm font-semibold text-text mb-1.5">
                Phường/Xã <span className="text-danger">*</span>
              </label>
              <input
                id="addr-ward"
                type="text"
                maxLength={100}
                value={form.wardName}
                onChange={(e) => update("wardName", e.target.value)}
                disabled={loading}
                placeholder="Phường Bến Nghé"
                className={fieldClass(!!errors.wardName)}
              />
              {errors.wardName && (
                <p className="mt-1.5 text-xs text-danger font-medium">{errors.wardName}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="addr-detail" className="block text-sm font-semibold text-text mb-1.5">
              Địa chỉ cụ thể <span className="text-danger">*</span>
            </label>
            <input
              id="addr-detail"
              type="text"
              maxLength={200}
              value={form.fullAddress}
              onChange={(e) => update("fullAddress", e.target.value)}
              disabled={loading}
              placeholder="Số nhà, tên đường..."
              className={fieldClass(!!errors.fullAddress)}
            />
            {errors.fullAddress && (
              <p className="mt-1.5 text-xs text-danger font-medium">{errors.fullAddress}</p>
            )}
          </div>

          <div className="mt-4">
            <span className="block text-sm font-semibold text-text mb-1.5">Loại địa chỉ</span>
            <div className="grid grid-cols-3 gap-2">
              {ADDRESS_TYPE_OPTIONS.map((opt) => {
                const Icon = typeIcon[opt.value];
                const isActive = form.addressType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update("addressType", opt.value)}
                    disabled={loading}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border-strong text-muted hover:border-primary hover:text-primary"
                    } disabled:opacity-60`}
                  >
                    <Icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {errors.addressType && (
              <p className="mt-1.5 text-xs text-danger font-medium">{errors.addressType}</p>
            )}
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer mt-5 select-none">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => update("isDefault", e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded text-primary focus:ring-primary-soft border-border-strong"
            />
            <span className="text-sm text-text font-medium">Đặt làm địa chỉ mặc định</span>
          </label>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text bg-surface-alt hover:bg-border transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
