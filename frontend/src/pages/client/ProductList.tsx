import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/client/ProductCard';
import { useClientProducts } from '../../features/client/home/hooks/useClientProducts';
import { clientProductApi, type CategorySummaryResponse, type BrandSummaryResponse } from '../../features/client/home/clientProductApi';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState, EmptyState } from '../../components/common/States';
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
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;

  const { products, totalPages, totalElements, loading, error, refetch } = useClientProducts({
    page, size, sortBy, sortDir, keyword, categoryId, brandId, minPrice, maxPrice
  });

  const [categories, setCategories] = useState<CategorySummaryResponse[]>([]);
  const [brands, setBrands] = useState<BrandSummaryResponse[]>([]);
  const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice ? minPrice.toString() : '');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice ? maxPrice.toString() : '');
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'brand' | 'price' | 'sort' | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.filter-dropdown')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLocalMinPrice(minPrice ? minPrice.toString() : '');
    setLocalMaxPrice(maxPrice ? maxPrice.toString() : '');
  }, [minPrice, maxPrice]);

  const hasActiveFilters = !!(keyword || categoryId || brandId || minPrice || maxPrice);

  const handleClearFilters = () => {
    searchParams.delete('keyword');
    searchParams.delete('categoryId');
    searchParams.delete('brandId');
    searchParams.delete('minPrice');
    searchParams.delete('maxPrice');
    searchParams.set('page', '0');
    setSearchParams(searchParams);
    setActiveDropdown(null);
  };

  const handleApplyPrice = () => {
    if (localMinPrice) searchParams.set('minPrice', localMinPrice);
    else searchParams.delete('minPrice');
    
    if (localMaxPrice) searchParams.set('maxPrice', localMaxPrice);
    else searchParams.delete('maxPrice');
    
    searchParams.set('page', '0');
    setSearchParams(searchParams);
    setActiveDropdown(null);
  };

  useEffect(() => {
    clientProductApi.getCategories().then(setCategories).catch(console.error);
    clientProductApi.getBrands().then(setBrands).catch(console.error);
  }, []);

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const activeCat = categories.find((c) => c.id === categoryId);
      if (activeCat) {
        if (activeCat.parent) {
          setExpandedCategories((prev) => ({ ...prev, [activeCat.parent!.id]: true }));
        } else {
          setExpandedCategories((prev) => ({ ...prev, [activeCat.id]: true }));
        }
      }
    }
  }, [categoryId, categories]);

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
    setActiveDropdown(null);
  };

  const handleCategoryClick = (id?: number, hasChildren?: boolean) => {
    handleCategoryChange(id);
    if (id && hasChildren) {
      setExpandedCategories((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const handleChevronClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBrandChange = (id?: number) => {
    if (id) searchParams.set('brandId', id.toString());
    else searchParams.delete('brandId');
    searchParams.set('page', '0');
    setSearchParams(searchParams);
    setActiveDropdown(null);
  };

  let headerTitle = 'Tất cả sản phẩm';
  let breadcrumbTitle = 'Tất cả sản phẩm';

  if (keyword) {
    headerTitle = `Kết quả tìm kiếm cho "${keyword}"`;
    breadcrumbTitle = `Kết quả tìm kiếm cho "${keyword}"`;
  } else if (categoryId) {
    const activeCat = categories.find(c => c.id === categoryId) || categories.flatMap(c => c.children || []).find(c => c.id === categoryId);
    if (activeCat) {
      headerTitle = activeCat.name;
      breadcrumbTitle = activeCat.name;
    }
  } else if (brandId) {
    const activeBrand = brands.find(b => b.id === brandId);
    if (activeBrand) {
      headerTitle = activeBrand.name;
      breadcrumbTitle = activeBrand.name;
    }
  }

  const currentSortKey = `${sortBy}-${sortDir}`;

  return (
    <div className="bg-gray-50/30 min-h-screen py-4">
      <div className="container-custom">
        <nav className="flex text-sm text-gray-500 mb-6 gap-2">
          <a href="/" className="hover:text-blue-600 transition-colors">Trang chủ</a>
          <span>&gt;</span>
          <span className="text-gray-900">{breadcrumbTitle}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {headerTitle} <span className="text-lg font-normal text-gray-500">({totalElements} sản phẩm)</span>
          </h1>

          {/* Horizontal Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between filter-dropdown relative z-20">
            
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <span className="text-gray-500 font-medium text-sm mr-2 hidden sm:inline-block"><Filter className="w-4 h-4 inline-block mr-1" /> Bộ lọc:</span>
              
              {/* Category Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${categoryId ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'}`}
                >
                  Danh mục <i className="fa-solid fa-chevron-down ml-1 text-[10px]"></i>
                </button>
                {activeDropdown === 'category' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-xl p-4 z-50">
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                      <li>
                        <button
                          onClick={() => handleCategoryChange(undefined)}
                          className={`text-sm ${!categoryId ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                          Tất cả danh mục
                        </button>
                      </li>
                      {categories.filter(c => !c.parent).map(cat => {
                        const hasChildren = !!(cat.children && cat.children.length > 0);
                        const isExpanded = !!expandedCategories[cat.id];
                        const isParentActive = categoryId === cat.id;
                        const isChildActive = cat.children?.some(child => categoryId === child.id) || false;

                        return (
                          <li key={cat.id} className="space-y-1">
                            <div className="flex items-center justify-between group">
                              <button
                                onClick={() => handleCategoryClick(cat.id, hasChildren)}
                                className={`text-sm text-left flex-grow cursor-pointer ${isParentActive
                                  ? 'font-bold text-blue-600'
                                  : isChildActive
                                    ? 'font-semibold text-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                                  }`}
                              >
                                {cat.name}
                              </button>
                              {hasChildren && (
                                <button
                                  type="button"
                                  onClick={(e) => handleChevronClick(cat.id, e)}
                                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors border-0 cursor-pointer"
                                >
                                  <i className={`fa-solid fa-chevron-right text-[9px] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''
                                    }`}></i>
                                </button>
                              )}
                            </div>

                            {hasChildren && isExpanded && (
                              <ul className="pl-4 mt-1 space-y-1 border-l border-gray-200 ml-1">
                                {cat.children!.map(child => {
                                  const isSubActive = categoryId === child.id;
                                  return (
                                    <li key={child.id}>
                                      <button
                                        onClick={() => handleCategoryChange(child.id)}
                                        className={`text-xs text-left w-full cursor-pointer ${isSubActive
                                          ? 'font-semibold text-blue-600'
                                          : 'text-gray-500 hover:text-blue-600'
                                          }`}
                                      >
                                        {child.name}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Brand Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'brand' ? null : 'brand')}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${brandId ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'}`}
                >
                  Thương hiệu <i className="fa-solid fa-chevron-down ml-1 text-[10px]"></i>
                </button>
                {activeDropdown === 'brand' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-xl p-4 z-50">
                    <ul className="space-y-3 max-h-60 overflow-y-auto">
                      <li>
                        <button
                          onClick={() => handleBrandChange(undefined)}
                          className={`text-sm ${!brandId ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                          Tất cả thương hiệu
                        </button>
                      </li>
                      {brands.map(b => (
                        <li key={b.id} className="flex items-center gap-3">
                          <button
                            onClick={() => handleBrandChange(brandId === b.id ? undefined : b.id)}
                            className={`w-5 h-5 rounded flex items-center justify-center border ${brandId === b.id ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'}`}
                          >
                            {brandId === b.id && <i className="fa-solid fa-check text-xs"></i>}
                          </button>
                          <span className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleBrandChange(brandId === b.id ? undefined : b.id)}>{b.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Price Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${(minPrice || maxPrice) ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'}`}
                >
                  Khoảng giá <i className="fa-solid fa-chevron-down ml-1 text-[10px]"></i>
                </button>
                {activeDropdown === 'price' && (
                  <div className="absolute top-full left-0 lg:left-auto lg:right-0 mt-2 w-72 bg-white border border-gray-100 shadow-xl rounded-xl p-4 z-50">
                    <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-gray-900">KHOẢNG GIÁ</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="number"
                        placeholder="Từ"
                        className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-sm focus:border-blue-500"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        placeholder="Đến"
                        className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-sm focus:border-blue-500"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleApplyPrice}
                      className="w-full bg-blue-600 text-white font-medium py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>

              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="text-sm text-red-500 font-medium hover:underline ml-2">Xóa bộ lọc</button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0 w-full lg:w-auto flex justify-end mt-4 lg:mt-0">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:border-blue-600 transition-colors"
              >
                <span className="text-gray-500 font-normal">Sắp xếp:</span> 
                {currentSortKey === 'createdAt-desc' ? 'Hàng mới' : currentSortKey === 'price-asc' ? 'Giá thấp đến cao' : currentSortKey === 'price-desc' ? 'Giá cao đến thấp' : 'Phổ biến'}
                <i className="fa-solid fa-chevron-down ml-1 text-[10px]"></i>
              </button>
              {activeDropdown === 'sort' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl p-2 z-50">
                  <button onClick={() => { handleSortChange('createdAt', 'desc'); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-sm rounded hover:bg-gray-50 ${currentSortKey === 'createdAt-desc' ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}>Hàng mới</button>
                  <button onClick={() => { handleSortChange('price', 'asc'); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-sm rounded hover:bg-gray-50 ${currentSortKey === 'price-asc' ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}>Giá thấp đến cao</button>
                  <button onClick={() => { handleSortChange('price', 'desc'); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-sm rounded hover:bg-gray-50 ${currentSortKey === 'price-desc' ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}>Giá cao đến thấp</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg p-4 border border-gray-100 flex flex-col h-[300px]">
                  <div className="w-full aspect-square bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-auto"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ErrorState message={error} />
              <button onClick={refetch} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Thử lại
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
              <EmptyState message="Không tìm thấy sản phẩm nào phù hợp với bộ lọc." />
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors">
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.map(product => {
                  const activeMedia = product.media?.filter(m => m.active !== false).sort((a, b) => a.sortOrder - b.sortOrder) || [];
                  const thumbnailImage = activeMedia.find(m => m.thumbnail)?.url || activeMedia[0]?.url || '';
                  const validVariant = product.variants?.find(v => v.active);
                  const currentPrice = validVariant && validVariant.salePrice > 0 && validVariant.salePrice < validVariant.price
                    ? validVariant.salePrice
                    : validVariant?.price || 0;
                  const originalPrice = validVariant && validVariant.price > currentPrice ? validVariant.price : null;

                  return (
                    <ProductCard
                      key={product.id}
                      image={thumbnailImage}
                      name={product.name}
                      slug={product.slug}
                      price={validVariant ? formatCurrency(currentPrice) : "Chưa có giá"}
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
