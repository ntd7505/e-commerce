import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../../features/client/orders/orderApi';
import type { Order } from '../../features/client/orders/orderTypes';
import { getPaymentMethodLabel } from '../../features/client/orders/orderTypes';
import { formatCurrency } from '../../utils/formatters';
import { Check } from 'lucide-react';
import { LoadingState, ErrorState } from '../../components/common/States';

export default function CheckoutSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrderById(orderId);
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

          {order.payment?.method === 'BANK_TRANSFER' && order.payment?.status === 'UNPAID' && order.payment?.qrCodeUrl && (
            <div className="bg-primary-soft/30 rounded-xl p-6 text-left mb-8 border border-primary/20">
              <h3 className="font-bold text-text mb-4 text-center border-b border-primary/10 pb-4">Hướng dẫn thanh toán chuyển khoản</h3>
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-sm border border-border">
                  <img src={order.payment.qrCodeUrl} alt="Mã QR Thanh Toán" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Ngân hàng:</span>
                    <span className="font-bold text-text">{order.payment.bankCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Số tài khoản:</span>
                    <span className="font-bold text-text">{order.payment.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Tên tài khoản:</span>
                    <span className="font-bold text-text">{order.payment.bankAccountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Số tiền:</span>
                    <span className="font-bold text-primary text-lg">{formatCurrency(order.payment.amount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-primary/10">
                    <span className="text-muted">Nội dung chuyển khoản:</span>
                    <span className="font-bold text-text">{order.payment.transferContent || order.id}</span>
                  </div>
                  <div className="mt-4 text-xs text-warning font-medium italic text-center">
                    Admin sẽ xác nhận sau khi nhận được chuyển khoản.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-surface rounded-xl p-6 text-left mb-8 border border-border">
            <h3 className="font-bold text-text mb-4 border-b border-border-strong pb-2">Thông tin đơn hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted block mb-1">Mã đơn hàng</span>
                <span className="font-bold text-text">{order.id}</span>
              </div>
              <div>
                <span className="text-muted block mb-1">Tổng tiền</span>
                <span className="font-bold text-primary text-lg">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div>
                <span className="text-muted block mb-1">Phương thức thanh toán</span>
                <span className="font-medium text-text">{order.payment ? getPaymentMethodLabel(order.payment.method) : 'N/A'}</span>
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
