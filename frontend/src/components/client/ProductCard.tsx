import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
  onAddToCart?: () => void;
};

const IMAGE_FALLBACK = (
  <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-2">
    <i className="fa-solid fa-image text-3xl text-gray-300"></i>
    <span className="text-xs text-gray-400">Chưa có ảnh</span>
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
}) => {
  const [imgError, setImgError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart || saleEnded) return;

    setAddingToCart(true);
    // UI-only feedback — no real API call
    setTimeout(() => {
      setAddingToCart(false);
    }, 600);

    onAddToCart?.();
  };

  return (
    <Link
      to={`/products/${slug}`}
      className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group cursor-pointer block no-underline text-inherit"
    >
      {/* Image container */}
      <div className={`relative ${isFlashSale ? 'mb-0' : 'p-4 pb-0'}`}>
        {/* Discount badge — top-left */}
        {discountBadge && (
          <span className="absolute top-2 left-2 z-10 bg-nexa-red text-white text-[11px] font-bold px-2 py-0.5 rounded">
            {discountBadge}
          </span>
        )}

        {!image || imgError ? (
          IMAGE_FALLBACK
        ) : (
          <img
            alt={name}
            className={`w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-500 ${!isFlashSale ? 'mb-3' : ''}`}
            src={image}
            onError={() => setImgError(true)}
          />
        )}

        {/* Add to cart overlay on hover */}
        {!saleEnded && (
          <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 z-10">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-nexa-blue hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-lg disabled:opacity-70"
              aria-label={`Thêm ${name} vào giỏ hàng`}
            >
              {addingToCart ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                  Đang thêm...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cart-plus text-sm"></i>
                  Thêm vào giỏ
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${isFlashSale ? 'px-3 pb-3 pt-2' : 'p-4 pt-0'} flex flex-col flex-grow`}>
        <h4 className="text-sm font-medium line-clamp-2 mb-2 h-10 shrink-0 group-hover:text-nexa-blue transition-colors">
          {name}
        </h4>

        <div className="flex items-center gap-2 mt-auto">
          <span className="text-nexa-red font-bold text-base">{price}</span>
        </div>

        {originalPrice && (
          <div className="text-gray-400 line-through text-[11px] mt-0.5">
            {originalPrice}
          </div>
        )}

        {!isFlashSale && deliveryDate && (
          <div className="text-[11px] text-gray-500 mt-1">
            Giao hàng {deliveryDate}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
