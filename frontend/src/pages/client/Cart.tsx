import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, ChevronRight, Plus, Star, AlertCircle, Loader2, Tag } from 'lucide-react';
import { useCart } from '../../features/client/cart/CartProvider';
import CartItemCard from './components/cart/CartItemCard';
import { cartApi } from '../../features/client/cart/cartApi';
import type { AddressRequest, AddressResponse, CheckoutPreviewResponse } from '../../features/client/cart/cartTypes';
import { AddressFormModal } from '../../features/client/addresses/components/AddressFormModal';
import { AddressPickerModal } from '../../features/client/addresses/components/AddressPickerModal';
import {
  buildAddressLine,
  getAddressTypeBadgeClass,
  getAddressTypeLabel,
} from '../../features/client/addresses/addressHelpers';
import { useToast } from '../../features/ui/ToastProvider';
import { parseApiError } from '../../utils/apiError';
import { formatCurrency } from '../../utils/formatters';
import { LoadingState, ErrorState } from '../../components/common/States';

export default function Cart() {
  const { cart, loading, error, updateItem, removeItem, clearCart, refreshCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Address + preview state
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressSelectModalOpen, setAddressSelectModalOpen] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);

  const [checkoutPreview, setCheckoutPreview] = useState<CheckoutPreviewResponse | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Lọc bỏ những item không còn tồn tại trong cart khỏi selectedIds
  useEffect(() => {
    if (cart) {
      const validIds = new Set(cart.items.map(item => item.id));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIds(prev => {
        const next = new Set(prev);
        for (const id of next) {
          if (!validIds.has(id)) {
            next.delete(id);
          }
        }
        return next;
      });
    }
  }, [cart]);

  // Tải danh sách địa chỉ + auto-select default hoặc đầu tiên
  useEffect(() => {
    let cancelled = false;
    async function loadAddresses() {
      try {
        setAddressLoading(true);
        const data = await cartApi.getAddresses();
        if (cancelled) return;
        const active = data.filter((addr) => !addr.deleted);
        setAddresses(active);
        if (active.length > 0) {
          const defaultAddr = active.find((a) => a.isDefault) ?? active[0];
          setSelectedAddress(defaultAddr);
        } else {
          setSelectedAddress(null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load addresses', err);
      } finally {
        if (!cancelled) setAddressLoading(false);
      }
    }
    void loadAddresses();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => cart?.items || [], [cart?.items]);
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map(i => i.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Bạn có chắc muốn xoá ${selectedIds.size} mục đã chọn?`)) {
      try {
        if (selectedIds.size === items.length) {
          await clearCart();
        } else {
          for (const id of Array.from(selectedIds)) {
            await removeItem(id);
          }
        }
        setSelectedIds(new Set());
      } catch (err) {
        console.error('Lỗi khi xoá nhiều mục', err);
      }
    }
  };

  const selectedSubtotal = useMemo(() => {
    return items
      .filter(item => selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.lineTotal, 0);
  }, [items, selectedIds]);

  // Checkout preview: chỉ gọi khi có sản phẩm được chọn VÀ có địa chỉ
  const selectedIdsKey = useMemo(() => Array.from(selectedIds).sort((a, b) => a - b).join(','), [selectedIds]);
  const addressId = selectedAddress?.id;

  useEffect(() => {
    if (selectedIds.size === 0 || !addressId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCheckoutPreview(null);
      setPreviewError(null);
      setPreviewLoading(false);
      return;
    }
    let cancelled = false;
    async function fetchPreview() {
      try {
        setPreviewLoading(true);
        setPreviewError(null);
        const data = await cartApi.previewCheckout({
          cartItemIds: Array.from(selectedIds),
          addressId,
          couponCode: undefined,
        });
        if (cancelled) return;
        setCheckoutPreview(data);
      } catch (err) {
        if (cancelled) return;
        console.error('Checkout preview failed', err);
        setPreviewError(parseApiError(err).message || 'Không thể tính phí vận chuyển.');
        setCheckoutPreview(null);
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    }
    void fetchPreview();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdsKey, addressId]);

  async function handleCreateAddress(payload: AddressRequest) {
    try {
      setSubmittingAddress(true);
      const created = await cartApi.createAddress(payload);
      setAddresses((prev) => [...prev, created]);
      setSelectedAddress(created);
      setAddressModalOpen(false);
      showToast('Đã thêm địa chỉ mới.', 'success');
    } catch (err) {
      showToast(parseApiError(err).message || 'Không thể tạo địa chỉ mới.', 'error');
    } finally {
      setSubmittingAddress(false);
    }
  }

  const handleCheckout = () => {
    if (selectedIds.size === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    const payload = {
      cartItemIds: Array.from(selectedIds),
      addressId: selectedAddress?.id ?? null,
    };
    sessionStorage.setItem('checkoutDraft', JSON.stringify(payload));
    navigate('/checkout');
  };

  // Tính các giá trị hiển thị cho summary
  const subtotal = checkoutPreview?.subtotalAmount ?? selectedSubtotal;
  const discount = checkoutPreview?.discountAmount ?? 0;
  const shippingFee = checkoutPreview?.shippingFee;
  const total = checkoutPreview?.totalAmount ?? selectedSubtotal;
  const totalItems = checkoutPreview?.totalItems ?? selectedIds.size;

  if (loading && !cart) {
    return <div className="min-h-[60vh] flex items-center justify-center"><LoadingState /></div>;
  }

  if (error && !cart) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ErrorState message={error} />
        <button onClick={() => refreshCart()} className="text-blue-600 hover:underline">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7f8] min-h-screen pb-20">
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 py-4">
          <Link to="/" className="text-gray-500 text-sm font-medium hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span className="text-gray-500 text-sm font-medium">/</span>
          <span className="text-gray-900 text-sm font-medium">Giỏ hàng</span>
        </div>
        
        <div className="flex flex-wrap justify-between gap-3 pb-6 pt-2">
          <h1 className="text-gray-900 text-2xl md:text-3xl font-black leading-tight tracking-[-0.033em]">
            Giỏ hàng của bạn ({cart?.totalItems || 0})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-10 flex flex-col items-center justify-center shadow-sm text-center">
            <div className="w-32 h-32 mb-6">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty Cart" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn còn trống</h3>
            <p className="text-gray-500 mb-6">Hãy tìm thêm các sản phẩm công nghệ tuyệt vời khác nhé!</p>
            <Link to="/products" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side: Cart Items */}
            <div className="flex-1">
              {/* Bulk Actions */}
              <div className="bg-white rounded-xl px-6 py-4 mb-4 flex items-center justify-between border border-gray-100 shadow-sm">
                <label className="flex items-center gap-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 border-2 text-blue-600 focus:ring-0 transition-all cursor-pointer"
                  />
                  <span className="text-gray-900 text-sm font-medium group-hover:text-blue-600 transition-colors">Chọn tất cả</span>
                </label>
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.size === 0}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-500 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-trash-can"></i>
                  <span className="hidden sm:inline">Xóa mục đã chọn</span>
                </button>
              </div>

              {/* Item List */}
              <div className="flex flex-col gap-4">
                {items.map(item => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedIds.has(item.id)}
                    onSelect={handleSelectItem}
                    onUpdateQuantity={(id, quantity) => updateItem(id, { quantity })}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Summary */}
            <div className="w-full lg:w-[360px] xl:w-[400px] flex-shrink-0">
              <div className="sticky top-[100px] flex flex-col gap-4">
                {/* Giao tới card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Giao tới
                    </h2>
                    {addresses.length > 0 && (
                      <button
                        onClick={() => setAddressSelectModalOpen(true)}
                        className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1"
                      >
                        Thay đổi
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {addressLoading ? (
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
                    <div className="flex flex-col items-start gap-3 py-1">
                      <p className="text-gray-500 text-sm">Bạn chưa có địa chỉ giao hàng</p>
                      <button
                        onClick={() => setAddressModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm địa chỉ
                      </button>
                    </div>
                  )}
                </div>

                {/* Khuyến mãi placeholder */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-blue-600" />
                    Khuyến mãi
                  </h2>
                  <p className="text-sm text-gray-500">
                    Áp dụng mã giảm giá ở bước thanh toán.
                  </p>
                </div>

                {/* Summary card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Thanh toán</h2>

                  <div className="flex flex-col gap-3.5 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tạm tính ({totalItems} sản phẩm)</span>
                      <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá</span>
                        <span className="font-bold">-{formatCurrency(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-500">Phí vận chuyển</span>
                      <span className="font-bold text-gray-900 text-right">
                        {selectedIds.size === 0 ? (
                          <span className="text-gray-400">—</span>
                        ) : !selectedAddress ? (
                          <span className="text-gray-500 font-medium">Chọn địa chỉ để tính phí</span>
                        ) : previewLoading ? (
                          <span className="inline-flex items-center gap-1.5 text-gray-400 font-medium">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Đang tính...
                          </span>
                        ) : previewError ? (
                          <span className="text-gray-400 font-medium">Chưa khả dụng</span>
                        ) : shippingFee === 0 ? (
                          <span className="text-green-600">Miễn phí</span>
                        ) : (
                          formatCurrency(shippingFee ?? 0)
                        )}
                      </span>
                    </div>
                  </div>

                  {previewError && (
                    <div className="flex items-start gap-2 mb-4 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 font-medium leading-relaxed">
                        {previewError}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 my-3"></div>

                  <div className="flex justify-between items-end mb-6">
                    <span className="font-bold text-gray-900">Tổng cộng</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-600">{formatCurrency(total)}</span>
                      <p className="text-[11px] text-gray-400 mt-1">(Đã bao gồm VAT nếu có)</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={selectedIds.size === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    MUA HÀNG ({selectedIds.size})
                  </button>
                  <p className="text-center text-[11px] text-gray-500 mt-3 italic">
                    Nhấn "Mua hàng" để chuyển đến bước thanh toán bảo mật.
                  </p>

                  {/* Trust Badges */}
                  <div className="mt-8 flex items-center justify-center gap-6 opacity-60 border-t border-gray-50 pt-6">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <i className="fa-solid fa-shield-halved text-2xl"></i>
                      <span className="text-[10px] font-bold uppercase">Bảo mật</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <i className="fa-solid fa-rotate-left text-2xl"></i>
                      <span className="text-[10px] font-bold uppercase">Đổi trả 30 ngày</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <i className="fa-solid fa-headset text-2xl"></i>
                      <span className="text-[10px] font-bold uppercase">Hỗ trợ 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address picker modal */}
      <AddressPickerModal
        open={addressSelectModalOpen}
        addresses={addresses}
        selectedAddressId={selectedAddress?.id}
        loading={addressLoading}
        title="Chọn địa chỉ giao hàng"
        onClose={() => setAddressSelectModalOpen(false)}
        onSelect={setSelectedAddress}
        onAddNew={() => {
          setAddressSelectModalOpen(false);
          setAddressModalOpen(true);
        }}
      />

      {/* Address form modal */}
      <AddressFormModal
        open={addressModalOpen}
        initial={null}
        title="Thêm địa chỉ mới"
        submitLabel="Thêm địa chỉ"
        loading={submittingAddress}
        onClose={() => setAddressModalOpen(false)}
        onSubmit={handleCreateAddress}
      />
    </div>
  );
}
