import { ProductListHeader } from '../../features/adminProducts/components/ProductListHeader';
import { ProductStats } from '../../features/adminProducts/components/ProductStats';
import { ProductTable } from '../../features/adminProducts/components/ProductTable';
import { useAdminProductsList } from '../../features/adminProducts/hooks/useAdminProductsList';

export default function Products() {
  const productsList = useAdminProductsList();

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      <ProductListHeader
        loading={productsList.loading}
        onRefresh={productsList.loadProducts}
      />

      <ProductStats products={productsList.products} />

      <ProductTable
        products={productsList.products}
        filteredProducts={productsList.filteredProducts}
        loading={productsList.loading}
        error={productsList.error}
        searchTerm={productsList.searchTerm}
        updatingId={productsList.updatingId}
        onSearchChange={productsList.setSearchTerm}
        onToggleStatus={productsList.toggleStatus}
      />
    </div>
  );
}
