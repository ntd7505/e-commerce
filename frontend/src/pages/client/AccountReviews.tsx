import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Package, Pencil, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import AccountPageLayout from './components/account/AccountPageLayout';
import { ReviewFormModal } from '../../features/client/reviews/components/ReviewFormModal';
import { getOrders } from '../../features/client/orders/orderApi';
import { createReview } from '../../features/client/reviews/reviewApi';
import type { Order, OrderItem } from '../../features/client/orders/orderTypes';
import type { CreateReviewRequest, ProductReviewResponse } from '../../features/client/reviews/reviewTypes';
import { useToast } from '../../features/ui/ToastProvider';
import { parseApiError } from '../../utils/apiError';
import { formatDate, formatDateTime } from '../../utils/formatters';

type ReviewableItem = {
  orderItemId: number;
  orderId: number;
  productId: number;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  orderDate: string;
};

type TabKey = 'pending' | 'reviewed';

function orderToReviewableItems(order: Order): ReviewableItem[] {
  return order.items.map((item: OrderItem) => ({
    orderItemId: item.id,
    orderId: order.id,
    productId: item.productId,
    productName: item.productName,
    variantName: item.variantName,
    sku: item.sku,
    quantity: item.quantity,
    orderDate: order.createdAt,
  }));
}

function ReviewableCard({
  item,
  onReview,
}: {
  item: ReviewableItem;
  onReview: (item: ReviewableItem) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex gap-4">
        {/* TODO: Backend OrderItemResponse does not return thumbnailUrl yet. */}
        <Link
          to={`/products/${item.productId}`}
          className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden"
        >
          <Package className="w-7 h-7 text-gray-300" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${item.productId}`}
            className="font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors block"
          >
            {item.productName}
          </Link>
          <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">Phân loại: {item.variantName}</p>
          <p className="mt-0.5 text-xs text-gray-400">SKU: {item.sku} · SL: {item.quantity}</p>
          <p className="mt-0.5 text-xs text-gray-400">Đặt ngày {formatDate(item.orderDate)}</p>
        </div>
        <div className="flex flex-col justify-center">
          <button
            type="button"
            onClick={() => onReview(item)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Pencil className="w-4 h-4" />
            Viết đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewedCard({ review }: { review: ProductReviewResponse }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <Link
            to={`/products/${review.productId}`}
            className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 block"
          >
            {review.productName}
          </Link>
          <p className="mt-0.5 text-xs text-gray-400">
            {review.variantName ?? "—"} · SKU: {review.sku ?? "—"}
          </p>
        </div>
        {review.verifiedPurchase && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            <CheckCircle2 className="w-3 h-3" />
            Đã mua hàng
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${idx < review.rating ? "fill-current" : "fill-transparent text-gray-300"}`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">{formatDateTime(review.createdAt)}</span>
      </div>

      {review.title && <p className="font-semibold text-gray-900 mb-1">{review.title}</p>}
      {review.content && <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>}

      {review.media.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.media.map((m) => (
            <a
              key={m.id}
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className="block h-16 w-16 overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
            >
              {m.mediaType === "IMAGE" ? (
                <img src={m.url} alt="Review" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-gray-400">VIDEO</div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-100" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
          <div className="h-3 w-1/3 rounded bg-gray-100" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-gray-100 shrink-0" />
      </div>
    </div>
  );
}

export default function AccountReviews() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [reviewableItems, setReviewableItems] = useState<ReviewableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalItem, setModalItem] = useState<ReviewableItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewed, setReviewed] = useState<ProductReviewResponse[]>([]);

  const refresh = useCallback(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const orderPage = await getOrders({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'desc' });
        if (cancelled) return;
        const completed = orderPage.content.filter((o) => o.status === 'COMPLETED');
        setReviewableItems(completed.flatMap(orderToReviewableItems));
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load orders:', err);
        setError('Không thể tải danh sách sản phẩm cần đánh giá.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cancel = refresh();
    return cancel;
  }, [refresh]);

  function handleOpenReview(item: ReviewableItem) {
    setModalItem(item);
  }

  async function handleSubmitReview(payload: CreateReviewRequest) {
    if (!modalItem) return;
    try {
      setSubmitting(true);
      const created = await createReview(payload);
      showToast('Đã gửi đánh giá thành công.', 'success');
      setModalItem(null);
      // Move item out ofPending and add to reviewed locally
      setReviewableItems((prev) => prev.filter((item) => item.orderItemId !== modalItem.orderItemId));
      setReviewed((prev) => [created, ...prev]);
    } catch (err) {
      const detail = parseApiError(err);
      showToast(detail.message || 'Không thể gửi đánh giá.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const pendingEmpty = !loading && !error && reviewableItems.length === 0;
  const reviewedEmpty = !loading && reviewed.length === 0;

  return (
    <>
      <AccountPageLayout
        breadcrumbCurrent="Đánh giá sản phẩm"
        title="Đánh giá sản phẩm"
        description="Quản lý các sản phẩm bạn có thể đánh giá và các đánh giá đã gửi."
      >
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Chưa đánh giá
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviewed')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'reviewed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Đã đánh giá
          </button>
        </div>

        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        )}

        {/* Pending tab */}
        {activeTab === 'pending' && !error && (
          <div className="space-y-4">
            {loading && (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            )}
            {!loading && pendingEmpty && (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <CheckCircle2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Bạn chưa có sản phẩm nào cần đánh giá.</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  Sản phẩm từ đơn hàng hoàn tất sẽ xuất hiện tại đây để bạn đánh giá.
                </p>
                <Link
                  to="/products"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            )}
            {!loading && reviewableItems.length > 0 && (
              reviewableItems.map((item) => (
                <ReviewableCard key={item.orderItemId} item={item} onReview={handleOpenReview} />
              ))
            )}
          </div>
        )}

        {/* Reviewed tab */}
        {activeTab === 'reviewed' && !error && (
          <div className="space-y-4">
            {reviewedEmpty && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-6 py-5 max-w-md">
                  <div className="flex items-center justify-center mb-3">
                    <AlertCircle className="w-7 h-7 text-amber-500" />
                  </div>
                  <p className="text-sm font-semibold text-amber-700">
                    Chưa có API để tải danh sách đánh giá của bạn.
                  </p>
                  <p className="mt-1.5 text-xs text-amber-600/80">
                    Các đánh giá vừa gửi trong phiên hiện tại có thể được hiển thị tạm thời tại đây.
                  </p>
                </div>
              </div>
            )}
            {reviewed.length > 0 && (
              reviewed.map((review) => <ReviewedCard key={review.id} review={review} />)
            )}
          </div>
        )}
      </AccountPageLayout>

      <ReviewFormModal
        open={!!modalItem}
        productName={modalItem?.productName ?? ''}
        variantName={modalItem?.variantName ?? ''}
        orderItemId={modalItem?.orderItemId ?? null}
        submitting={submitting}
        onClose={() => setModalItem(null)}
        onSubmit={handleSubmitReview}
      />
    </>
  );
}