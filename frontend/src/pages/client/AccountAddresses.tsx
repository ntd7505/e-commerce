import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, XCircle, Trash2 } from 'lucide-react';
import AccountSidebar from './components/account/AccountSidebar';
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
    <div className="bg-[#f5f7fb] min-h-screen py-8">
      <div className="container-custom">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Trang chủ</Link>
          <span className="text-gray-400">/</span>
          <Link to="/account" className="hover:text-blue-600 transition-colors font-medium">Tài khoản</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">Sổ địa chỉ</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <AccountSidebar />

          <div className="flex-1 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-gray-900">Sổ địa chỉ</h1>
                  <p className="text-gray-500 mt-1.5">Quản lý địa chỉ giao hàng của bạn</p>
                </div>
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Thêm địa chỉ mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {loading && (
                  <>
                    <AddressCardSkeleton />
                    <AddressCardSkeleton />
                  </>
                )}

                {!loading && error && (
                  <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                      <XCircle className="w-7 h-7" />
                    </div>
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <button
                      onClick={refresh}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Thử lại
                    </button>
                  </div>
                )}

                {noAddresses && (
                  <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Bạn chưa có địa chỉ giao hàng nào</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">Thêm địa chỉ để quá trình thanh toán nhanh hơn.</p>
                    <button
                      onClick={openCreate}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
