import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    addProductVariant,
    createProduct,
    createProductMedia,
    deleteProductMedia,
    deleteProductVariant,
    getProductById,
    updateProduct,
    updateProductMedia,
    updateProductVariant,
} from "../adminProductApi";
import {
    emptyFormValues,
    emptyMedia,
    emptyVariant,
    mediaToDraft,
    variantToDraft,
    type MediaDraft,
    type ProductCreateFormValues,
    type VariantDraft,
} from "../adminProductFormTypes";
import {
    toProductCreateRequest,
    toProductFormValues,
    toProductUpdateRequest,
} from "../adminProductMapper";
import { uploadProductImage } from "../adminProductUpload";
import { getBrands } from "../../brands/adminBrandApi";
import type { BrandResponse } from "../../brands/adminBrandTypes";
import { getCategories } from "../../categories/adminCategoryApi";
import type { CategoryResponse } from "../../categories/adminCategoryTypes";

export function useAdminProductEditor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const productId = id ? Number(id) : null;
    const isEditMode = productId !== null && Number.isFinite(productId);

    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [brandsLoading, setBrandsLoading] = useState(true);
    const [brandsError, setBrandsError] = useState("");
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState("");
    const [formValues, setFormValues] = useState<ProductCreateFormValues>(emptyFormValues);
    const [productActive, setProductActive] = useState(true);
    const [variants, setVariants] = useState<VariantDraft[]>([]);
    const [mediaItems, setMediaItems] = useState<MediaDraft[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [savingVariantIndex, setSavingVariantIndex] = useState<number | null>(null);
    const [savingMediaIndex, setSavingMediaIndex] = useState<number | null>(null);
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;

        async function loadOptions() {
            try {
                const [brandData, categoryData] = await Promise.all([getBrands(), getCategories()]);

                if (!ignore) {
                    setBrands(brandData);
                    setCategories(categoryData);
                    setBrandsError("");
                    setCategoriesError("");
                }
            } catch (error) {
                console.error("Failed to load product options:", error);

                if (!ignore) {
                    setBrandsError("Failed to load brands");
                    setCategoriesError("Failed to load categories");
                }
            } finally {
                if (!ignore) {
                    setBrandsLoading(false);
                    setCategoriesLoading(false);
                }
            }
        }

        loadOptions();

        return () => {
            ignore = true;
        };
    }, []);

    const reloadProduct = async (currentProductId: number) => {
        const product = await getProductById(currentProductId);
        setFormValues(toProductFormValues(product));
        setProductActive(product.active);
        setVariants(product.variants.map(variantToDraft));
        setMediaItems(product.media.map(mediaToDraft));
    };

    useEffect(() => {
        if (!isEditMode || !productId) {
            return;
        }

        let ignore = false;
        const currentProductId = productId;

        async function loadProduct() {
            try {
                setLoadingProduct(true);
                const product = await getProductById(currentProductId);

                if (!ignore) {
                    setFormValues(toProductFormValues(product));
                    setProductActive(product.active);
                    setVariants(product.variants.map(variantToDraft));
                    setMediaItems(product.media.map(mediaToDraft));
                }
            } catch (error) {
                console.error("Failed to load product:", error);

                if (!ignore) {
                    alert("Không thể tải thông tin sản phẩm");
                    navigate("/admin/products");
                }
            } finally {
                if (!ignore) {
                    setLoadingProduct(false);
                }
            }
        }

        loadProduct();

        return () => {
            ignore = true;
        };
    }, [isEditMode, navigate, productId]);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleMediaUrlChange = (index: number, value: string) => {
        setFormValues((prev) => {
            const nextMediaUrls = [...prev.mediaUrls];
            nextMediaUrls[index] = value;

            return {
                ...prev,
                imageUrl: index === 0 ? value : prev.imageUrl,
                mediaUrls: nextMediaUrls,
            };
        });
    };

    const handleAddMediaUrl = () => {
        setFormValues((prev) => ({
            ...prev,
            mediaUrls: [...prev.mediaUrls, ""],
        }));
    };

    const handleRemoveMediaUrl = (index: number) => {
        setFormValues((prev) => {
            const nextMediaUrls = prev.mediaUrls.filter((_, currentIndex) => currentIndex !== index);
            const normalizedMediaUrls = nextMediaUrls.length > 0 ? nextMediaUrls : [""];

            return {
                ...prev,
                imageUrl: normalizedMediaUrls[0] ?? "",
                mediaUrls: normalizedMediaUrls,
            };
        });
    };

    const uploadFile = async (key: string, file?: File) => {
        if (!file) {
            return "";
        }

        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file ảnh");
            return "";
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Ảnh không được vượt quá 5MB");
            return "";
        }

        try {
            setUploadingKey(key);
            return await uploadProductImage(file);
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert("Không thể upload ảnh. Kiểm tra cấu hình Cloudinary hoặc thử lại.");
            return "";
        } finally {
            setUploadingKey(null);
        }
    };

    const handleUploadCreateMediaFile = async (index: number, file?: File) => {
        const imageUrl = await uploadFile(`create-${index}`, file);

        if (imageUrl) {
            handleMediaUrlChange(index, imageUrl);
        }
    };

    const handleUploadEditMediaFile = async (index: number, file?: File) => {
        const imageUrl = await uploadFile(`edit-${index}`, file);

        if (imageUrl) {
            setMediaItems((prev) =>
                prev.map((item, currentIndex) =>
                    currentIndex === index ? { ...item, url: imageUrl } : item
                )
            );
        }
    };

    const handleSaveProduct = async () => {
        if (!formValues.name.trim()) {
            alert("Vui lòng nhập tên sản phẩm");
            return;
        }

        if (!formValues.brandId || !formValues.categoryId) {
            alert("Vui lòng chọn thương hiệu và danh mục");
            return;
        }

        try {
            setLoading(true);

            if (isEditMode && productId) {
                const response = await updateProduct(productId, toProductUpdateRequest(formValues, productActive));
                alert(`Đã cập nhật sản phẩm: ${response.name}`);
                await reloadProduct(productId);
            } else {
                const response = await createProduct(toProductCreateRequest(formValues));
                alert(`Đã tạo sản phẩm: ${response.name}`);
                navigate(`/admin/products/${response.id}/edit`);
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Không thể lưu sản phẩm. Vui lòng kiểm tra dữ liệu và thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const updateVariantDraft = (index: number, patch: Partial<VariantDraft>) => {
        setVariants((prev) =>
            prev.map((variant, currentIndex) =>
                currentIndex === index ? { ...variant, ...patch } : variant
            )
        );
    };

    const handleAddVariantRow = () => {
        setVariants((prev) => [...prev, { ...emptyVariant }]);
    };

    const handleSaveVariant = async (index: number) => {
        if (!productId) {
            return;
        }

        const variant = variants[index];
        if (!variant.variantName.trim()) {
            alert("Vui lòng nhập tên biến thể");
            return;
        }

        try {
            setSavingVariantIndex(index);
            const payload = {
                variantName: variant.variantName.trim(),
                stockQuantity: Number(variant.stockQuantity),
                price: Number(variant.price),
                salePrice: Number(variant.salePrice || 0),
                currency: variant.currency.trim() || "VND",
                active: variant.active,
            };

            if (variant.id) {
                const updated = await updateProductVariant(variant.id, payload);
                updateVariantDraft(index, variantToDraft(updated));
            } else {
                const created = await addProductVariant(productId, payload);
                updateVariantDraft(index, variantToDraft(created));
            }
        } catch (error) {
            console.error("Failed to save variant:", error);
            alert("Không thể lưu biến thể");
        } finally {
            setSavingVariantIndex(null);
        }
    };

    const handleDeleteVariant = async (index: number) => {
        const variant = variants[index];

        if (!variant.id) {
            setVariants((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
            return;
        }

        if (!window.confirm(`Xóa biến thể "${variant.variantName}"?`)) {
            return;
        }

        try {
            await deleteProductVariant(variant.id);
            setVariants((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
        } catch (error) {
            console.error("Failed to delete variant:", error);
            alert("Không thể xóa biến thể");
        }
    };

    const updateMediaDraft = (index: number, patch: Partial<MediaDraft>) => {
        setMediaItems((prev) =>
            prev.map((media, currentIndex) =>
                currentIndex === index ? { ...media, ...patch } : media
            )
        );
    };

    const handleAddMediaRow = () => {
        setMediaItems((prev) => [
            ...prev,
            { ...emptyMedia, sortOrder: String(prev.length), thumbnail: prev.length === 0 },
        ]);
    };

    const handleSaveMedia = async (index: number) => {
        if (!productId) {
            return;
        }

        const media = mediaItems[index];
        if (!media.url.trim()) {
            alert("Vui lòng nhập URL ảnh hoặc upload file");
            return;
        }

        try {
            setSavingMediaIndex(index);
            const payload = {
                url: media.url.trim(),
                mediaType: media.mediaType.trim() || "image",
                thumbnail: media.thumbnail,
                sortOrder: Number(media.sortOrder || 0),
                altText: media.altText.trim() || formValues.name.trim(),
                active: media.active,
            };

            if (media.id) {
                const updated = await updateProductMedia(media.id, payload);
                updateMediaDraft(index, mediaToDraft(updated));
            } else {
                const created = await createProductMedia(productId, payload);
                updateMediaDraft(index, mediaToDraft(created));
            }
        } catch (error) {
            console.error("Failed to save media:", error);
            alert("Không thể lưu ảnh sản phẩm");
        } finally {
            setSavingMediaIndex(null);
        }
    };

    const handleDeleteMedia = async (index: number) => {
        const media = mediaItems[index];

        if (!media.id) {
            setMediaItems((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
            return;
        }

        if (!window.confirm("Xóa ảnh sản phẩm này?")) {
            return;
        }

        try {
            await deleteProductMedia(media.id);
            setMediaItems((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
        } catch (error) {
            console.error("Failed to delete media:", error);
            alert("Không thể xóa ảnh sản phẩm");
        }
    };

    return {
        brands,
        brandsLoading,
        brandsError,
        categories,
        categoriesLoading,
        categoriesError,
        formValues,
        productActive,
        variants,
        mediaItems,
        loading,
        loadingProduct,
        savingVariantIndex,
        savingMediaIndex,
        uploadingKey,
        isEditMode,
        setProductActive,
        handleChange,
        handleMediaUrlChange,
        handleAddMediaUrl,
        handleRemoveMediaUrl,
        handleUploadCreateMediaFile,
        handleUploadEditMediaFile,
        handleSaveProduct,
        updateVariantDraft,
        handleAddVariantRow,
        handleSaveVariant,
        handleDeleteVariant,
        updateMediaDraft,
        handleAddMediaRow,
        handleSaveMedia,
        handleDeleteMedia,
    };
}
