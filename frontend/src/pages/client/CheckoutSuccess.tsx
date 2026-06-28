import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cartApi } from '../../features/client/cart/cartApi';
import type { OrderBasicResponse } from '../../features/client/cart/cartTypes';
import { formatCurrency } from '../../utils/formatters';
import { Check } from 'lucide-react';
import { LoadingState, ErrorState } from '../../components/common/States';

export default function CheckoutSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderBasicResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await cartApi.getOrderBasic(orderId);
        setOrder(data);
      } catch {
        setError('Không thể lấy thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    void fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><LoadingState /></div>;
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ErrorState message={error || 'Không tìm thấy đơn hàng'} />
        <Link to="/" className="text-primary font-bold hover:underline">Về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="bg-canvas min-h-screen py-10 md:py-20">
      <div className="max-w-[800px] mx-auto w-full px-4">
        <div className="bg-surface rounded-2xl p-8 md:p-12 border border-border shadow-sm text-center">
          <div className="w-24 h-24 bg-green-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12" strokeWidth={3} />
          </div>
          
          <h1 className="text-wrap-balance text-2xl md:text-3xl font-black text-text mb-2">Đặt hàng thành công!</h1>
          <p className="text-muted mb-8">
            Cảm ơn bạn đã tin tưởng và mua sắm tại NexaMart. Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.
          </p>

          <div className="bg-surface rounded-xl p-6 text-left mb-8 border border-border">
            <h3 className="font-bold text-text mb-4 border-b border-border-strong pb-2">Thông tin đơn hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted block mb-1">Mã đơn hàng</span>
                <span className="font-bold text-text">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-muted block mb-1">Tổng tiền</span>
                <span className="font-bold text-primary text-lg">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div>
                <span className="text-muted block mb-1">Phương thức thanh toán</span>
                <span className="font-medium text-text">COD (Thanh toán khi nhận hàng)</span>
              </div>
              <div>
                <span className="text-muted block mb-1">Thời gian đặt</span>
                <span className="font-medium text-text">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/account" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary-soft transition-colors"
            >
              Theo dõi đơn hàng
            </Link>
            <Link 
              to="/" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
