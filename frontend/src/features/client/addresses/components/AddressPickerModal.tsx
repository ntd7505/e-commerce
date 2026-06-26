import { Link } from 'react-router-dom';
import { MapPin, Phone, X, Check, Star, Plus, Pencil } from 'lucide-react';
import type { AddressResponse } from '../../cart/cartTypes';
import {
  buildAddressLine,
  getAddressTypeBadgeClass,
  getAddressTypeLabel,
} from '../addressHelpers';

type AddressPickerModalProps = {
  open: boolean;
  addresses: AddressResponse[];
  selectedAddressId?: number;
  loading?: boolean;
  onClose: () => void;
  onSelect: (address: AddressResponse) => void;
  onAddNew: () => void;
  title?: string;
};

export function AddressPickerModal({
  open,
  addresses,
  selectedAddressId,
  loading = false,
  onClose,
  onSelect,
  onAddNew,
  title = 'Chọn địa chỉ giao hàng',
}: AddressPickerModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-3 animate-pulse">
              {[0, 1, 2].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-100">
                  <div className="h-4 w-1/2 rounded bg-gray-100 mb-2" />
                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-1">Bạn chưa có địa chỉ nào</p>
              <p className="text-sm text-gray-500 mb-5">Thêm địa chỉ để tiếp tục.</p>
              <button
                onClick={onAddNew}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm địa chỉ mới
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                    onClick={() => {
                      onSelect(addr);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        {addr.recipientName}
                        <span className="text-gray-300 font-normal">|</span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {addr.phoneNumber}
                        </span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-blue-600 shrink-0" />}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {buildAddressLine(addr)}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${getAddressTypeBadgeClass(
                          addr.addressType,
                        )}`}
                      >
                        {getAddressTypeLabel(addr.addressType)}
                      </span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                          <Star className="w-2.5 h-2.5 fill-blue-500 text-blue-500" />
                          Mặc định
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={onAddNew}
                className="flex items-center justify-center gap-2 w-full p-4 border border-dashed border-gray-300 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 transition-colors mt-1"
              >
                <Plus className="w-4 h-4" />
                Thêm địa chỉ mới
              </button>

              <Link
                to="/account/addresses"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Quản lý sổ địa chỉ
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
