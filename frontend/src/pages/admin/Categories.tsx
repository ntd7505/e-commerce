import { CategoryHeader } from "../../features/admin/categories/components/CategoryHeader";
import { CategoryModal } from "../../features/admin/categories/components/CategoryModal";
import { CategoryStats } from "../../features/admin/categories/components/CategoryStats";
import { CategoryTable } from "../../features/admin/categories/components/CategoryTable";
import { useAdminCategories } from "../../features/admin/categories/hooks/useAdminCategories";
import { Container, Section } from "../../components/common";

export default function Categories() {
  const categoriesPage = useAdminCategories();

  return (
    <Container size="wide">
      <Section spacing="md" className="space-y-6">
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
      </Section>
    </Container>
  );
}
