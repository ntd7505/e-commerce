import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/client/ProductCard';
import { useClientProducts } from '../../features/client/home/hooks/useClientProducts';
import { clientProductApi, type CategorySummaryResponse, type BrandSummaryResponse } from '../../features/client/home/clientProductApi';
import { Pagination } from '../../components/common/Pagination';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { Filter } from 'lucide-react';
import { formatCurrency, calculateDiscountPercent } from '../../utils/formatters';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '12', 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') || 'desc';
  const keyword = searchParams.get('keyword') || undefined;
  const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;
  const brandId = searchParams.get('brandId') ? parseInt(searchParams.get('brandId')!) : undefined;

  const { products, totalPages, loading, error } = useClientProducts({
    page, size, sortBy, sortDir, keyword, categoryId, brandId
  });

  const [categories, setCategories] = useState<CategorySummaryResponse[]>([]);
  const [brands, setBrands] = useState<BrandSummaryResponse[]>([]);

  useEffect(() => {
    clientProductApi.getCategories().then(setCategories).catch(console.error);
    clientProductApi.getBrands().then(setBrands).catch(console.error);
  }, []);

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy: string, newSortDir: string) => {
    searchParams.set('sortBy', newSortBy);
    searchParams.set('sortDir', newSortDir);
    searchParams.set('page', '0');
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (id?: number) => {
    if (id) searchParams.set('categoryId', id.toString());
    else searchParams.delete('categoryId');
    searchParams.set('page', '0');
    setSearchParams(searchParams);
  };

  const handleBrandChange = (id?: number) => {
    if (id) searchParams.set('brandId', id.toString());
    else searchParams.delete('brandId');
    searchParams.set('page', '0');
    setSearchParams(searchParams);
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : 'Tất cả sản phẩm'}
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Sắp xếp:</span>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                handleSortChange(sb, sd);
              }}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="name-asc">Tên: A-Z</option>
              <option value="name-desc">Tên: Z-A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Danh mục
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategoryChange(undefined)}
                  className={`text-sm ${!categoryId ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  Tất cả danh mục
                </button>
              </li>
              {categories.map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => handleCategoryChange(c.id)}
                    className={`text-sm ${categoryId === c.id ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Thương hiệu</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleBrandChange(undefined)}
                  className={`text-sm ${!brandId ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  Tất cả thương hiệu
                </button>
              </li>
              {brands.map(b => (
                <li key={b.id}>
                  <button
                    onClick={() => handleBrandChange(b.id)}
                    className={`text-sm ${brandId === b.id ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : products.length === 0 ? (
            <EmptyState message="Không tìm thấy sản phẩm nào phù hợp với bộ lọc." />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map(product => {
                  const thumbnailImage = product.media?.find(m => m.thumbnail)?.url || product.media?.[0]?.url || '';
                  const firstVariant = product.variants?.[0];
                  const currentPrice = firstVariant?.salePrice > 0 ? firstVariant.salePrice : firstVariant?.price || 0;
                  const originalPrice = firstVariant?.price > currentPrice ? firstVariant.price : null;

                  return (
                    <ProductCard
                      key={product.id}
                      image={thumbnailImage}
                      name={product.name}
                      slug={product.slug}
                      price={formatCurrency(currentPrice)}
                      originalPrice={originalPrice ? formatCurrency(originalPrice) : ""}
                      discountBadge={originalPrice ? calculateDiscountPercent(originalPrice, currentPrice) : ""}
                      isFlashSale={false}
                    />
                  );
                })}
              </div>

              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
