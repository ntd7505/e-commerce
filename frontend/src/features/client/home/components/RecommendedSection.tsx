import React from 'react';
import ProductCard from '../../../../components/client/ProductCard';
import { useClientProducts } from '../hooks/useClientProducts';

const RecommendedSection = () => {
  // Lấy 10 sản phẩm đầu tiên từ API
  const { products, loading, error } = useClientProducts(0, 10);

  return (
    <section className="container-custom mt-8 mb-10" data-purpose="recommendations">
      <h3 className="text-2xl font-bold mb-4">Gợi ý hôm nay</h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Không có sản phẩm nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {products.map((product) => {
            // Lấy ảnh thumbnail hoặc ảnh đầu tiên
            const thumbnailImage = product.media?.find(m => m.thumbnail)?.url || product.media?.[0]?.url || '';
            
            // Lấy giá từ Variant đầu tiên
            const firstVariant = product.variants?.[0];
            const currentPrice = firstVariant?.salePrice > 0 ? firstVariant.salePrice : firstVariant?.price || 0;
            const originalPrice = firstVariant?.price > currentPrice ? firstVariant.price : null;

            return (
              <ProductCard 
                key={product.id}
                image={thumbnailImage}
                name={product.name}
                price={currentPrice.toLocaleString('vi-VN') + "₫"}
                originalPrice={originalPrice ? originalPrice.toLocaleString('vi-VN') + "₫" : ""}
                rating={5} // Tạm thời hardcode nếu BE chưa có rating
                reviews="0"
                discountBadge={originalPrice && originalPrice > currentPrice ? `-${Math.round((originalPrice - currentPrice) / originalPrice * 100)}%` : ""}
                isFlashSale={false}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecommendedSection;
