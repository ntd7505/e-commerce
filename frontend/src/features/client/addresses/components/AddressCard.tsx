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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getAddressTypeBadgeClass(
              address.addressType,
            )}`}
          >
            {getAddressTypeLabel(address.addressType)}
          </span>
          {address.isDefault && (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
              <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
              Mặc định
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-900">{address.recipientName}</h3>
          <span className="text-gray-300">|</span>
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 font-medium">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            {address.phoneNumber}
          </span>
        </div>
        <p className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <span>{buildAddressLine(address)}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(address)}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {deleting ? "Đang xóa..." : "Xóa"}
        </button>
        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address)}
            disabled={settingDefault}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
          >
            {settingDefault ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {settingDefault ? "Đang đặt..." : "Đặt làm mặc định"}
          </button>
        )}
      </div>
    </div>
  );
}

export function AddressCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6 animate-pulse">
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-20 rounded-full bg-gray-100" />
        <div className="h-6 w-20 rounded-full bg-gray-100" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-1/2 rounded bg-gray-100" />
        <div className="h-4 w-3/4 rounded bg-gray-100" />
      </div>
      <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
        <div className="h-9 w-20 rounded-xl bg-gray-100" />
        <div className="h-9 w-20 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}
