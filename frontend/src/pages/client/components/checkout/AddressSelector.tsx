import { useEffect, useState } from 'react';
import { MapPin, Phone, Plus, Star, ChevronRight } from 'lucide-react';
import { cartApi } from '../../../../features/client/cart/cartApi';
import type { AddressRequest, AddressResponse } from '../../../../features/client/cart/cartTypes';
import { AddressFormModal } from '../../../../features/client/addresses/components/AddressFormModal';
import { AddressPickerModal } from '../../../../features/client/addresses/components/AddressPickerModal';
import {
  buildAddressLine,
  getAddressTypeBadgeClass,
  getAddressTypeLabel,
} from '../../../../features/client/addresses/addressHelpers';
import { useToast } from '../../../../features/ui/ToastProvider';
import { parseApiError } from '../../../../utils/apiError';

interface AddressSelectorProps {
  selectedAddressId?: number;
  onSelect: (address: AddressResponse) => void;
  /** Khi truyền vào, component sẽ ưu tiên preselect addressId này thay vì default. */
  preferredAddressId?: number;
}

export default function AddressSelector({ selectedAddressId, onSelect, preferredAddressId }: AddressSelectorProps) {
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadAddresses(autoSelect = false) {
    try {
      setLoading(true);
      const data = await cartApi.getAddresses();
      const active = data.filter((addr) => !addr.deleted);
      setAddresses(active);
      if (autoSelect && !selectedAddressId && active.length > 0) {
        const preferred = preferredAddressId
          ? active.find((a) => a.id === preferredAddressId)
          : undefined;
        const defaultAddr = active.find((a) => a.isDefault) ?? active[0];
        onSelect(preferred ?? defaultAddr);
      }
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAddresses(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(payload: AddressRequest) {
    try {
      setSubmitting(true);
      const created = await cartApi.createAddress(payload);
      setShowFormModal(false);
      await loadAddresses(false);
      onSelect(created);
      showToast('Đã thêm địa chỉ mới.', 'success');
    } catch (err) {
      showToast(parseApiError(err).message || 'Không thể tạo địa chỉ mới.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Giao tới
        </h2>
        <button
          onClick={() => setShowListModal(true)}
          className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1"
        >
          Thay đổi
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-2.5">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
          <div className="h-5 w-20 rounded-full bg-gray-100" />
        </div>
      ) : selectedAddress ? (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-bold text-gray-900">{selectedAddress.recipientName}</span>
            <span className="text-gray-300">|</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 font-medium">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {selectedAddress.phoneNumber}
            </span>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            {buildAddressLine(selectedAddress)}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${getAddressTypeBadgeClass(
                selectedAddress.addressType,
              )}`}
            >
              {getAddressTypeLabel(selectedAddress.addressType)}
            </span>
            {selectedAddress.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                <Star className="w-2.5 h-2.5 fill-blue-500 text-blue-500" />
                Mặc định
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 py-2">
          <p className="text-gray-500 text-sm">Chưa có địa chỉ giao hàng.</p>
          <button
            onClick={() => setShowFormModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm địa chỉ mới
          </button>
        </div>
      )}

      <AddressPickerModal
        open={showListModal}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        loading={loading}
        title="Chọn địa chỉ giao hàng"
        onClose={() => setShowListModal(false)}
        onSelect={onSelect}
        onAddNew={() => {
          setShowListModal(false);
          setShowFormModal(true);
        }}
      />

      <AddressFormModal
        open={showFormModal}
        initial={null}
        title="Thêm địa chỉ mới"
        submitLabel="Thêm địa chỉ"
        loading={submitting}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
