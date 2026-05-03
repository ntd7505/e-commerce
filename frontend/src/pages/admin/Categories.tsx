import { CategoryHeader } from "../../features/categories/components/CategoryHeader";
import { CategoryModal } from "../../features/categories/components/CategoryModal";
import { CategoryStats } from "../../features/categories/components/CategoryStats";
import { CategoryTable } from "../../features/categories/components/CategoryTable";
import { useAdminCategories } from "../../features/categories/hooks/useAdminCategories";

export default function Categories() {
  const categoriesPage = useAdminCategories();

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      <CategoryHeader
        loading={categoriesPage.loading}
        onRefresh={categoriesPage.loadCategories}
        onAdd={categoriesPage.openCreateModal}
      />

      <CategoryStats
        total={categoriesPage.categories.length}
        parentCount={categoriesPage.parentCount}
        childCount={categoriesPage.childCount}
      />

      <CategoryTable
        categories={categoriesPage.categories}
        filteredCategories={categoriesPage.filteredCategories}
        loading={categoriesPage.loading}
        error={categoriesPage.error}
        searchTerm={categoriesPage.searchTerm}
        deletingId={categoriesPage.deletingId}
        onSearchChange={categoriesPage.setSearchTerm}
        onEdit={categoriesPage.openEditModal}
        onDelete={categoriesPage.removeCategory}
      />

      <CategoryModal
        show={categoriesPage.showModal}
        categories={categoriesPage.categories}
        editingCategory={categoriesPage.editingCategory}
        name={categoriesPage.name}
        description={categoriesPage.description}
        parentCategoryId={categoriesPage.parentCategoryId}
        saving={categoriesPage.saving}
        onNameChange={categoriesPage.setName}
        onDescriptionChange={categoriesPage.setDescription}
        onParentChange={categoriesPage.setParentCategoryId}
        onClose={categoriesPage.closeModal}
        onSave={categoriesPage.saveCategory}
      />
    </div>
  );
}
