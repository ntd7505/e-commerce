import { useState, useEffect, useCallback } from 'react';
import { clientProductApi, type ProductResponse, type ProductParams } from '../clientProductApi';

export const useClientProducts = (params: ProductParams = {}) => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const paramsString = JSON.stringify(params);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await clientProductApi.getProductsPageable(JSON.parse(paramsString));
            setProducts(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
            setError(null);
        } catch (err: unknown) {
            console.error("Lỗi khi tải sản phẩm:", err);
            setError("Không thể tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    }, [paramsString]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchProducts();
    }, [fetchProducts]);

    return { products, totalPages, totalElements, loading, error, refetch: fetchProducts };
};
