import { useState, useEffect } from 'react';
import { clientProductApi, type ProductResponse } from '../clientProductApi';

/**
 * Hook riêng cho Flash Sale: lấy sản phẩm có variant đang sale thật
 * (salePrice > 0 && salePrice < price). Không invent API mới.
 */
export const useFlashSaleProducts = (limit: number = 10) => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchFlashSale = async () => {
            setLoading(true);
            try {
                const data = await clientProductApi.getProductsPageable({
                    page: 0,
                    size: 40, // fetch more to filter locally
                    sortBy: 'createdAt',
                    sortDir: 'desc',
                });

                const items = (data.content || []).filter((product) =>
                    product.variants?.some(
                        (v) => v.salePrice > 0 && v.salePrice < v.price
                    )
                );

                if (!cancelled) {
                    setProducts(items.slice(0, limit));
                    setError(null);
                }
            } catch (err: unknown) {
                console.error('Lỗi khi tải Flash Sale:', err);
                if (!cancelled) {
                    setError('Không thể tải sản phẩm Flash Sale.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchFlashSale();
        return () => { cancelled = true; };
    }, [limit]);

    return { products, loading, error };
};
