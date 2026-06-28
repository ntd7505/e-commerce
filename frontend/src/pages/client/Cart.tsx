import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, ChevronRight, Plus, Star, AlertCircle, Loader2, Tag, Trash2, ShieldCheck, RotateCcw, Headset } from 'lucide-react';
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
        <button onClick={() => refreshCart()} className="text-primary hover:underline">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="bg-canvas min-h-screen pb-20">
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 py-4">
          <Link to="/" className="text-muted text-sm font-medium hover:text-primary transition-colors">Trang chủ</Link>
          <span className="text-muted text-sm font-medium">/</span>
          <span className="text-text text-sm font-medium">Giỏ hàng</span>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pb-6 pt-2">
          <h1 className="text-wrap-balance text-text text-2xl md:text-3xl font-black leading-tight tracking-[-0.033em]">
            Giỏ hàng của bạn ({cart?.totalItems || 0})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-surface rounded-xl p-10 flex flex-col items-center justify-center shadow-sm text-center">
            <div className="w-32 h-32 mb-6">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty Cart" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Giỏ hàng của bạn còn trống</h3>
            <p className="text-muted mb-6">Hãy tìm thêm các sản phẩm công nghệ tuyệt vời khác nhé!</p>
            <Link to="/products" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-hover transition-colors">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side: Cart Items */}
            <div className="flex-1">
              {/* Bulk Actions */}
              <div className="bg-surface rounded-xl px-6 py-4 mb-4 flex items-center justify-between border border-border shadow-sm">
                <label className="flex items-center gap-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-5 w-5 rounded border-border-strong border-2 text-primary focus:ring-0 transition-all cursor-pointer"
                  />
                  <span className="text-text text-sm font-medium group-hover:text-primary transition-colors">Chọn tất cả</span>
                </label>
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.size === 0}
                  className="flex items-center gap-2 px-3 py-2 text-text hover:text-danger text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
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
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-text flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Giao tới
                    </h2>
                    {addresses.length > 0 && (
                      <button
                        onClick={() => setAddressSelectModalOpen(true)}
                        className="text-primary font-bold text-sm hover:underline inline-flex items-center gap-1"
                      >
                        Thay đổi
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {addressLoading ? (
                    <div className="animate-pulse flex flex-col gap-2.5">
                      <div className="h-4 bg-surface-alt rounded w-1/3" />
                      <div className="h-4 bg-surface-alt rounded w-2/3" />
                      <div className="h-5 w-20 rounded-full bg-surface-alt" />
                    </div>
                  ) : selectedAddress ? (
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-bold text-text">{selectedAddress.recipientName}</span>
                        <span className="text-subtle">|</span>
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted font-medium">
                          <Phone className="w-3.5 h-3.5 text-muted" />
                          {selectedAddress.phoneNumber}
                        </span>
                      </div>
                      <div className="text-sm text-muted leading-relaxed">
                        {buildAddressLine(selectedAddress)}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${getAddressTypeBadgeClass(
                            selectedAddress.addressType,
                          )}`}
                        >
                          {getAddressTypeLabel(selectedAddress.addressType)}
                        </span>
                        {selectedAddress.isDefault && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary-soft bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">
                            <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                            Mặc định
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-3 py-1">
                      <p className="text-muted text-sm">Bạn chưa có địa chỉ giao hàng</p>
                      <button
                        onClick={() => setAddressModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm địa chỉ
                      </button>
                    </div>
                  )}
                </div>

                {/* Khuyến mãi placeholder */}
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                  <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-primary" />
                    Khuyến mãi
                  </h2>
                  <p className="text-sm text-muted">
                    Áp dụng mã giảm giá ở bước thanh toán.
                  </p>
                </div>

                {/* Summary card */}
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                  <h2 className="text-lg font-bold text-text mb-5">Thanh toán</h2>

                  <div className="flex flex-col gap-3.5 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted">Tạm tính ({totalItems} sản phẩm)</span>
                      <span className="font-bold text-text">{formatCurrency(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-success">
                        <span>Giảm giá</span>
                        <span className="font-bold">-{formatCurrency(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-muted">Phí vận chuyển</span>
                      <span className="font-bold text-text text-right">
                        {selectedIds.size === 0 ? (
                          <span className="text-muted">—</span>
                        ) : !selectedAddress ? (
                          <span className="text-muted font-medium">Chọn địa chỉ để tính phí</span>
                        ) : previewLoading ? (
                          <span className="inline-flex items-center gap-1.5 text-muted font-medium">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Đang tính...
                          </span>
                        ) : previewError ? (
                          <span className="text-muted font-medium">Chưa khả dụng</span>
                        ) : shippingFee === 0 ? (
                          <span className="text-success">Miễn phí</span>
                        ) : (
                          formatCurrency(shippingFee ?? 0)
                        )}
                      </span>
                    </div>
                  </div>

                  {previewError && (
                    <div className="flex items-start gap-2 mb-4 rounded-xl bg-warning-soft border border-warning-soft px-3 py-2.5">
                      <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <p className="text-xs text-warning font-medium leading-relaxed">
                        {previewError}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-border my-3"></div>

                  <div className="flex justify-between items-end mb-6">
                    <span className="font-bold text-text">Tổng cộng</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-primary">{formatCurrency(total)}</span>
                      <p className="text-xs text-muted mt-1">(Đã bao gồm VAT nếu có)</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={selectedIds.size === 0}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    MUA HÀNG ({selectedIds.size})
                  </button>
                  <p className="text-center text-xs text-muted mt-3 italic">
                    Nhấn "Mua hàng" để chuyển đến bước thanh toán bảo mật.
                  </p>

                  {/* Trust Badges */}
                  <div className="mt-8 flex items-center justify-center gap-6 opacity-60 border-t border-gray-50 pt-6">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <ShieldCheck className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase">Bảo mật</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <RotateCcw className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase">Đổi trả 30 ngày</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Headset className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase">Hỗ trợ 24/7</span>
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
