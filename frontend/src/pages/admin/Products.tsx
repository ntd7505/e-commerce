import { ProductListHeader } from '../../features/admin/products/components/ProductListHeader';
import { ProductStats } from '../../features/admin/products/components/ProductStats';
import { ProductTable } from '../../features/admin/products/components/ProductTable';
import { useAdminProductsList } from '../../features/admin/products/hooks/useAdminProductsList';
import { Container, Section } from '../../components/common';

export default function Products() {
  const productsList = useAdminProductsList();

  return (
    <Container size="wide">
      <Section spacing="md" className="space-y-6">
        <ProductListHeader
          loading={productsList.loading}
          onRefresh={productsList.loadProducts}
        />

        <ProductStats products={productsList.products} />

        <ProductTable
          products={productsList.products}
          filteredProducts={productsList.filteredProducts}
          paginatedProducts={productsList.paginatedProducts}
          loading={productsList.loading}
          error={productsList.error}
          searchTerm={productsList.searchTerm}
          statusFilter={productsList.statusFilter}
          updatingId={productsList.updatingId}
          page={productsList.page}
          pageSize={productsList.pageSize}
          totalPages={productsList.totalPages}
          onSearchChange={productsList.setSearchTerm}
          onStatusFilterChange={productsList.setStatusFilter}
          onPageChange={productsList.setPage}
          onToggleStatus={productsList.toggleStatus}
        />
      </Section>
    </Container>
  );
}
