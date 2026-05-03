import { BrandHeader } from "../../features/brands/components/BrandHeader";
import { BrandModal } from "../../features/brands/components/BrandModal";
import { BrandStats } from "../../features/brands/components/BrandStats";
import { BrandTable } from "../../features/brands/components/BrandTable";
import { useAdminBrands } from "../../features/brands/hooks/useAdminBrands";

export default function Brands() {
  const brandsPage = useAdminBrands();

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      <BrandHeader
        loading={brandsPage.loading}
        onRefresh={brandsPage.loadBrands}
        onAdd={brandsPage.openCreateModal}
      />

      <BrandStats brands={brandsPage.brands} />

      <BrandTable
        brands={brandsPage.brands}
        filteredBrands={brandsPage.filteredBrands}
        loading={brandsPage.loading}
        error={brandsPage.error}
        searchTerm={brandsPage.searchTerm}
        updatingId={brandsPage.updatingId}
        onSearchChange={brandsPage.setSearchTerm}
        onEdit={brandsPage.openEditModal}
        onDelete={brandsPage.removeBrand}
        onToggleStatus={brandsPage.toggleStatus}
      />

      <BrandModal
        show={brandsPage.showModal}
        editingBrand={brandsPage.editingBrand}
        brandName={brandsPage.brandName}
        logoUrl={brandsPage.logoUrl}
        saving={brandsPage.saving}
        onNameChange={brandsPage.setBrandName}
        onLogoChange={brandsPage.setLogoUrl}
        onClose={brandsPage.closeModal}
        onSave={brandsPage.saveBrand}
      />
    </div>
  );
}
