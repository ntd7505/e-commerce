import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Loader2, ShoppingCart, Ban, Star } from 'lucide-react';

type ProductCardProps = {
  image: string;
  name: string;
  slug: string;
  price: string;
  originalPrice: string;
  discountBadge?: string;
  deliveryDate?: string;
  isFlashSale?: boolean;
  saleEnded?: boolean;
  onAddToCart?: () => Promise<void>;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  tags?: string[];
  flashSaleProgress?: number;
};

const IMAGE_FALLBACK = (
  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted">
    <ImageIcon className="w-8 h-8" />
    <span className="text-xs font-medium">Chưa có ảnh</span>
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  slug,
  price,
  originalPrice,
  discountBadge,
  deliveryDate,
  isFlashSale = false,
  saleEnded = false,
  onAddToCart,
  rating,
  soldCount,
  tags,
  flashSaleProgress,
}) => {
  const [imgError, setImgError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fallback for tags and progress
  const defaultTags = tags || (isFlashSale ? ['Rẻ vô địch', 'Freeship'] : ['Trả góp 0%', 'Freeship']);
  const defaultProgress = flashSaleProgress ?? Math.min(95, Math.max(15, name.length * 5));

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart || saleEnded || !onAddToCart) return;

    setAddingToCart(true);
    try {
      await onAddToCart();
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Link
      to={`/products/${slug}`}
      className="bg-surface rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-300 h-full flex flex-col group cursor-pointer block no-underline text-inherit"
    >
      {/* Image container */}
      <div className="relative bg-surface aspect-square overflow-hidden">
        {/* Discount badge */}
        {discountBadge && (
          <span className="absolute top-2 left-2 z-10 bg-danger text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
            {discountBadge}
          </span>
        )}

        {/* Product Image */}
        <div className="w-full h-full p-2 flex items-center justify-center">
          {!image || imgError ? (
            IMAGE_FALLBACK
          ) : (
            <img
              alt={name}
              className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500 mix-blend-multiply"
              src={image}
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Add to cart button */}
        {!saleEnded && onAddToCart ? (
          <div className="absolute bottom-2 left-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-70 border-0 shadow-sm"
              aria-label={`Thêm ${name} vào giỏ hàng`}
            >
              {addingToCart ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Thêm vào giỏ
                </>
              )}
            </button>
          </div>
        ) : !saleEnded && !onAddToCart ? (
          <div className="absolute bottom-2 left-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              disabled
              className="w-full bg-border text-muted text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed border-0"
            >
              <Ban className="w-4 h-4" />
              Hết hàng
            </button>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-grow bg-surface">
        <h4 className="text-sm md:text-base font-bold text-text line-clamp-2 min-h-[44px] group-hover:text-primary transition-colors leading-snug mb-3">
          {name}
        </h4>

        {/* Rating and Sold */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <Star className="w-3.5 h-3.5 fill-warning text-warning shrink-0" />
          <span className="text-xs font-medium text-text">
            {rating?.toFixed(1) || "0.0"} <span className="text-subtle mx-0.5">|</span> <span className="font-normal text-muted">Đã bán {(soldCount || 0) >= 1000 ? ((soldCount || 0)/1000).toFixed(1) + 'k' : (soldCount || 0)}</span>
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {defaultTags.map((tag, idx) => (
            <span key={idx} className="text-xs font-medium px-1.5 py-0.5 border border-primary-soft bg-primary-soft text-primary rounded whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mt-auto flex-wrap">
          <span className="text-danger font-bold text-lg leading-none">
            {price || 'Chưa có giá'}
          </span>
          {originalPrice && (
            <span className="text-muted line-through text-xs leading-none mb-0.5">
              {originalPrice}
            </span>
          )}
        </div>

        {/* Footer (Flash Sale Progress or Delivery Date) */}
        {isFlashSale && !saleEnded ? (
          <div className="mt-3">
            <div className="w-full bg-danger-soft h-[14px] rounded-full overflow-hidden relative flex items-center">
              <div className="absolute top-0 left-0 bottom-0 bg-danger-soft0 rounded-full" style={{ width: `${defaultProgress}%` }}></div>
              <span className="absolute w-full text-center text-xs font-bold text-white uppercase z-10 leading-none drop-shadow-sm mix-blend-normal">
                Đã bán {defaultProgress}%
              </span>
            </div>
          </div>
        ) : (
          !isFlashSale && deliveryDate && (
            <div className="text-xs text-muted mt-2 font-medium">
              Giao hàng {deliveryDate}
            </div>
          )
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
