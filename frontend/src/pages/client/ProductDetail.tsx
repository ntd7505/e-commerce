import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  clientProductApi,
  type ProductResponse,
  type ProductVariantResponse,
  type ProductReviewResponse,
  type ReviewSummaryResponse,
} from '../../features/client/home/clientProductApi';
import { LoadingState, ErrorState } from '../../components/common/States';
import { formatCurrency, calculateDiscountPercent } from '../../utils/formatters';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../../components/client/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [related, setRelated] = useState<ProductResponse[]>([]);
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponse | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  const handleVariantSelect = (variant: ProductVariantResponse) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const productData = await clientProductApi.getProductDetail(slug);
        setProduct(productData);

        if (productData.variants?.length > 0) {
          const activeVariant = productData.variants.find(v => v.active) || productData.variants[0];
          setSelectedVariant(activeVariant);
        }

        const activeMedia = productData.media?.filter(m => m.active !== false).sort((a, b) => a.sortOrder - b.sortOrder) || [];
        const thumbnail = activeMedia.find(m => m.thumbnail)?.url || activeMedia[0]?.url || '';
        setActiveImage(thumbnail);

        const [relatedData, reviewData, summaryData] = await Promise.all([
          clientProductApi.getRelatedProducts(slug).catch(() => []),
          clientProductApi.getProductReviews(productData.id).catch(() => []),
          clientProductApi.getProductReviewSummary(productData.id).catch(() => null),
        ]);

        setRelated(relatedData);
        setReviews(reviewData);
        setReviewSummary(summaryData);
      } catch (err) {
        console.error(err);
        setError('Không thể tải chi tiết sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    void fetchDetail();
  }, [slug]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><LoadingState /></div>;
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState message={error || 'Không tìm thấy sản phẩm'} />
      </div>
    );
  }

  const currentPrice = selectedVariant?.salePrice && selectedVariant.salePrice > 0
    ? selectedVariant.salePrice
    : selectedVariant?.price || 0;
  const originalPrice = selectedVariant?.price && selectedVariant.price > currentPrice ? selectedVariant.price : null;
  const stock = selectedVariant?.stockQuantity || 0;

  return (
    <div className="container-custom py-8">
      <nav className="flex text-sm text-gray-500 mb-8 gap-2">
        <a href="/" className="hover:text-blue-600 transition-colors">Trang chủ</a>
        <span>/</span>
        <a href={`/products?categoryId=${product.category?.id}`} className="hover:text-blue-600 transition-colors">
          {product.category?.name}
        </a>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="mb-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Gallery */}
        <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 bg-white rounded-2xl p-6 shadow-sm">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">Chưa có ảnh</div>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.media?.map((media) => (
              <button
                key={media.id}
                onClick={() => setActiveImage(media.url)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${activeImage === media.url ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={media.url} loading="lazy" alt={media.altText || product.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Center Column: Product Info */}
        <div className="flex-1 bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
          {product.brand && (
            <div className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">
              {product.brand.name}
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
          {product.shortDescription && (
            <p className="text-gray-600 mb-6">{product.shortDescription}</p>
          )}

          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            {reviewSummary && reviewSummary.totalReviews > 0 ? (
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-bold">{reviewSummary.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-500 text-sm">({reviewSummary.totalReviews} đánh giá)</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Chưa có đánh giá</div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-end gap-4 mb-2">
              <span className="text-4xl font-bold text-red-600">{formatCurrency(currentPrice)}</span>
              {originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through mb-1">{formatCurrency(originalPrice)}</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold mb-1">
                    {calculateDiscountPercent(originalPrice, currentPrice)}
                  </span>
                </>
              )}
            </div>
          </div>

          {product.variants?.length > 1 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Phân loại:</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    disabled={!variant.active || variant.stockQuantity <= 0}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedVariant?.id === variant.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {variant.variantName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Purchase Panel */}
        <div className="w-full lg:w-[300px] xl:w-[340px] shrink-0 bg-white rounded-2xl p-6 shadow-sm lg:sticky lg:top-24 h-fit">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Số lượng:</h3>
            <div className="flex items-center border border-gray-300 rounded-lg h-12 w-32 mb-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!selectedVariant || stock === 0}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <div className="flex-1 h-full flex items-center justify-center font-medium border-x border-gray-300">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={!selectedVariant || stock === 0 || quantity >= stock}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {!selectedVariant ? (
                <span className="text-red-500 font-medium">Sản phẩm hiện không có sẵn</span>
              ) : stock > 0 ? (
                `Còn ${stock} sản phẩm`
              ) : (
                <span className="text-red-500 font-medium">Hết hàng</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button
              disabled={stock === 0 || !selectedVariant}
              className="w-full bg-blue-600 text-white h-14 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-[0_8px_20px_rgba(37,99,235,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mua ngay
            </button>
            <button
              disabled={stock === 0 || !selectedVariant}
              className="w-full bg-blue-50 text-blue-600 h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ
            </button>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Bảo hành chính hãng</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <RotateCcw className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Đổi trả theo chính sách</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Miễn phí giao hàng cho đơn từ 500k</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin sản phẩm</h2>
            <div className="space-y-4 text-sm text-gray-700">
              {product.brand && (
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="w-1/3 text-gray-500">Thương hiệu</span>
                  <span className="w-2/3 font-medium">{product.brand.name}</span>
                </div>
              )}
              {product.category && (
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="w-1/3 text-gray-500">Danh mục</span>
                  <span className="w-2/3 font-medium">{product.category.name}</span>
                </div>
              )}
              {selectedVariant && (
                <>
                  <div className="flex border-b border-gray-100 pb-3">
                    <span className="w-1/3 text-gray-500">SKU</span>
                    <span className="w-2/3 font-medium">{selectedVariant.sku}</span>
                  </div>
                  <div className="flex border-b border-gray-100 pb-3">
                    <span className="w-1/3 text-gray-500">Tiền tệ</span>
                    <span className="w-2/3 font-medium">{selectedVariant.currency}</span>
                  </div>
                  <div className="flex border-b border-gray-100 pb-3">
                    <span className="w-1/3 text-gray-500">Kho hàng</span>
                    <span className="w-2/3 font-medium">{selectedVariant.stockQuantity}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mô tả sản phẩm</h2>
            {product.description ? (
              <div className="prose max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <p className="text-gray-500">Sản phẩm chưa có mô tả.</p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3 shrink-0 space-y-8">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá ({reviewSummary?.totalReviews || 0})</h2>

            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="text-center w-full">
                <div className="text-5xl font-bold text-gray-900 mb-2">{reviewSummary?.averageRating?.toFixed(1) || '0.0'}</div>
                <div className="flex justify-center text-amber-400 mb-1">
                  {[1, 2, 3, 4, 5].map((item) => <Star key={item} className="w-4 h-4 fill-current" />)}
                </div>
                <div className="text-sm text-gray-500">{reviewSummary?.totalReviews || 0} đánh giá</div>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Chưa có đánh giá nào.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{review.anonymous ? 'Người dùng ẩn danh' : review.user?.fullName ?? 'Khách hàng'}</span>
                      <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex text-amber-400 mb-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className={`w-3 h-3 ${index < review.rating ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} />
                      ))}
                    </div>
                    {review.title && <h4 className="font-medium text-gray-900 mb-1 text-sm">{review.title}</h4>}
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.content}</p>
                    {review.media && review.media.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {review.media.map(media => (
                          <div key={media.id} className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-200">
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
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {related.map((item) => {
              const thumbnailImage = item.media?.find((media) => media.thumbnail)?.url || item.media?.[0]?.url || '';
              const firstVariant = item.variants?.[0];
              const itemPrice = firstVariant?.salePrice > 0 ? firstVariant.salePrice : firstVariant?.price || 0;
              const itemOriginalPrice = firstVariant?.price > itemPrice ? firstVariant.price : null;

              return (
                <ProductCard
                  key={item.id}
                  image={thumbnailImage}
                  name={item.name}
                  slug={item.slug}
                  price={formatCurrency(itemPrice)}
                  originalPrice={itemOriginalPrice ? formatCurrency(itemOriginalPrice) : ''}
                  discountBadge={itemOriginalPrice ? calculateDiscountPercent(itemOriginalPrice, itemPrice) : ''}
                  isFlashSale={false}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
