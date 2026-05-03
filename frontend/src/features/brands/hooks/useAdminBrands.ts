import { useEffect, useMemo, useState } from "react";
import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
  updateBrandStatus,
} from "../adminBrandApi";
import type { BrandResponse } from "../adminBrandTypes";

export function useAdminBrands() {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandResponse | null>(null);
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadBrands = async () => {
    setLoading(true);
    setError("");

    try {
      setBrands(await getBrands());
    } catch (error) {
      console.error("Failed to load brands:", error);
      setError("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadInitialBrands() {
      try {
        const data = await getBrands();

        if (!ignore) {
          setBrands(data);
          setError("");
        }
      } catch (error) {
        console.error("Failed to load brands:", error);

        if (!ignore) {
          setError("Không thể tải danh sách thương hiệu");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialBrands();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredBrands = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return brands;
    }

    return brands.filter((brand) =>
      [brand.name, brand.slug]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [brands, searchTerm]);

  const openCreateModal = () => {
    setEditingBrand(null);
    setBrandName("");
    setLogoUrl("");
    setShowModal(true);
  };

  const openEditModal = (brand: BrandResponse) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setLogoUrl(brand.logoUrl ?? "");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setEditingBrand(null);
    setBrandName("");
    setLogoUrl("");
    setShowModal(false);
  };

  const saveBrand = async () => {
    const trimmedName = brandName.trim();
    const trimmedLogoUrl = logoUrl.trim();

    if (!trimmedName) {
      alert("Vui lòng nhập tên thương hiệu");
      return;
    }

    try {
      setSaving(true);

      if (editingBrand) {
        const updatedBrand = await updateBrand(editingBrand.id, {
          name: trimmedName,
          logoUrl: trimmedLogoUrl,
        });
        setBrands((prev) =>
          prev.map((brand) => (brand.id === updatedBrand.id ? updatedBrand : brand))
        );
      } else {
        const createdBrand = await createBrand({
          name: trimmedName,
          logoUrl: trimmedLogoUrl,
        });
        setBrands((prev) => [createdBrand, ...prev]);
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save brand:", error);
      alert("Không thể lưu thương hiệu");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (brand: BrandResponse) => {
    try {
      setUpdatingId(brand.id);
      const updatedBrand = await updateBrandStatus(brand.id, { active: !brand.active });
      setBrands((prev) =>
        prev.map((item) => (item.id === updatedBrand.id ? updatedBrand : item))
      );
    } catch (error) {
      console.error("Failed to update brand status:", error);
      alert("Không thể cập nhật trạng thái thương hiệu");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeBrand = async (brand: BrandResponse) => {
    if (!window.confirm(`Xóa thương hiệu "${brand.name}"?`)) {
      return;
    }

    try {
      setUpdatingId(brand.id);
      await deleteBrand(brand.id);
      setBrands((prev) => prev.filter((item) => item.id !== brand.id));
    } catch (error) {
      console.error("Failed to delete brand:", error);
      alert("Không thể xóa thương hiệu. Thương hiệu có thể đang có sản phẩm.");
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    brands,
    filteredBrands,
    loading,
    error,
    searchTerm,
    showModal,
    editingBrand,
    brandName,
    logoUrl,
    saving,
    updatingId,
    setSearchTerm,
    setBrandName,
    setLogoUrl,
    loadBrands,
    openCreateModal,
    openEditModal,
    closeModal,
    saveBrand,
    toggleStatus,
    removeBrand,
  };
}
