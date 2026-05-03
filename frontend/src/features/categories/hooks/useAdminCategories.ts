import { useEffect, useMemo, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../adminCategoryApi";
import type { CategoryResponse } from "../adminCategoryTypes";

export function useAdminCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError("");

    try {
      setCategories(await getCategories());
    } catch (error) {
      console.error("Failed to load categories:", error);
      setError("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadInitialCategories() {
      try {
        const data = await getCategories();

        if (!ignore) {
          setCategories(data);
          setError("");
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (!ignore) {
          setError("Không thể tải danh sách danh mục");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialCategories();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return categories;
    }

    return categories.filter((category) =>
      [category.name, category.slug, category.parent?.name]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword))
    );
  }, [categories, searchTerm]);

  const parentCount = categories.filter((category) => !category.parent).length;
  const childCount = categories.length - parentCount;

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setParentCategoryId("");
    setShowModal(true);
  };

  const openEditModal = (category: CategoryResponse) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description ?? "");
    setParentCategoryId(category.parent?.id ? String(category.parent.id) : "");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingCategory(null);
    setName("");
    setDescription("");
    setParentCategoryId("");
  };

  const saveCategory = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    const payload = {
      name: trimmedName,
      description: description.trim() || undefined,
      parentCategoryId: parentCategoryId ? Number(parentCategoryId) : null,
    };

    try {
      setSaving(true);

      if (editingCategory) {
        const updatedCategory = await updateCategory(editingCategory.id, payload);
        setCategories((prev) =>
          prev.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          )
        );
      } else {
        const createdCategory = await createCategory(payload);
        setCategories((prev) => [createdCategory, ...prev]);
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Không thể lưu danh mục");
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (category: CategoryResponse) => {
    if (!window.confirm(`Xóa danh mục "${category.name}"?`)) {
      return;
    }

    try {
      setDeletingId(category.id);
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Không thể xóa danh mục. Danh mục có thể đang có sản phẩm hoặc danh mục con.");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    categories,
    filteredCategories,
    parentCount,
    childCount,
    loading,
    error,
    searchTerm,
    showModal,
    editingCategory,
    name,
    description,
    parentCategoryId,
    saving,
    deletingId,
    setSearchTerm,
    setName,
    setDescription,
    setParentCategoryId,
    loadCategories,
    openCreateModal,
    openEditModal,
    closeModal,
    saveCategory,
    removeCategory,
  };
}
