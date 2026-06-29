import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Package,
  XCircle,
  CheckCircle2,
  Search,
  Star,
  AlertTriangle,
} from 'lucide-react';
import AccountPageLayout from './components/account/AccountPageLayout';
import { useOrders } from '../../features/client/orders/hooks/useOrders';
import {
  ORDER_FILTER_TABS,
  canCancelDirect,
  canRequestCancel,
  canConfirmReceived,
  canReview,
} from '../../features/client/orders/orderTypes';
import type { Order, OrderTabKey } from '../../features/client/orders/orderTypes';
import { OrderStatusBadge, PaymentStatusBadge } from '../../features/client/orders/components/OrderStatusBadge';
import { CancelOrderModal } from '../../features/client/orders/components/CancelOrderModal';
import { ConfirmDialog } from '../../features/client/orders/components/ConfirmDialog';
import { cancelOrder, requestCancelOrder, confirmReceipt } from '../../features/client/orders/orderApi';
import { useToast } from '../../features/ui/ToastProvider';
import { parseApiError } from '../../utils/apiError';
import { formatVnd, formatDateTime } from '../../utils/formatters';

function OrderCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-surface-alt" />
          <div className="h-3 w-32 rounded bg-surface-alt" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-24 rounded-full bg-surface-alt" />
          <div className="h-6 w-24 rounded-full bg-surface-alt" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-14 w-full rounded-xl bg-surface-alt" />
        <div className="h-14 w-full rounded-xl bg-surface-alt" />
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="h-4 w-24 rounded bg-surface-alt" />
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded-xl bg-surface-alt" />
          <div className="h-9 w-28 rounded-xl bg-surface-alt" />
        </div>
      </div>
    </div>
  );
}

// TODO: Backend OrderItemResponse chưa trả imageUrl - tạm dùng placeholder icon Package.
function ProductThumb() {
  return (
    <div className="w-12 h-12 rounded-lg bg-surface-alt flex items-center justify-center shrink-0">
      <Package className="w-5 h-5 text-muted" />
    </div>
  );
}

function OrderCard({
  order,
  onCancel,
  onRequestCancel,
  onConfirmReceipt,
  onReview,
  receiptLoading,
}: {
  order: Order;
  onCancel: (order: Order) => void;
  onRequestCancel: (order: Order) => void;
  onConfirmReceipt: (order: Order) => void;
  onReview: (order: Order) => void;
  receiptLoading: boolean;
}) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const previewItems = order.items.slice(0, 3);
  const remaining = order.items.length - previewItems.length;

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border bg-surface-alt/40">
        <div className="flex flex-col">
          <Link
            to={`/account/orders/${order.id}`}
            className="text-sm font-bold text-text hover:text-primary transition-colors"
          >
            Đơn hàng #{order.id}
          </Link>
          <span className="text-xs text-muted">{formatDateTime(order.createdAt)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="p-5 space-y-3">
        {previewItems.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.productId}`}
            className="flex items-center gap-3 rounded-xl p-2 -mx-2 hover:bg-primary-soft/40 transition-colors"
          >
            <ProductThumb />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text truncate">{item.productName}</p>
              <p className="text-xs text-muted truncate">
                {item.variantName} · SKU: {item.sku} · SL: {item.quantity}
              </p>
              <p className="text-xs text-muted truncate">Đơn giá: {formatVnd(item.unitPrice)}</p>
            </div>
            <span className="text-sm font-semibold text-text shrink-0">{formatVnd(item.lineTotal)}</span>
          </Link>
        ))}
        {remaining > 0 && (
          <p className="text-xs text-muted pl-2">+{remaining} sản phẩm khác</p>
        )}
        <p className="text-xs text-muted pl-2 pt-1">
          Tổng cộng <span className="font-semibold text-text">{totalItems}</span> sản phẩm · {order.items.length} loại
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-border">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted">Tổng tiền</span>
          <span className="text-base font-bold text-primary">{formatVnd(order.totalAmount)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canCancelDirect(order) && (
            <button
              type="button"
              onClick={() => onCancel(order)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-danger bg-danger-soft hover:bg-danger/20 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Hủy đơn
            </button>
          )}
          {canRequestCancel(order) && (
            <button
              type="button"
              onClick={() => onRequestCancel(order)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-warning bg-warning-soft hover:bg-warning/20 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Yêu cầu hủy
            </button>
          )}
          {canConfirmReceived(order) && (
            <button
              type="button"
              onClick={() => onConfirmReceipt(order)}
              disabled={receiptLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-success bg-success-soft hover:bg-success/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              {receiptLoading ? 'Đang xử lý...' : 'Đã nhận hàng'}
            </button>
          )}
          {canReview(order) && (
            <button
              type="button"
              onClick={() => onReview(order)}
              disabled
              title="Tính năng đánh giá sẽ ra mắt soon"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-muted bg-surface cursor-not-allowed"
            >
              <Star className="w-4 h-4" />
              Đánh giá
            </button>
          )}
          <Link
            to={`/account/orders/${order.id}`}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            Xem chi tiết
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AccountOrders() {
  const { showToast } = useToast();
  const {
    filteredOrders,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    loading,
    error,
    page,
    totalPages,
    first,
    last,
    nextPage,
    prevPage,
    refresh,
  } = useOrders(10);

  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [cancelMode, setCancelMode] = useState<'cancel' | 'request'>('cancel');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [receiptTarget, setReceiptTarget] = useState<Order | null>(null);
  const [receiptLoadingId, setReceiptLoadingId] = useState<number | null>(null);

  function openCancel(order: Order) {
    setCancelTarget(order);
    setCancelMode('cancel');
  }

  function openRequestCancel(order: Order) {
    setCancelTarget(order);
    setCancelMode('request');
  }

  async function submitCancel(reason: string) {
    if (!cancelTarget) return;
    const target = cancelTarget;
    try {
      setCancelLoading(true);
      if (cancelMode === 'cancel') {
        await cancelOrder(target.id, reason);
        showToast(`Đơn hàng #${target.id} đã được hủy.`, 'success');
      } else {
        await requestCancelOrder(target.id, reason);
        showToast(`Đã gửi yêu cầu hủy đơn hàng #${target.id}.`, 'success');
      }
      setCancelTarget(null);
      refresh();
    } catch (err) {
      showToast(parseApiError(err).message || 'Không thể thực hiện yêu cầu.', 'error');
    } finally {
      setCancelLoading(false);
    }
  }

  async function handleConfirmReceipt() {
    if (!receiptTarget) return;
    const target = receiptTarget;
    try {
      setReceiptLoadingId(target.id);
      await confirmReceipt(target.id);
      showToast(`Đã xác nhận nhận đơn hàng #${target.id}.`, 'success');
      setReceiptTarget(null);
      refresh();
    } catch (err) {
      showToast(parseApiError(err).message || 'Không thể xác nhận nhận hàng.', 'error');
    } finally {
      setReceiptLoadingId(null);
    }
  }

  function handleReview(order: Order) {
    showToast(`Đánh giá đơn hàng #${order.id} sẽ ra mắt soon.`, 'success');
  }

  const noResultsInTab = !loading && !error && filteredOrders.length === 0;

  return (
    <>
      <AccountPageLayout
        breadcrumbCurrent="Đơn hàng của tôi"
        title="Đơn hàng của tôi"
        description="Theo dõi trạng thái, xem chi tiết và quản lý đơn hàng của bạn."
      >
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn hoặc tên sản phẩm"
            className="w-full rounded-xl border border-border-strong bg-surface/60 pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary-soft"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {ORDER_FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as OrderTabKey)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                  isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-muted border-border-strong hover:border-primary hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-4">
          {loading && (
            <>
              <OrderCardSkeleton />
              <OrderCardSkeleton />
              <OrderCardSkeleton />
            </>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-danger-soft text-danger rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-7 h-7" />
              </div>
              <p className="text-danger font-medium mb-4">{error}</p>
              <button
                onClick={refresh}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                Thử lại
              </button>
            </div>
          )}

          {noResultsInTab && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-surface/50 rounded-2xl border border-border border-dashed">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center shadow-sm mb-4">
                <Package className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-1">Bạn chưa có đơn hàng nào</h3>
              <p className="text-muted max-w-sm mx-auto mb-6">
                {activeTab === 'ALL' && search.trim() === ''
                  ? 'Các đơn hàng bạn đặt sẽ xuất hiện tại đây.'
                  : 'Không có đơn hàng nào phù hợp với bộ lọc hiện tại.'}
              </p>
              <Link
                to="/products"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={openCancel}
                onRequestCancel={openRequestCancel}
                onConfirmReceipt={setReceiptTarget}
                onReview={handleReview}
                receiptLoading={receiptLoadingId === order.id}
              />
            ))
          )}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-border">
            <button
              onClick={prevPage}
              disabled={first}
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border-strong text-sm font-semibold text-muted hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </button>
            <span className="text-sm text-muted font-medium">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={last}
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border-strong text-sm font-semibold text-muted hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </AccountPageLayout>

      <CancelOrderModal
        open={!!cancelTarget}
        title={
          cancelMode === 'request'
            ? `Yêu cầu hủy đơn hàng #${cancelTarget?.id ?? ''}`
            : `Hủy đơn hàng #${cancelTarget?.id ?? ''}`
        }
        description={
          cancelMode === 'request'
            ? 'Yêu cầu hủy của bạn sẽ được gửi đến shop để xem xét và phê duyệt.'
            : 'Đơn hàng sẽ được hủy ngay sau khi bạn xác nhận. Hành động này không thể hoàn tác.'
        }
        submitLabel={cancelMode === 'request' ? 'Gửi yêu cầu hủy' : 'Xác nhận hủy đơn'}
        loading={cancelLoading}
        onClose={() => setCancelTarget(null)}
        onSubmit={submitCancel}
      />

      <ConfirmDialog
        open={!!receiptTarget}
        title={`Xác nhận đã nhận đơn hàng #${receiptTarget?.id ?? ''}`}
        description="Đơn hàng sẽ được chuyển sang trạng thái hoàn tất sau khi bạn xác nhận."
        confirmLabel="Tôi đã nhận hàng"
        tone="success"
        icon={CheckCircle2}
        loading={receiptLoadingId === receiptTarget?.id}
        onClose={() => setReceiptTarget(null)}
        onConfirm={handleConfirmReceipt}
      />
    </>
  );
}
