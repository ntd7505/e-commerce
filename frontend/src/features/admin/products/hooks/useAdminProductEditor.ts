import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../features/ui/ToastProvider";
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
import { uploadProductImage, uploadProductImages, validateProductImageFile } from "../adminProductUpload";
import { getBrands } from "../../brands/adminBrandApi";
import type { BrandResponse } from "../../brands/adminBrandTypes";
import { getCategories } from "../../categories/adminCategoryApi";
import type { CategoryResponse } from "../../categories/adminCategoryTypes";

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error && error.message ? error.message : fallback;
}

export function useAdminProductEditor() {
    const navigate = useNavigate();
    const { showToast } = useToast();
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [product, setProduct] = useState<any>(null);

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
        setProduct(product);
        setFormValues(toProductFormValues(product));
        setProductActive(product.active);
        setVariants((product.variants ?? []).map(variantToDraft));
        setMediaItems((product.media ?? []).map(mediaToDraft));
    };

    const reloadMediaOnly = async (currentProductId: number) => {
        const product = await getProductById(currentProductId);
        const freshMedia = (product.media ?? []).map(mediaToDraft);
        setMediaItems(freshMedia);
        const activeMedia = (product.media ?? [])
            .filter((m) => m.active)
            .sort((a, b) => a.sortOrder - b.sortOrder);
        const activeUrls = activeMedia.map((m) => m.url);
        setFormValues((prev) => ({
            ...prev,
            imageUrl: activeMedia[0]?.url ?? "",
            mediaUrls: activeUrls.length > 0 ? activeUrls : [""],
        }));
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
                    setProduct(product);
                    setFormValues(toProductFormValues(product));
                    setProductActive(product.active);
                    setVariants((product.variants ?? []).map(variantToDraft));
                    setMediaItems((product.media ?? []).map(mediaToDraft));
                }
            } catch (error) {
                console.error("Failed to load product:", error);

                if (!ignore) {
                    showToast("Không thể tải thông tin sản phẩm", "error");
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
    }, [isEditMode, navigate, productId, showToast]);

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

    const getValidImageFiles = (files?: FileList | File[] | null) => {
        const selectedFiles = Array.from(files ?? []);
        const invalidFile = selectedFiles.find((file) => validateProductImageFile(file));

        if (invalidFile) {
            showToast(validateProductImageFile(invalidFile)!, "error");
            return [];
        }

        return selectedFiles;
    };

    const uploadFile = async (key: string, file?: File) => {
        if (!file) {
            return "";
        }

        const validationError = validateProductImageFile(file);
        if (validationError) {
            showToast(validationError, "error");
            return "";
        }

        try {
            setUploadingKey(key);
            return await uploadProductImage(file);
        } catch (error) {
            console.error("Failed to upload image:", error);
            showToast(getErrorMessage(error, "Cannot upload image. Check Cloudinary configuration or try again."), "error");
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

    const handleUploadCreateMediaFiles = async (files?: FileList | null) => {
        const imageFiles = getValidImageFiles(files);

        if (imageFiles.length === 0) {
            return;
        }

        try {
            setUploadingKey("create-bulk");
            const uploadedUrls = await uploadProductImages(imageFiles);

            setFormValues((prev) => {
                const currentUrls = prev.mediaUrls.map((url) => url.trim()).filter(Boolean);
                const nextMediaUrls = [...currentUrls, ...uploadedUrls];

                return {
                    ...prev,
                    imageUrl: nextMediaUrls[0] ?? "",
                    mediaUrls: nextMediaUrls.length > 0 ? nextMediaUrls : [""],
                };
            });
        } catch (error) {
            console.error("Failed to upload product images:", error);
            showToast(getErrorMessage(error, "Cannot upload images. Check Cloudinary configuration or try again."), "error");
        } finally {
            setUploadingKey(null);
        }
    };

    const handleUploadEditMediaFile = async (index: number, file?: File) => {
        const imageUrl = await uploadFile(`edit-${index}`, file);

        if (!imageUrl) {
            return;
        }

        if (!productId) {
            setMediaItems((prev) =>
                prev.map((item, currentIndex) =>
                    currentIndex === index ? { ...item, url: imageUrl } : item
                )
            );
            return;
        }

        const media = mediaItems[index] ?? {
            ...emptyMedia,
            sortOrder: String(index),
            thumbnail: mediaItems.length === 0,
        };
        const payload = {
            url: imageUrl,
            mediaType: media.mediaType.trim() || "image",
            thumbnail: media.thumbnail,
            sortOrder: Number(media.sortOrder || index),
            altText: media.altText.trim() || formValues.name.trim(),
            active: media.active,
        };

        try {
            setSavingMediaIndex(index);

            if (media.id) {
                await updateProductMedia(media.id, payload);
            } else {
                await createProductMedia(productId, payload);
            }

            await reloadMediaOnly(productId);
        } catch (error) {
            console.error("Failed to save uploaded media:", error);
            showToast("Image uploaded, but product media could not be saved.", "error");
            updateMediaDraft(index, { url: imageUrl });
        } finally {
            setSavingMediaIndex(null);
        }
    };

    const handleUploadEditMediaFiles = async (files?: FileList | null) => {
        if (!productId) {
            return;
        }

        const imageFiles = getValidImageFiles(files);

        if (imageFiles.length === 0) {
            return;
        }

        try {
            setUploadingKey("edit-bulk");
            const uploadedUrls = await uploadProductImages(imageFiles);
            const startIndex = mediaItems.length;

            for (const [offset, url] of uploadedUrls.entries()) {
                await createProductMedia(productId, {
                    url,
                    mediaType: "image",
                    thumbnail: mediaItems.length === 0 && offset === 0,
                    sortOrder: startIndex + offset,
                    altText: formValues.name.trim(),
                });
            }

            await reloadMediaOnly(productId);
        } catch (error) {
            console.error("Failed to upload product media:", error);
            showToast(getErrorMessage(error, "Cannot upload and save product images."), "error");
        } finally {
            setUploadingKey(null);
        }
    };

    const handleSaveProduct = async () => {
        if (uploadingKey) {
            showToast("Please wait for image uploads to finish.", "error");
            return;
        }

        if (!formValues.name.trim()) {
            showToast("Vui lòng nhập tên sản phẩm", "error");
            return;
        }

        if (!formValues.brandId || !formValues.categoryId) {
            showToast("Vui lòng chọn thương hiệu và danh mục", "error");
            return;
        }

        try {
            setLoading(true);

            if (isEditMode && productId) {
                const response = await updateProduct(productId, toProductUpdateRequest(formValues, productActive));
                showToast(`Đã cập nhật sản phẩm: ${response.name}`, "success");
                await reloadProduct(productId);
            } else {
                const response = await createProduct(toProductCreateRequest(formValues));
                showToast(`Đã tạo sản phẩm: ${response.name}`, "success");
                navigate(`/admin/products/${response.id}/edit`);
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            showToast("Không thể lưu sản phẩm. Vui lòng kiểm tra dữ liệu và thử lại.", "error");
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
            showToast("Vui lòng nhập tên biến thể", "error");
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
            showToast("Không thể lưu biến thể", "error");
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
            showToast("Không thể xóa biến thể", "error");
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
            showToast("Vui lòng nhập URL ảnh hoặc upload file", "error");
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
                await updateProductMedia(media.id, payload);
            } else {
                await createProductMedia(productId, payload);
            }

            await reloadMediaOnly(productId);
        } catch (error) {
            console.error("Failed to save media:", error);
            showToast("Không thể lưu ảnh sản phẩm", "error");
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
            showToast("Không thể xóa ảnh sản phẩm", "error");
        }
    };

    const DUMMY_DOMAINS = ["example.com", "placeholder.com"];

    const hasExampleMedia =
        mediaItems.some((m) => m.url && DUMMY_DOMAINS.some((d) => m.url.includes(d))) ||
        formValues.mediaUrls.some((u) => u && DUMMY_DOMAINS.some((d) => u.includes(d)));

    return {
        product,
        productId,
        reloadProduct,
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
        hasExampleMedia,
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
        handleUploadCreateMediaFiles,
        handleUploadEditMediaFile,
        handleUploadEditMediaFiles,
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
