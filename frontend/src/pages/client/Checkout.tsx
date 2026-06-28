import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../../features/client/cart/cartApi';
import type { CheckoutPreviewResponse, AddressResponse } from '../../features/client/cart/cartTypes';
import AddressSelector from './components/checkout/AddressSelector';
import CouponInput from './components/checkout/CouponInput';
import { formatCurrency } from '../../utils/formatters';
import { LoadingState } from '../../components/common/States';
import { useCart } from '../../features/client/cart/CartProvider';
import { Box, CreditCard, Loader2 } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<CheckoutPreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Draft state
  const [cartItemIds, setCartItemIds] = useState<number[]>([]);
  const [preferredAddressId, setPreferredAddressId] = useState<number | undefined>(undefined);
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    const draftStr = sessionStorage.getItem('checkoutDraft');
    if (!draftStr) {
      navigate('/cart', { replace: true });
      return;
    }
    try {
      const draft = JSON.parse(draftStr);
      if (!draft.cartItemIds || draft.cartItemIds.length === 0) {
        navigate('/cart', { replace: true });
        return;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartItemIds(draft.cartItemIds);
      if (draft.addressId) setPreferredAddressId(draft.addressId);
      if (draft.couponCode) setCouponCode(draft.couponCode);
    } catch {
      navigate('/cart', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (cartItemIds.length === 0) return;
    
    const fetchPreview = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await cartApi.previewCheckout({
          cartItemIds: cartItemIds,
          addressId: selectedAddress?.id,
          couponCode: couponCode || undefined
        });
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
  }, [cartItemIds, selectedAddress, couponCode, paymentMethod]);

  const handleApplyCoupon = async (code: string) => {
    setCouponError(null);
    try {
      await cartApi.previewCheckout({
        cartItemIds,
        addressId: selectedAddress?.id,
        couponCode: code
      });
      setCouponCode(code);
      // save to session
      const draftStr = sessionStorage.getItem('checkoutDraft');
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        sessionStorage.setItem('checkoutDraft', JSON.stringify({ ...draft, couponCode: code }));
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setCouponError(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponError(null);
    setCouponCode(null);
    const draftStr = sessionStorage.getItem('checkoutDraft');
    if (draftStr) {
      const draft = JSON.parse(draftStr);
      delete draft.couponCode;
      sessionStorage.setItem('checkoutDraft', JSON.stringify(draft));
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng.');
      return;
    }
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await cartApi.createOrder({
        cartItemIds,
        addressId: selectedAddress.id,
        couponCode: couponCode || undefined,
        paymentMethod,
        note
      });
      
      sessionStorage.removeItem('checkoutDraft');
      await refreshCart();
      navigate(`/checkout/success/${order.id}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  if (cartItemIds.length === 0) return null; // Wait for redirect

  return (
    <div className="bg-canvas min-h-screen pb-20">
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
              onSelect={setSelectedAddress}
              preferredAddressId={preferredAddressId}
            />

            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm mb-6">
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

              <div className="mt-6 rounded-xl bg-surface/60 border border-border p-4">
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
              onApply={handleApplyCoupon} 
              onRemove={handleRemoveCoupon} 
              error={couponError} 
            />

            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm mb-6 lg:mb-0">
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
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm sticky top-[100px]">
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
