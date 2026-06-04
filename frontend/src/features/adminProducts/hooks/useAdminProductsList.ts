import { useEffect, useMemo, useState } from "react";
import { getProducts, toggleProductStatus } from "../adminProductApi";
import type { ProductResponse } from "../adminProductTypes";
import { getPrimaryVariant } from "../adminProductViewUtils";

export function useAdminProductsList() {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    };

    const handleStatusFilterChange = (value: "all" | "active" | "inactive") => {
        setStatusFilter(value);
        setPage(1);
    };

    const loadProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to load products:", err);
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
            } catch (err) {
                console.error("Failed to load products:", err);

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

        let result = products;

        if (statusFilter === "active") {
            result = result.filter((product) => product.active);
        } else if (statusFilter === "inactive") {
            result = result.filter((product) => !product.active);
        }

        if (!keyword) {
            return result;
        }

        return result.filter((product) =>
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
    }, [products, searchTerm, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

    const paginatedProducts = useMemo(() => {
        const startIndex = (page - 1) * pageSize;
        return filteredProducts.slice(startIndex, startIndex + pageSize);
    }, [filteredProducts, page, pageSize]);

    const toggleStatus = async (product: ProductResponse) => {
        try {
            setUpdatingId(product.id);
            const updatedProduct = await toggleProductStatus(product.id);
            setProducts((prev) =>
                prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
            );
        } catch (err) {
            console.error("Failed to update product status:", err);
            alert("Không thể cập nhật trạng thái sản phẩm");
        } finally {
            setUpdatingId(null);
        }
    };

    return {
        products,
        filteredProducts,
        paginatedProducts,
        loading,
        error,
        searchTerm,
        statusFilter,
        updatingId,
        page,
        pageSize,
        totalPages,
        setSearchTerm: handleSearchChange,
        setStatusFilter: handleStatusFilterChange,
        setPage,
        loadProducts,
        toggleStatus,
    };
}
