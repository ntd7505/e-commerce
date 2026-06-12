import React from 'react';

type ProductCardProps = {
  image: string;
  name: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: string;
  discountBadge?: string;
  deliveryDate?: string;
  isFlashSale?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  discountBadge,
  deliveryDate,
  isFlashSale = false,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group cursor-pointer">
      <div className={`relative ${isFlashSale ? 'mb-3' : 'p-4 pb-0'}`}>
        <img
          alt={name}
          className={`w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-500 ${!isFlashSale ? 'mb-3' : ''}`}
          src={image || 'https://placehold.co/400x400/eeeeee/999999?text=Chưa+có+ảnh'}
        />
        {isFlashSale && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[10px] text-center py-1 font-bold">
            Bán chạy - 70%
          </div>
        )}
      </div>
      
      <div className={`${isFlashSale ? 'px-3 pb-3' : 'p-4 pt-0'} flex flex-col flex-grow`}>
        <h4 className="text-sm font-medium line-clamp-2 mb-1 h-10 flex-shrink-0 group-hover:text-nexa-blue transition-colors">
          {name}
        </h4>
        
        <div className="flex items-center gap-1 text-[11px] mb-2 text-gray-500">
          <i className="fa-solid fa-star text-yellow-400"></i>
          <span>
            {rating}/5 | {reviews}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-red-600 font-bold text-base">{price}</span>
          {!isFlashSale && discountBadge && (
            <span className="bg-red-100 text-red-600 text-[10px] px-1 rounded">
              {discountBadge}
            </span>
          )}
        </div>
        
        <div className="text-gray-400 line-through text-[11px] mb-2">
          {originalPrice}
        </div>
        
        {!isFlashSale && deliveryDate && (
          <div className="text-[11px] text-gray-500">
            Giao hàng {deliveryDate}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
