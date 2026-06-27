import { useState } from 'react';
import { Plus, MapPin, XCircle, Trash2 } from 'lucide-react';
import AccountPageLayout from './components/account/AccountPageLayout';
import { useAddresses } from '../../features/client/addresses/hooks/useAddresses';
import { AddressCard, AddressCardSkeleton } from '../../features/client/addresses/components/AddressCard';
import { AddressFormModal } from '../../features/client/addresses/components/AddressFormModal';
import { ConfirmDialog } from '../../features/client/orders/components/ConfirmDialog';
import { addressToForm } from '../../features/client/addresses/addressHelpers';
import type { AddressRequest, AddressResponse } from '../../features/client/cart/cartTypes';
import { useToast } from '../../features/ui/ToastProvider';
import { parseApiError } from '../../utils/apiError';

export default function AccountAddresses() {
  const { showToast } = useToast();
  const {
    addresses,
    loading,
    error,
    submitting,
    deletingId,
    settingDefaultId,
    refresh,
    createAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  } = useAddresses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AddressResponse | null>(null);

  function openCreate() {
    setEditingAddress(null);
    setIsModalOpen(true);
  }

  function openEdit(address: AddressResponse) {
    setEditingAddress(address);
    setIsModalOpen(true);
  }

  async function handleSubmit(payload: AddressRequest) {
    if (editingAddress) {
      try {
        await updateAddress(editingAddress.id, payload);
        showToast('Đã cập nhật địa chỉ.', 'success');
        setIsModalOpen(false);
      } catch (err) {
        showToast(parseApiError(err).message || 'Không thể cập nhật địa chỉ.', 'error');
      }
      return;
    }
    try {
      await createAddress(payload);
      showToast('Đã thêm địa chỉ mới.', 'success');
      setIsModalOpen(false);
    } catch (err) {
      showToast(parseApiError(err).message || 'Không thể thêm địa chỉ.', 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    try {
      await removeAddress(target.id);
      showToast('Đã xóa địa chỉ.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      showToast(parseApiError(err).message || 'Không thể xóa địa chỉ.', 'error');
    }
  }

  async function handleSetDefault(address: AddressResponse) {
    try {
      await setDefaultAddress(address);
      showToast('Đã đặt địa chỉ mặc định.', 'success');
    } catch (err) {
      showToast(parseApiError(err).message || 'Không thể đặt địa chỉ mặc định.', 'error');
    }
  }

  const noAddresses = !loading && !error && addresses.length === 0;

  return (
    <>
      <AccountPageLayout
        breadcrumbCurrent="Sổ địa chỉ"
        title="Sổ địa chỉ"
        description="Quản lý địa chỉ giao hàng của bạn"
        headerRight={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm địa chỉ mới
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading && (
            <>
              <AddressCardSkeleton />
              <AddressCardSkeleton />
            </>
          )}

          {!loading && error && (
            <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-red-50 text-danger rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-7 h-7" />
              </div>
              <p className="text-danger font-medium mb-4">{error}</p>
              <button
                onClick={refresh}
                className="px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                Thử lại
              </button>
            </div>
          )}

          {noAddresses && (
            <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-center bg-surface-alt rounded-xl border border-border border-dashed">
              <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center shadow-sm mb-4">
                <MapPin className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-1">Bạn chưa có địa chỉ giao hàng nào</h3>
              <p className="text-text-subtle max-w-sm mx-auto mb-6">Thêm địa chỉ để quá trình thanh toán nhanh hơn.</p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm địa chỉ mới
              </button>
            </div>
          )}

          {!loading && !error && addresses.length > 0 && (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onSetDefault={handleSetDefault}
                deleting={deletingId === address.id}
                settingDefault={settingDefaultId === address.id}
              />
            ))
          )}
        </div>
      </AccountPageLayout>

      <AddressFormModal
        open={isModalOpen}
        initial={editingAddress ? addressToForm(editingAddress) : null}
        title={editingAddress ? `Chỉnh sửa địa chỉ #${editingAddress.id}` : 'Thêm địa chỉ mới'}
        submitLabel={editingAddress ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
        loading={submitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Xóa địa chỉ #${deleteTarget?.id ?? ''}`}
        description="Địa chỉ sẽ bị xóa khỏi sổ địa chỉ của bạn. Hành động này không thể hoàn tác."
        confirmLabel="Xóa địa chỉ"
        cancelLabel="Hủy bỏ"
        tone="primary"
        icon={Trash2}
        loading={deletingId === deleteTarget?.id}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
