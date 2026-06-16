import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [related, setRelated] = useState<ProductResponse[]>([]);
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponse | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const productData = await clientProductApi.getProductDetail(slug);
        setProduct(productData);

        if (productData.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }

        const thumbnail = productData.media?.find((media) => media.thumbnail)?.url || productData.media?.[0]?.url || '';
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

      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm mb-12 flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-5/12 shrink-0">
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
                <img src={media.url} alt={media.altText} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {product.brand && (
            <div className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">
              {product.brand.name}
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-bold">{reviewSummary?.averageRating || 5.0}</span>
              <span className="text-gray-500 text-sm">({reviewSummary?.totalReviews || 0} đánh giá)</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="text-sm text-gray-500">
              Đã bán: <span className="font-medium text-gray-900">1.2k+</span>
            </div>
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
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedVariant?.id === variant.id
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

          <div className="mb-8 flex items-end gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Số lượng:</h3>
              <div className="flex items-center border border-gray-300 rounded-lg h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-l-lg"
                >
                  -
                </button>
                <div className="w-12 h-full flex items-center justify-center font-medium border-x border-gray-300">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-3">
              {stock > 0 ? `Còn ${stock} sản phẩm` : <span className="text-red-500 font-medium">Hết hàng</span>}
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              disabled={stock === 0}
              className="flex-1 bg-blue-50 text-blue-600 h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ
            </button>
            <button
              disabled={stock === 0}
              className="flex-1 bg-blue-600 text-white h-14 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-[0_8px_20px_rgba(37,99,235,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mua ngay
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Bảo hành chính hãng 12 tháng</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              <span>Đổi trả miễn phí trong 7 ngày</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Miễn phí giao hàng toàn quốc</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mô tả sản phẩm</h2>
          <div className="prose max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

        <div className="w-full lg:w-1/3 shrink-0 bg-white rounded-2xl p-6 lg:p-8 shadow-sm h-fit">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá ({reviewSummary?.totalReviews || 0})</h2>

          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">{reviewSummary?.averageRating?.toFixed(1) || '5.0'}</div>
              <div className="flex text-amber-400 mb-1">
                {[1, 2, 3, 4, 5].map((item) => <Star key={item} className="w-4 h-4 fill-current" />)}
              </div>
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
                  <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                </div>
              ))
            )}
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
