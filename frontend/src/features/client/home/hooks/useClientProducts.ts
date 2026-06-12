import { useState, useEffect } from 'react';
import { clientProductApi, type ProductResponse } from '../clientProductApi';

export const useClientProducts = (page: number = 0, size: number = 10) => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await clientProductApi.getProductsPageable(page, size);
                setProducts(data);
                setError(null);
            } catch (err: unknown) {
                console.error("Lỗi khi tải sản phẩm:", err);
                setError("Không thể tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, size]);

    return { products, loading, error };
};
