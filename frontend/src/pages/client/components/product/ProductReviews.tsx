import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { clientProductApi, type ProductReviewResponse, type ReviewSummaryResponse } from '../../../../features/client/home/clientProductApi';
import type { PageResponse } from '../../../../types/api';

interface ProductReviewsProps {
  productId: number;
  reviewSummary: ReviewSummaryResponse | null;
}

export default function ProductReviews({ productId, reviewSummary }: ProductReviewsProps) {
  const [reviewsPage, setReviewsPage] = useState<PageResponse<ProductReviewResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await clientProductApi.getProductReviews(productId, page, 5);
        if (page === 0) {
          setReviewsPage(data);
        } else if (reviewsPage) {
          // Append new reviews to existing array
          setReviewsPage({
            ...data,
            content: [...reviewsPage.content, ...data.content]
          });
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, page]);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-border">
        <div className="text-center shrink-0 w-32">
          <div className="text-5xl font-bold text-text mb-2">{reviewSummary?.averageRating?.toFixed(1) || '0.0'}</div>
          <div className="flex justify-center text-warning mb-1">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star 
                key={item} 
                className={`w-4 h-4 ${item <= Math.round(reviewSummary?.averageRating || 0) ? 'fill-current' : 'text-subtle fill-gray-200'}`} 
              />
            ))}
          </div>
          <div className="text-sm text-muted">{reviewSummary?.totalReviews || 0} đánh giá</div>
        </div>
        
        {/* Progress bars could be added here if backend supported fiveStarCount, etc. */}
      </div>

      <div className="space-y-6">
        {!reviewsPage || reviewsPage.content.length === 0 ? (
          <p className="text-muted text-center py-4">Chưa có đánh giá nào.</p>
        ) : (
          reviewsPage.content.map((review) => (
            <div key={review.id} className="pb-6 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text">
                  {review.anonymous ? 'Người dùng ẩn danh' : review.user?.fullName ?? 'Khách hàng'}
                </span>
                <span className="text-xs text-muted">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex text-warning mb-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star 
                    key={index} 
                    className={`w-3 h-3 ${index < review.rating ? 'fill-current' : 'text-subtle fill-gray-200'}`} 
                  />
                ))}
              </div>
              {review.title && <h4 className="font-medium text-text mb-1 text-sm">{review.title}</h4>}
              <p className="text-sm text-muted leading-relaxed mb-3">{review.content}</p>
              {review.media && review.media.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {review.media.map(media => (
                    <div key={media.id} className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border-strong">
                      {media.mediaType === 'VIDEO' ? (
                        <video src={media.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={media.url} loading="lazy" alt="Review" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {reviewsPage && !reviewsPage.last && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
            className="px-6 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary-soft transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang tải...' : 'Xem thêm đánh giá'}
          </button>
        </div>
      )}
    </div>
  );
}
