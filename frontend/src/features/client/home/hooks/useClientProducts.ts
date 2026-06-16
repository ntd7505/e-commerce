import { useState, useEffect } from 'react';
import { clientProductApi, type ProductResponse } from '../clientProductApi';

export const useClientProducts = (params: any = {}) => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await clientProductApi.getProductsPageable(params);
                setProducts(data.content || []);
                setTotalPages(data.totalPages || 0);
                setError(null);
            } catch (err: unknown) {
                console.error("Lỗi khi tải sản phẩm:", err);
                setError("Không thể tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        void fetchProducts();
        // Disabling exhaustive deps here because params is an object and passing it directly causes infinite loops if not memoized, 
        // usually we'd stringify it or pass individual fields
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    return { products, totalPages, loading, error };
};
