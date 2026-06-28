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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-2xl w-full max-w-lg border border-border overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h3 className="font-bold text-lg text-text">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-muted p-1"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-3 animate-pulse">
              {[0, 1, 2].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-border">
                  <div className="h-4 w-1/2 rounded bg-surface-alt mb-2" />
                  <div className="h-4 w-3/4 rounded bg-surface-alt" />
                </div>
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-7 h-7 text-muted" />
              </div>
              <p className="text-muted font-medium mb-1">Bạn chưa có địa chỉ nào</p>
              <p className="text-sm text-muted mb-5">Thêm địa chỉ để tiếp tục.</p>
              <button
                onClick={onAddNew}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
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
                        ? 'border-primary bg-primary-soft/40 ring-1 ring-primary-soft'
                        : 'border-border-strong hover:border-primary'
                    }`}
                    onClick={() => {
                      onSelect(addr);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="font-bold text-text flex items-center gap-2">
                        {addr.recipientName}
                        <span className="text-subtle font-normal">|</span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-muted">
                          <Phone className="w-3.5 h-3.5 text-muted" />
                          {addr.phoneNumber}
                        </span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-primary shrink-0" />}
                    </div>
                    <div className="text-sm text-muted leading-relaxed">
                      {buildAddressLine(addr)}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${getAddressTypeBadgeClass(
                          addr.addressType,
                        )}`}
                      >
                        {getAddressTypeLabel(addr.addressType)}
                      </span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary-soft bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">
                          <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                          Mặc định
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={onAddNew}
                className="flex items-center justify-center gap-2 w-full p-4 border border-dashed border-border-strong rounded-xl text-primary font-semibold hover:bg-primary-soft transition-colors mt-1"
              >
                <Plus className="w-4 h-4" />
                Thêm địa chỉ mới
              </button>

              <Link
                to="/account/addresses"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 text-sm font-medium text-muted hover:text-primary transition-colors"
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
