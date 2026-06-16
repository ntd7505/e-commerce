import { useState, useEffect } from 'react';
import { clientProductApi, type ProductResponse } from '../clientProductApi';

/**
 * Hook riêng cho "Gợi ý hôm nay": lấy sản phẩm mới nhất
 * với params rõ ràng, tách biệt khỏi Flash Sale data.
 */
export const useRecommendedProducts = (
    page: number = 0,
    size: number = 10
) => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchRecommended = async () => {
            setLoading(true);
            try {
                const data = await clientProductApi.getProductsPageable({
                    page,
                    size,
                    sortBy: 'createdAt',
                    sortDir: 'desc',
                });

                if (!cancelled) {
                    setProducts(data.content || []);
                    setError(null);
                }
            } catch (err: unknown) {
                console.error('Lỗi khi tải gợi ý sản phẩm:', err);
                if (!cancelled) {
                    setError('Không thể tải sản phẩm gợi ý.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchRecommended();
        return () => { cancelled = true; };
    }, [page, size]);

    return { products, loading, error };
};
