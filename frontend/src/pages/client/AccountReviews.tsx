import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Package, Pencil, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import AccountPageLayout from './components/account/AccountPageLayout';
import { ReviewFormModal } from '../../features/client/reviews/components/ReviewFormModal';
import { getOrders } from '../../features/client/orders/orderApi';
import { createReview, getMyReviews } from '../../features/client/reviews/reviewApi';
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
  productSlug?: string;
  thumbnailUrl?: string;
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
    productSlug: item.productSlug,
    thumbnailUrl: item.thumbnailUrl,
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
    <div className="bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex gap-4">
        <Link
          to={`/products/${item.productSlug || item.productId}`}
          className="w-16 h-16 md:w-20 md:h-20 bg-surface rounded-xl flex-shrink-0 flex items-center justify-center border border-border overflow-hidden"
        >
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-contain" />
          ) : (
            <Package className="w-7 h-7 text-subtle" />
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${item.productSlug || item.productId}`}
            className="font-bold text-text line-clamp-1 hover:text-primary transition-colors block"
          >
            {item.productName}
          </Link>
          <p className="mt-0.5 text-sm text-muted line-clamp-1">Phân loại: {item.variantName}</p>
          <p className="mt-0.5 text-xs text-muted">SKU: {item.sku} · SL: {item.quantity}</p>
          <p className="mt-0.5 text-xs text-muted">Đặt ngày {formatDate(item.orderDate)}</p>
        </div>
        <div className="flex flex-col justify-center">
          <button
            type="button"
            onClick={() => onReview(item)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors whitespace-nowrap"
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
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {review.thumbnailUrl ? (
            <img src={review.thumbnailUrl} alt={review.productName} className="w-12 h-12 object-cover rounded bg-canvas border border-border shrink-0" />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-canvas border border-border rounded shrink-0">
              <Package className="w-6 h-6 text-muted" />
            </div>
          )}
          <div className="min-w-0">
            <Link
              to={`/products/${review.productSlug || review.productId}`}
              className="font-bold text-text hover:text-primary transition-colors line-clamp-1 block"
            >
              {review.productName}
            </Link>
            <p className="mt-0.5 text-xs text-muted">
              {review.variantName ?? "—"} • SKU: {review.sku ?? "—"}
            </p>
          </div>
        </div>
        {review.verifiedPurchase && (
          <span className="inline-flex items-center gap-1 rounded-full border border-success-soft bg-success-soft px-2.5 py-1 text-xs font-bold text-success shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            Đã mua hàng
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-0.5 text-warning">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${idx < review.rating ? "fill-current" : "fill-transparent text-subtle"}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted">{formatDateTime(review.createdAt)}</span>
      </div>

      {review.title && <p className="font-semibold text-text mb-1">{review.title}</p>}
      {review.content && <p className="text-sm text-muted leading-relaxed">{review.content}</p>}

      {review.media.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.media.map((m) => (
            <a
              key={m.id}
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className="block h-16 w-16 overflow-hidden rounded-lg border border-border bg-surface"
            >
              {m.mediaType === "IMAGE" ? (
                <img src={m.url} alt="Review" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted">VIDEO</div>
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
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-surface-alt shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-surface-alt" />
          <div className="h-3 w-1/2 rounded bg-surface-alt" />
          <div className="h-3 w-1/3 rounded bg-surface-alt" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-surface-alt shrink-0" />
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

        const reviewPage = await getMyReviews({ page: 0, size: 50 });
        if (cancelled) return;
        setReviewed(reviewPage.content);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load:', err);
        setError('Không thể tải dữ liệu.');
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
        <div className="flex gap-6 border-b border-border mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            Chưa đánh giá
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviewed')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'reviewed'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            Đã đánh giá
          </button>
        </div>

        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 bg-danger-soft text-danger rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <p className="text-danger font-medium mb-4">{error}</p>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
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
              <div className="flex flex-col items-center justify-center py-16 text-center bg-surface/50 rounded-2xl border border-border border-dashed">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center shadow-sm mb-4">
                  <CheckCircle2 className="w-8 h-8 text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-1">Bạn chưa có sản phẩm nào cần đánh giá.</h3>
                <p className="text-muted max-w-sm mx-auto mb-6">
                  Sản phẩm từ đơn hàng hoàn tất sẽ xuất hiện tại đây để bạn đánh giá.
                </p>
                <Link
                  to="/products"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
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
              <div className="flex flex-col items-center justify-center py-12 text-center bg-surface/50 rounded-2xl border border-border border-dashed">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Star className="w-8 h-8 text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-1">Bạn chưa có đánh giá nào.</h3>
                <p className="text-muted max-w-sm mx-auto mb-6">
                  Những đánh giá của bạn sẽ xuất hiện tại đây.
                </p>
                <button
                  onClick={() => setActiveTab('pending')}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
                >
                  Đánh giá sản phẩm ngay
                </button>
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