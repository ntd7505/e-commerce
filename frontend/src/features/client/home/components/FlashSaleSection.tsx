import React, { useEffect, useState } from 'react';
import ProductCard from '../../../../components/client/ProductCard';
import { useClientProducts } from '../hooks/useClientProducts';

const FlashSaleSection = () => {
    // Lấy 5 sản phẩm đầu tiên từ API cho Flash Sale
    const { products, loading, error } = useClientProducts(0, 5);

    const [timeLeft, setTimeLeft] = useState<number>(7200);

    useEffect(() => {
        // Nếu hết thời gian thì không tạo interval làm gì nữa
        if (timeLeft <= 0) return;

        // Chạy ĐÚNG một lần khi component mount vì dependency array để trống []
        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId); // Tự dọn dẹp khi đếm về 0
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Cleanup khi component unmount
        return () => clearInterval(timerId);
    }, []);

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

    return (
        <section className="container-custom mt-8" data-purpose="flash-sale-section">
            <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold italic text-nexa-blue">Flash Sale</h3>
                    <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded">
                        <span className="text-xs font-bold">KẾT THÚC TRONG:</span>
                        <div className="flex gap-1 font-mono text-sm">
                            <span className="bg-black px-1 rounded">{formatTime(hours)}</span>:
                            <span className="bg-black px-1 rounded">{formatTime(minutes)}</span>:
                            <span className="bg-black px-1 rounded">{formatTime(seconds)}</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-gray-500">Đang tải dữ liệu Flash Sale...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-gray-500">Chưa có sản phẩm Flash Sale.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-5 gap-4">
                        {products.map((product) => {
                            // Xử lý ảnh và giá giống hệt bên RecommendedSection
                            const thumbnailImage = product.media?.find(m => m.thumbnail)?.url || product.media?.[0]?.url || '';

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
                                    rating={5}
                                    reviews="0"
                                    isFlashSale={true}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FlashSaleSection;
