import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Receipt,
  Tag,
  Package,
  XCircle,
  CheckCircle2,
  Check,
  Clock,
  Truck,
  PackageCheck,
  PartyPopper,
  Loader2,
  Star,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import AccountSidebar from './components/account/AccountSidebar';
import { useOrderDetail } from '../../features/client/orders/hooks/useOrderDetail';
import {
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE,
  canCancelDirect,
  canRequestCancel,
  canConfirmReceived,
  canReview,
  getPaymentMethodLabel,
} from '../../features/client/orders/orderTypes';
import type { OrderStatus } from '../../features/client/orders/orderTypes';
import { OrderStatusBadge, PaymentStatusBadge } from '../../features/client/orders/components/OrderStatusBadge';
import { CancelOrderModal } from '../../features/client/orders/components/CancelOrderModal';
import { ConfirmDialog } from '../../features/client/orders/components/ConfirmDialog';
import { useToast } from '../../features/ui/ToastProvider';
import { formatVnd, formatDateTime } from '../../utils/formatters';

const timelineIcons: Record<OrderStatus, typeof Clock> = {
  PENDING: Clock,
  CONFIRMED: Check,
  PROCESSING: PackageCheck,
  SHIPPING: Truck,
  DELIVERED: PackageCheck,
  COMPLETED: PartyPopper,
  CANCELLED: XCircle,
  RETURNED: RotateCcw,
};

function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex flex-col items-center gap-2 min-w-[80px] shrink-0">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-gray-800 text-center leading-tight">Đặt hàng</span>
        </div>
        <div className="h-1 w-8 sm:w-14 rounded-full bg-red-300 mt-[-18px]" />
        <div className="flex flex-col items-center gap-2 min-w-[80px] shrink-0">
          <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center ring-4 ring-red-100">
            <XCircle className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-red-700 text-center leading-tight">Đã hủy</span>
        </div>
      </div>
    );
  }

  if (status === 'RETURNED') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 border border-gray-200">
        <div className="w-9 h-9 rounded-full bg-gray-500 text-white flex items-center justify-center shrink-0">
          <RotateCcw className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700">Đơn hàng đã được trả lại</p>
          <p className="text-xs text-gray-500">Vui lòng liên hệ shop để được hỗ trợ hoàn tiền.</p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_TIMELINE.indexOf(status);

  return (
    <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-hide">
      {ORDER_TIMELINE.map((step, index) => {
        const Icon = timelineIcons[step];
        const isDone = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === ORDER_TIMELINE.length - 1;
        return (
          <div key={step} className="flex items-center gap-1 shrink-0">
            <div className="flex flex-col items-center gap-2 min-w-[64px]">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isDone
                    ? isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-semibold text-center leading-tight ${
                  isDone ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-1 w-6 sm:w-10 rounded-full mt-[-18px] ${
                  index < currentIndex ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InfoRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right break-words">{value}</span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-2xl bg-gray-100" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-48 rounded-2xl bg-gray-100" />
        <div className="h-48 rounded-2xl bg-gray-100" />
      </div>
      <div className="h-64 rounded-2xl bg-gray-100" />
      <div className="h-40 rounded-2xl bg-gray-100" />
    </div>
  );
}

// TODO: Backend OrderItemResponse chưa trả imageUrl - tạm dùng placeholder icon Package.
function ProductThumb() {
  return (
    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
      <Package className="w-5 h-5 text-gray-400" />
    </div>
  );
}

export default function AccountOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { order, loading, error, actionLoading, refetch, cancel, requestCancel, confirmReceived } =
    useOrderDetail(id);

  const [modalMode, setModalMode] = useState<'cancel' | 'cancel_request' | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const orderId = id ?? '';

  async function handleSubmitReason(reason: string) {
    if (!order) return;
    if (modalMode === 'cancel') {
      const ok = await cancel(reason);
      if (ok) {
        showToast(`Đơn hàng #${order.id} đã được hủy.`, 'success');
        setModalMode(null);
      } else {
        showToast('Không thể hủy đơn hàng. Vui lòng thử lại.', 'error');
      }
      return;
    }
    if (modalMode === 'cancel_request') {
      const ok = await requestCancel(reason);
      if (ok) {
        showToast(`Đã gửi yêu cầu hủy đơn hàng #${order.id}.`, 'success');
        setModalMode(null);
      } else {
        showToast('Không thể gửi yêu cầu hủy. Vui lòng thử lại.', 'error');
      }
    }
  }

  async function handleConfirmReceipt() {
    if (!order) return;
    const ok = await confirmReceived();
    if (ok) {
      showToast(`Đã xác nhận nhận đơn hàng #${order.id}.`, 'success');
      setReceiptOpen(false);
    } else {
      showToast('Không thể xác nhận nhận hàng. Vui lòng thử lại.', 'error');
    }
  }

  function handleReview() {
    // TODO: Chưa có route đánh giá sản phẩm - điều hướng khi màn review được build.
    showToast('Tính năng đánh giá sẽ ra mắt soon.', 'success');
  }

  return (
    <div className="bg-[#f5f7fb] min-h-screen py-8">
      <div className="container-custom">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Trang chủ</Link>
          <span className="text-gray-400">/</span>
          <Link to="/account" className="hover:text-blue-600 transition-colors font-medium">Tài khoản</Link>
          <span className="text-gray-400">/</span>
          <Link to="/account/orders" className="hover:text-blue-600 transition-colors font-medium">Đơn hàng</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">Chi tiết đơn hàng</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <AccountSidebar />

          <div className="flex-1 w-full">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl lg:text-3xl font-black text-gray-900">Chi tiết đơn hàng</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <span className="text-sm font-bold text-gray-900">#{orderId}</span>
                    {order && <span className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</span>}
                  </div>
                  {order && (
                    <div className="flex items-center gap-2 mt-3">
                      <OrderStatusBadge status={order.status} />
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3">
                  {order && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Tổng tiền</p>
                      <p className="text-2xl lg:text-3xl font-black text-blue-600">{formatVnd(order.totalAmount)}</p>
                    </div>
                  )}
                  <Link
                    to="/account/orders"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách
                  </Link>
                </div>
              </div>
            </div>

            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <DetailSkeleton />
              </div>
            )}

            {!loading && error && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <p className="text-red-600 font-medium mb-4">{error}</p>
                  <button
                    onClick={refetch}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && order && (
              <div className="space-y-6">
                {/* Timeline */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Trạng thái đơn hàng</h2>
                  <OrderTimeline status={order.status} />
                </div>

                {/* Shipping + Payment */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-7">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-bold text-gray-900">Thông tin giao hàng</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <InfoRow label="Người nhận" value={order.recipientName} />
                      <InfoRow label="Số điện thoại" value={order.phoneNumber} />
                      <InfoRow label="Địa chỉ giao hàng" value={order.shippingAddress} />
                      {order.note && <InfoRow label="Ghi chú" value={order.note} />}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-7">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-bold text-gray-900">Phương thức thanh toán</h2>
                    </div>
                    {order.payment ? (
                      <div className="divide-y divide-gray-100">
                        <InfoRow label="Phương thức" value={getPaymentMethodLabel(order.payment.method)} />
                        <InfoRow label="Trạng thái" value={<PaymentStatusBadge status={order.payment.status} />} />
                        <InfoRow label="Số tiền" value={formatVnd(order.payment.amount)} />
                        {order.payment.transactionCode && (
                          <InfoRow label="Mã giao dịch" value={order.payment.transactionCode} />
                        )}
                        {order.payment.paidAt && (
                          <InfoRow label="Thời gian thanh toán" value={formatDateTime(order.payment.paidAt)} />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-4">Chưa có thông tin thanh toán.</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center gap-2 p-6 lg:p-7 pb-4 border-b border-gray-100">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">Sản phẩm trong đơn</h2>
                  </div>
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 lg:px-7 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/60">
                    <div className="col-span-6">Sản phẩm</div>
                    <div className="col-span-2 text-center">Đơn giá</div>
                    <div className="col-span-1 text-center">SL</div>
                    <div className="col-span-3 text-right">Thành tiền</div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 gap-3 md:gap-4 px-6 lg:px-7 py-4 items-center"
                      >
                        <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                          <ProductThumb />
                          <div className="min-w-0">
                            <Link
                              to={`/products/${item.productId}`}
                              className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-xs text-gray-500 truncate">
                              {item.variantName} · SKU: {item.sku}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-4 md:col-span-2 text-sm text-gray-700 md:text-center">
                          <span className="md:hidden text-xs text-gray-400 mr-1">Đơn giá:</span>
                          {formatVnd(item.unitPrice)}
                        </div>
                        <div className="col-span-2 md:col-span-1 text-sm text-gray-700 md:text-center">
                          <span className="md:hidden text-xs text-gray-400 mr-1">SL:</span>
                          {item.quantity}
                        </div>
                        <div className="col-span-6 md:col-span-3 text-sm font-bold text-gray-900 text-right">
                          {formatVnd(item.lineTotal)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-7">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">Tổng kết đơn hàng</h2>
                  </div>
                  <div className="max-w-md ml-auto space-y-2.5">
                    <InfoRow label="Tạm tính" value={formatVnd(order.subtotalAmount)} />
                    <InfoRow label="Phí vận chuyển" value={formatVnd(order.shippingFee)} />
                    {order.discountAmount > 0 && (
                      <InfoRow
                        label={
                          <span className="inline-flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                            Giảm giá{order.couponCode ? ` (${order.couponCode})` : ''}
                          </span>
                        }
                        value={<span className="text-emerald-600">-{formatVnd(order.discountAmount)}</span>}
                      />
                    )}
                    {order.couponCode && order.discountAmount === 0 && (
                      <InfoRow label="Mã giảm giá" value={order.couponCode} />
                    )}
                    <div className="flex items-center justify-between gap-4 pt-3 mt-2 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-700">Tổng cộng</span>
                      <span className="text-2xl lg:text-3xl font-black text-blue-600">{formatVnd(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to="/account/orders"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách
                  </Link>
                  <div className="flex flex-wrap items-center gap-2">
                    {canCancelDirect(order) && (
                      <button
                        type="button"
                        onClick={() => setModalMode('cancel')}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4" />
                        Hủy đơn
                      </button>
                    )}
                    {canRequestCancel(order) && (
                      <button
                        type="button"
                        onClick={() => setModalMode('cancel_request')}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Yêu cầu hủy
                      </button>
                    )}
                    {canConfirmReceived(order) && (
                      <button
                        type="button"
                        onClick={() => setReceiptOpen(true)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        {actionLoading ? 'Đang xử lý...' : 'Tôi đã nhận hàng'}
                      </button>
                    )}
                    {canReview(order) && (
                      <button
                        type="button"
                        onClick={handleReview}
                        disabled
                        title="Tính năng đánh giá sẽ ra mắt soon"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-gray-50 cursor-not-allowed"
                      >
                        <Star className="w-4 h-4" />
                        Đánh giá
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CancelOrderModal
        open={modalMode !== null}
        title={modalMode === 'cancel_request' ? `Yêu cầu hủy đơn hàng #${orderId}` : `Hủy đơn hàng #${orderId}`}
        description={
          modalMode === 'cancel_request'
            ? 'Yêu cầu hủy của bạn sẽ được gửi đến shop để xem xét và phê duyệt.'
            : 'Đơn hàng sẽ được hủy ngay sau khi bạn xác nhận. Hành động này không thể hoàn tác.'
        }
        submitLabel={modalMode === 'cancel_request' ? 'Gửi yêu cầu hủy' : 'Xác nhận hủy đơn'}
        loading={actionLoading}
        onClose={() => setModalMode(null)}
        onSubmit={handleSubmitReason}
      />

      <ConfirmDialog
        open={receiptOpen}
        title={`Xác nhận đã nhận đơn hàng #${orderId}`}
        description="Đơn hàng sẽ được chuyển sang trạng thái hoàn tất sau khi bạn xác nhận."
        confirmLabel="Tôi đã nhận hàng"
        tone="success"
        icon={CheckCircle2}
        loading={actionLoading}
        onClose={() => setReceiptOpen(false)}
        onConfirm={handleConfirmReceipt}
      />
    </div>
  );
}
