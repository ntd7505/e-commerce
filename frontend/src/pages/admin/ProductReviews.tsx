import { Eye, EyeOff, RefreshCw, Search, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../../features/ui/ToastProvider";
import { AdminImage } from "../../components/admin/AdminImage";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { Badge, Button, Container, Section } from "../../components/common";
import {
  deleteProductReview,
  getProductReviews,
  moderateProductReview,
} from "../../features/admin/reviews/adminProductReviewApi";
import type { ProductReviewResponse } from "../../features/admin/reviews/adminProductReviewTypes";

type RatingFilter = "ALL" | "5" | "4" | "3" | "2" | "1";

export default function ProductReviews() {
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("ALL");
  const [actionId, setActionId] = useState<number | null>(null);
  const { showToast } = useToast();

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");
      setReviews(await getProductReviews());
    } catch (error) {
      console.error("Failed to load product reviews:", error);
      setError("Không thể tải danh sách đánh giá.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(review: ProductReviewResponse) {
    try {
      setActionId(review.id);
      const updated = await moderateProductReview(review.id, {
        active: !review.active,
      });
      setReviews((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      console.error("Failed to update review moderation:", error);
      showToast("Không thể cập nhật trạng thái đánh giá.", "error");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(review: ProductReviewResponse) {
    if (!window.confirm(`Xóa đánh giá #${review.id}?`)) {
      return;
    }

    try {
      setActionId(review.id);
      await deleteProductReview(review.id);
      setReviews((prev) => prev.filter((item) => item.id !== review.id));
    } catch (error) {
      console.error("Failed to delete review:", error);
      showToast("Không thể xóa đánh giá.", "error");
    } finally {
      setActionId(null);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial load
    void loadReviews();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const keyword = searchTerm.toLowerCase();
    const matchesKeyword =
      (review.productName ?? "").toLowerCase().includes(keyword) ||
      (review.title ?? "").toLowerCase().includes(keyword) ||
      (review.content ?? "").toLowerCase().includes(keyword) ||
      (review.user?.fullName ?? "").toLowerCase().includes(keyword);

    if (!matchesKeyword) return false;
    if (ratingFilter !== "ALL") return Number(review.rating) === Number(ratingFilter);
    return true;
  });

  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + (Number(review.rating) || 0), 0) / reviews.length
    : 0;

  const ratingOptions: Array<{ label: string; value: RatingFilter }> = [
    { label: "Tất cả", value: "ALL" },
    { label: "5 sao", value: "5" },
    { label: "4 sao", value: "4" },
    { label: "3 sao", value: "3" },
    { label: "2 sao", value: "2" },
    { label: "1 sao", value: "1" },
  ];

  return (
    <Container size="wide">
      <Section spacing="md" className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Đánh giá sản phẩm</h1>
            <p className="mt-1 text-sm font-medium text-muted">Quản lý đánh giá của khách hàng bằng API admin.</p>
          </div>
          <Button
            variant="secondary"
            onClick={loadReviews}
            disabled={loading}
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
          >
            Tải lại
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="animate-fade-in-up" style={{ animationDelay: '50ms' }}><AdminStatCard label="Đánh giá" value={reviews.length} /></div>
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}><AdminStatCard label="Trung bình" value={averageRating.toFixed(1)} /></div>
          <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}><AdminStatCard label="Có media" value={reviews.filter((review) => (review.media ?? []).length > 0).length} /></div>
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}><AdminStatCard label="Đang hiển thị" value={reviews.filter((review) => review.active).length} /></div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-alt p-5 rounded-t-xl">
            <div>
              <h3 className="font-bold text-text">Danh sách đánh giá</h3>
              <p className="mt-1 text-xs font-medium text-muted">Hiển thị {filteredReviews.length} / {reviews.length} đánh giá</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-lg border border-border-strong bg-surface p-1 shadow-inner">
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRatingFilter(option.value)}
                    className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                      ratingFilter === option.value ? "bg-surface-alt text-primary shadow-sm" : "text-muted hover:text-text"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Tìm sản phẩm, khách hàng, nội dung"
                  className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

        {loading && <div className="p-6 text-sm text-muted">Đang tải đánh giá...</div>}
        {!loading && error && <div className="p-6 text-sm font-semibold text-danger">{error}</div>}
        {!loading && !error && filteredReviews.length === 0 && <div className="p-6 text-sm text-muted">Không tìm thấy đánh giá.</div>}
          {!loading && !error && filteredReviews.length > 0 && (
            <div className="divide-y divide-border">
              {filteredReviews.map((review) => (
                <div key={review.id} className="p-5 transition-colors hover:bg-surface-alt/50">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-text">{review.productName}</p>
                      <p className="mt-1 text-xs text-muted">
                        {review.anonymous ? "Ẩn danh" : review.user?.fullName ?? "Không rõ"} · SKU {review.sku ?? "-"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-warning">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className={`h-4 w-4 ${index < (Number(review.rating) || 0) ? "fill-current" : "text-subtle"}`} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="font-semibold text-text">{review.title || "Không có tiêu đề"}</p>
                    <p className="mt-2 text-sm text-muted">{review.content || "Không có nội dung"}</p>
                  </div>

                  {(review.media ?? []).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {(review.media ?? []).map((media) => (
                        <a key={media.id} href={media.url} target="_blank" rel="noreferrer" className="block h-20 w-20 overflow-hidden rounded-lg border border-border-strong bg-surface-alt transition-transform hover:scale-105">
                          {media.mediaType === "IMAGE" ? (
                            <AdminImage src={media.url} alt="Review media" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted">VIDEO</div>
                          )}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Badge variant={review.active ? "success" : "neutral"}>
                      {review.active ? "Đang hiển thị" : "Đã ẩn"}
                    </Badge>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleToggleActive(review)}
                      disabled={actionId === review.id}
                      loading={actionId === review.id}
                      leftIcon={review.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    >
                      {review.active ? "Ẩn đánh giá" : "Hiện đánh giá"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(review)}
                      disabled={actionId === review.id}
                      leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </Container>
  );
}
