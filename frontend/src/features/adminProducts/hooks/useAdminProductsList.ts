import { useEffect, useMemo, useState } from "react";
import { getProducts, toggleProductStatus } from "../adminProductApi";
import type { ProductResponse } from "../adminProductTypes";
import { getPrimaryVariant } from "../adminProductViewUtils";

export function useAdminProductsList() {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const loadProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products:", error);
            setError("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let ignore = false;

        async function loadInitialProducts() {
            try {
                const data = await getProducts();

                if (!ignore) {
                    setProducts(data);
                    setError("");
                }
            } catch (error) {
                console.error("Failed to load products:", error);

                if (!ignore) {
                    setError("Không thể tải danh sách sản phẩm");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadInitialProducts();

        return () => {
            ignore = true;
        };
    }, []);

    const filteredProducts = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        if (!keyword) {
            return products;
        }

        return products.filter((product) =>
            [
                product.name,
                product.slug,
                product.brand?.name,
                product.category?.name,
                getPrimaryVariant(product)?.sku,
            ]
                .filter(Boolean)
                .some((value) => value!.toLowerCase().includes(keyword))
        );
    }, [products, searchTerm]);

    const toggleStatus = async (product: ProductResponse) => {
        try {
            setUpdatingId(product.id);
            const updatedProduct = await toggleProductStatus(product.id);
            setProducts((prev) =>
                prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
            );
        } catch (error) {
            console.error("Failed to update product status:", error);
            alert("Không thể cập nhật trạng thái sản phẩm");
        } finally {
            setUpdatingId(null);
        }
    };

    return {
        products,
        filteredProducts,
        loading,
        error,
        searchTerm,
        updatingId,
        setSearchTerm,
        loadProducts,
        toggleStatus,
    };
}
