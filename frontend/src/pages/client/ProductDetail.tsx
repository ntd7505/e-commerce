import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCart } from '../../features/client/cart/CartProvider';
import { useToast } from '../../features/ui/ToastProvider';
import { parseApiError } from '../../utils/apiError';
import { useAuth } from '../../features/auth/AuthProvider';

import {
  clientProductApi,
  type ProductResponse,
  type ProductVariantResponse,
  type ReviewSummaryResponse,
} from '../../features/client/home/clientProductApi';

import { LoadingState, ErrorState } from '../../components/common/States';

import ProductGallery from './components/product/ProductGallery';
import ProductInfo from './components/product/ProductInfo';
import PurchasePanel from './components/product/PurchasePanel';
import ProductTabs from './components/product/ProductTabs';
import ProductDescription from './components/product/ProductDescription';
import ProductSpecifications from './components/product/ProductSpecifications';
import ProductReviews from './components/product/ProductReviews';
import RelatedProducts from './components/product/RelatedProducts';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [related, setRelated] = useState<ProductResponse[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummaryResponse | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponse | null>(null);
  const [quantity, setQuantity] = useState(1);

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

        // Fetch related and summary only. Reviews are handled inside ProductReviews
        const [relatedData, summaryData] = await Promise.all([
          clientProductApi.getRelatedProducts(slug).catch(() => []),
          clientProductApi.getProductReviewSummary(productData.id).catch(() => null),
        ]);

        setRelated(relatedData);
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

  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const handleVariantSelect = (variant: ProductVariantResponse) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    if (!isAuthenticated) {
      const redirect = `${location.pathname}${location.search}`;
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    
    setBuyingNow(true);
    try {
      await addItem({ productVariantId: selectedVariant.id, quantity });
      navigate('/cart');
    } catch (err) {
      const error = parseApiError(err);
      showToast(error.message || 'Không thể mua ngay lúc này.', 'error');
    } finally {
      setBuyingNow(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return;
    if (!isAuthenticated) {
      const redirect = `${location.pathname}${location.search}`;
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setAddingToCart(true);
    try {
      await addItem({ productVariantId: selectedVariant.id, quantity });
      showToast(`Đã thêm ${quantity} × ${product.name} vào giỏ hàng.`, 'success', {
        label: 'Xem giỏ hàng',
        onClick: () => navigate('/cart')
      });
    } catch (err) {
      const error = parseApiError(err);
      showToast(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng.', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

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

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <Link to={`/products?categoryId=${product.category?.id}`} className="hover:text-blue-600 transition-colors">
          {product.category?.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Left: Gallery */}
        <ProductGallery media={product.media || []} productName={product.name} />

        {/* Center: Info */}
        <ProductInfo 
          product={product} 
          selectedVariant={selectedVariant} 
          reviewSummary={reviewSummary} 
          onVariantSelect={handleVariantSelect} 
        />

        {/* Right: Purchase Panel */}
        <PurchasePanel 
          selectedVariant={selectedVariant} 
          quantity={quantity} 
          onQuantityChange={setQuantity}
          onBuyNow={handleBuyNow}
          onAddToCart={handleAddToCart}
          addingToCart={addingToCart}
          buyingNow={buyingNow}
        />
      </div>

      {/* Product Tabs */}
      <ProductTabs 
        totalReviews={reviewSummary?.totalReviews || 0}
        descriptionNode={<ProductDescription description={product.description} />}
        specsNode={<ProductSpecifications product={product} selectedVariant={selectedVariant} />}
        reviewsNode={<ProductReviews productId={product.id} reviewSummary={reviewSummary} />}
      />

      {/* Related Products */}
      <RelatedProducts products={related} />
    </div>
  );
}
