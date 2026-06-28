import { RefreshCw, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminImage } from "../../components/admin/AdminImage";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { getProducts } from "../../features/admin/products/adminProductApi";
import { getProductReviews } from "../../features/admin/reviews/adminProductReviewApi";
import type { ProductReviewResponse } from "../../features/admin/reviews/adminProductReviewTypes";

type RatingFilter = "ALL" | "5" | "4" | "3" | "2" | "1";

export default function ProductReviews() {
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("ALL");

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const products = await getProducts();
      const reviewGroups = await Promise.all(
        products.map((product) =>
          getProductReviews(product.id).catch((error) => {
            console.error(`Failed to load reviews for product ${product.id}:`, error);
            return [];
          })
        )
      );

      setReviews(reviewGroups.flat().filter((r): r is ProductReviewResponse => Boolean(r)));
    } catch (error) {
      console.error("Failed to load product reviews:", error);
      setError("Could not load product reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    { label: "All", value: "ALL" },
    { label: "5 star", value: "5" },
    { label: "4 star", value: "4" },
    { label: "3 star", value: "3" },
    { label: "2 star", value: "2" },
    { label: "1 star", value: "1" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text">Product Reviews</h2>
          <p className="text-sm text-muted">Read customer reviews across products. Moderation API is not available yet.</p>
        </div>
        <button
          type="button"
          onClick={loadReviews}
          disabled={loading}
          className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition-colors hover:bg-surface disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Reviews" value={reviews.length} />
        <AdminStatCard label="Average" value={averageRating.toFixed(1)} />
        <AdminStatCard label="With Media" value={reviews.filter((review) => (review.media ?? []).length > 0).length} />
        <AdminStatCard label="Active" value={reviews.filter((review) => review.active).length} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
          <div>
            <h3 className="font-bold text-text">Review List</h3>
            <p className="mt-1 text-xs font-medium text-muted">Showing {filteredReviews.length} of {reviews.length} reviews</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-border-strong bg-surface p-1">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRatingFilter(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                    ratingFilter === option.value ? "bg-surface text-success shadow-sm" : "text-muted hover:text-text"
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
                placeholder="Search product, user, content"
                className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-success"
              />
            </div>
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-muted">Loading reviews...</div>}
        {!loading && error && <div className="p-6 text-sm font-semibold text-danger">{error}</div>}
        {!loading && !error && filteredReviews.length === 0 && <div className="p-6 text-sm text-muted">No reviews found.</div>}
        {!loading && !error && filteredReviews.length > 0 && (
          <div className="divide-y divide-border">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-text">{review.productName}</p>
                    <p className="mt-1 text-xs text-muted">
                      {review.anonymous ? "Anonymous" : review.user?.fullName ?? "Unknown user"} · SKU {review.sku ?? "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className={`h-4 w-4 ${index < (Number(review.rating) || 0) ? "fill-current" : "text-subtle"}`} />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-semibold text-text">{review.title || "Untitled review"}</p>
                  <p className="mt-2 text-sm text-muted">{review.content || "No content"}</p>
                </div>

                {(review.media ?? []).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {(review.media ?? []).map((media) => (
                      <a key={media.id} href={media.url} target="_blank" rel="noreferrer" className="block h-20 w-20 overflow-hidden rounded-lg border border-border-strong bg-surface-alt">
                        {media.mediaType === "IMAGE" ? (
                          <AdminImage src={media.url} alt="Review media" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted">VIDEO</div>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
