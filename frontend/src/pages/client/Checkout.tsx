import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../../features/client/cart/cartApi';
import type { CheckoutPreviewResponse, AddressResponse, CheckoutDraft } from '../../features/client/cart/cartTypes';
import { getCheckoutDraft, saveCheckoutDraft, clearCheckoutDraft } from '../../features/client/cart/checkoutDraft';
import AddressSelector from './components/checkout/AddressSelector';
import CouponInput from './components/checkout/CouponInput';
import { formatCurrency } from '../../utils/formatters';
import { LoadingState } from '../../components/common/States';
import { useCart } from '../../features/client/cart/CartProvider';
import { useToast } from '../../features/ui/ToastProvider';
import { Box, CreditCard, Loader2 } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { refreshCart, activeDeliveryAddress, setActiveDeliveryAddress } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<CheckoutPreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize synchronously from sessionStorage
  const draftData = useMemo(() => getCheckoutDraft(), []);

  // Draft state
  const [draft, setDraft] = useState<CheckoutDraft | null>(draftData);
  const [preferredAddressId] = useState<number | undefined>(
    draftData?.addressId || activeDeliveryAddress?.id || undefined
  );
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(draftData?.couponCode || null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (!draft) {
      navigate('/cart', { replace: true });
    } else if (draft.type === 'cart' && (!draft.cartItemIds || draft.cartItemIds.length === 0)) {
      navigate('/cart', { replace: true });
    }
  }, [navigate, draft]);

  useEffect(() => {
    if (!draft) return;
    
    const fetchPreview = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: CheckoutPreviewResponse;
        if (draft.type === 'buy-now') {
          data = await cartApi.previewBuyNowOrder({
            productVariantId: draft.productVariantId,
            quantity: draft.quantity,
            addressId: selectedAddress?.id,
            couponCode: couponCode || undefined
          });
        } else {
          data = await cartApi.previewCheckout({
            cartItemIds: draft.cartItemIds,
            addressId: selectedAddress?.id,
            couponCode: couponCode || undefined
          });
        }
        setPreview(data);
        if (!paymentMethod && data.paymentMethods && data.paymentMethods.length > 0) {
          setPaymentMethod(data.paymentMethods[0]);
        }
      } catch {
        setError('Lỗi khi tính toán đơn hàng. Vui lòng kiểm tra lại giỏ hàng.');
      } finally {
        setLoading(false);
      }
    };
    
    void fetchPreview();
  }, [draft, selectedAddress, couponCode, paymentMethod]);

  const handleApplyCoupon = async (code: string) => {
    if (!draft) return;
    setCouponError(null);
    try {
      if (draft.type === 'buy-now') {
        await cartApi.previewBuyNowOrder({
          productVariantId: draft.productVariantId,
          quantity: draft.quantity,
          addressId: selectedAddress?.id,
          couponCode: code
        });
      } else {
        await cartApi.previewCheckout({
          cartItemIds: draft.cartItemIds,
          addressId: selectedAddress?.id,
          couponCode: code
        });
      }
      setCouponCode(code);
      const newDraft = { ...draft, couponCode: code };
      setDraft(newDraft);
      saveCheckoutDraft(newDraft);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setCouponError(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
    }
  };

  const handleRemoveCoupon = async () => {
    if (!draft) return;
    setCouponError(null);
    setCouponCode(null);
    const newDraft = { ...draft };
    delete newDraft.couponCode;
    setDraft(newDraft);
    saveCheckoutDraft(newDraft);
  };

  const handleSubmitOrder = async () => {
    if (!draft) return;
    if (!selectedAddress) {
      showToast('Vui lòng chọn địa chỉ giao hàng.', 'error');
      return;
    }
    if (!paymentMethod) {
      showToast('Vui lòng chọn phương thức thanh toán.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      let order;
      if (draft.type === 'buy-now') {
        order = await cartApi.createBuyNowOrder({
          productVariantId: draft.productVariantId,
          quantity: draft.quantity,
          addressId: selectedAddress.id,
          couponCode: couponCode || undefined,
          paymentMethod,
          note
        });
      } else {
        order = await cartApi.createOrder({
          cartItemIds: draft.cartItemIds,
          addressId: selectedAddress.id,
          couponCode: couponCode || undefined,
          paymentMethod,
          note
        });
      }
      
      clearCheckoutDraft();
      await refreshCart();
      navigate(`/checkout/success/${order.id}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.', 'error');
      setSubmitting(false);
    }
  };

  if (!draft) return null; // Wait for redirect

  return (
    <div className="bg-gradient-to-b from-primary-soft/40 to-surface min-h-screen pb-20">
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 py-4">
          <Link to="/cart" className="text-muted text-sm font-medium hover:text-primary transition-colors">Giỏ hàng</Link>
          <span className="text-muted text-sm font-medium">/</span>
          <span className="text-text text-sm font-medium">Thanh toán</span>
        </div>
        
        <h1 className="text-wrap-balance text-text text-2xl md:text-3xl font-black leading-tight tracking-[-0.033em] mb-8">
          Thanh toán
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            <AddressSelector
              selectedAddressId={selectedAddress?.id}
              preferredAddressId={preferredAddressId}
              onSelect={(addr) => {
                setSelectedAddress(addr);
                setActiveDeliveryAddress(addr);
              }}
            />

            <div className="bg-surface rounded-2xl p-6 lg:p-7 border border-primary/10 shadow-sm shadow-primary/5 mb-6">
              <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-4">
                <Box className="w-5 h-5 text-primary" /> Sản phẩm
              </h2>
              {loading && !preview ? (
                <div className="py-10"><LoadingState /></div>
              ) : error ? (
                <div className="py-4 text-danger">{error}</div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-50">
                  {preview?.items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-surface rounded-lg flex-shrink-0 flex items-center justify-center border border-border overflow-hidden">
                        {item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-contain" />
                        ) : (
                          <Box className="w-6 h-6 text-subtle" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h4 className="font-bold text-text line-clamp-1">{item.productName}</h4>
                        <p className="text-sm text-muted line-clamp-1">Phân loại: {item.variantName}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted font-medium">x{item.quantity}</span>
                          <div className="text-right">
                            <span className="font-bold text-primary block leading-tight">{formatCurrency(item.lineTotal)}</span>
                            {item.quantity > 1 && (
                              <span className="text-xs text-muted">{formatCurrency(item.unitPrice)}/sp</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-canvas border border-border p-5 lg:p-6">
                <label htmlFor="seller-note" className="block text-sm font-bold text-text mb-2">
                  Lời nhắn cho người bán (tùy chọn)
                </label>
                <textarea
                  id="seller-note"
                  rows={2}
                  maxLength={500}
                  className="w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition-colors resize-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
                <p className="mt-1.5 text-right text-xs text-muted">{note.length}/500</p>
              </div>
            </div>

            <CouponInput 
              currentCoupon={couponCode} 
              subtotalAmount={preview?.subtotalAmount || 0}
              onApply={handleApplyCoupon} 
              onRemove={handleRemoveCoupon} 
              error={couponError} 
            />

            <div className="bg-surface rounded-2xl p-6 lg:p-7 border border-primary/10 shadow-sm shadow-primary/5 mb-6 lg:mb-0">
              <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" /> Phương thức thanh toán
              </h2>
              {preview?.paymentMethods && preview.paymentMethods.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {preview.paymentMethods.map(method => (
                    <label key={method} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method ? 'border-primary bg-primary-soft' : 'border-border-strong hover:border-primary'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method} 
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="w-5 h-5 text-primary focus:ring-0"
                      />
                      <span className="font-medium text-text">{method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : method}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-muted text-sm">Đang tải phương thức thanh toán...</div>
              )}
            </div>
          </div>

          {/* Right Column (Summary) */}
          <div className="w-full lg:w-[360px] xl:w-[400px] flex-shrink-0">
            <div className="bg-gradient-to-br from-surface to-primary-soft/10 rounded-2xl p-6 lg:p-7 border border-primary/20 shadow-sm shadow-primary/5 sticky top-[100px]">
              <h2 className="text-lg font-bold text-text mb-6">Chi tiết đơn hàng</h2>
              
              <div className="flex flex-col gap-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted">Tạm tính ({preview?.totalItems || 0} sản phẩm)</span>
                  <span className="font-bold text-text">{formatCurrency(preview?.subtotalAmount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Phí vận chuyển</span>
                  <span className="font-bold text-text">
                    {preview?.shippingFee === 0 ? <span className="text-success">Miễn phí</span> : formatCurrency(preview?.shippingFee || 0)}
                  </span>
                </div>
                {preview?.discountAmount ? (
                  <div className="flex justify-between text-success">
                    <span>Giảm giá</span>
                    <span className="font-bold">-{formatCurrency(preview.discountAmount)}</span>
                  </div>
                ) : null}
              </div>
              
              <div className="border-t border-border my-4"></div>
              
              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-text">Tổng thanh toán</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary">{formatCurrency(preview?.totalAmount || 0)}</span>
                  <p className="text-xs text-muted mt-1">Đã bao gồm VAT</p>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={submitting || loading || !selectedAddress || !paymentMethod}
                className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
