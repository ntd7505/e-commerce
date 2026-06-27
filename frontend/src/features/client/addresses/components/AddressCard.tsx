import { MapPin, Phone, Pencil, Trash2, Star, Loader2, Check } from "lucide-react";
import type { AddressResponse } from "../../cart/cartTypes";
import {
  buildAddressLine,
  getAddressTypeBadgeClass,
  getAddressTypeLabel,
} from "../addressHelpers";

type AddressCardProps = {
  address: AddressResponse;
  onEdit: (address: AddressResponse) => void;
  onDelete: (address: AddressResponse) => void;
  onSetDefault: (address: AddressResponse) => void;
  deleting: boolean;
  settingDefault: boolean;
};

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  deleting,
  settingDefault,
}: AddressCardProps) {
  return (
    <div className={`bg-canvas border rounded-xl p-5 transition-colors duration-200 flex flex-col h-full ${address.isDefault ? 'border-primary shadow-sm' : 'border-border hover:border-primary/50'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${getAddressTypeBadgeClass(
              address.addressType,
            )}`}
          >
            {getAddressTypeLabel(address.addressType)}
          </span>
          {address.isDefault && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary-soft px-2 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-current" />
              Mặc định
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5 flex-1 mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-text">{address.recipientName}</h3>
          <span className="text-border-strong">|</span>
          <span className="inline-flex items-center gap-1.5 text-sm text-text-muted font-medium">
            <Phone className="w-3.5 h-3.5" />
            {address.phoneNumber}
          </span>
        </div>
        <p className="flex items-start gap-2 text-sm text-text-subtle leading-relaxed mt-2">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{buildAddressLine(address)}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(address)}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-danger transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {deleting ? "Đang xóa..." : "Xóa"}
        </button>
        
        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address)}
            disabled={settingDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold border border-border text-text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed ml-auto bg-canvas"
          >
            {settingDefault ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {settingDefault ? "Đang đặt..." : "Thiết lập mặc định"}
          </button>
        )}
      </div>
    </div>
  );
}

export function AddressCardSkeleton() {
  return (
    <div className="bg-canvas rounded-xl border border-border p-5 flex flex-col h-full animate-pulse">
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 rounded bg-surface-alt" />
        <div className="h-5 w-20 rounded bg-surface-alt" />
      </div>
      <div className="space-y-3 flex-1 mb-5">
        <div className="h-5 w-1/2 rounded bg-surface-alt" />
        <div className="h-4 w-3/4 rounded bg-surface-alt mt-3" />
        <div className="h-4 w-2/3 rounded bg-surface-alt" />
      </div>
      <div className="flex gap-4 mt-auto pt-4 border-t border-border">
        <div className="h-5 w-12 rounded bg-surface-alt" />
        <div className="h-5 w-12 rounded bg-surface-alt" />
        <div className="h-8 w-32 rounded bg-surface-alt ml-auto" />
      </div>
    </div>
  );
}
