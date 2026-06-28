import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/client/ProductCard';
import { useClientProducts } from '../../features/client/home/hooks/useClientProducts';
import { clientProductApi, type CategorySummaryResponse, type BrandSummaryResponse } from '../../features/client/home/clientProductApi';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState, EmptyState } from '../../components/common/States';
import { Filter, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { formatCurrency, calculateDiscountPercent } from '../../utils/formatters';
import { useAddToCartAction } from '../../features/client/cart/hooks/useAddToCartAction';

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

  const { handleAddToCart } = useAddToCartAction();

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
          // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="bg-surface/30 min-h-screen py-4">
      <div className="container-custom">
        <nav className="flex text-sm text-muted mb-6 gap-2">
          <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
          <span>&gt;</span>
          <span className="text-text">{breadcrumbTitle}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-wrap-balance text-2xl font-bold text-text mb-4">
            {headerTitle} <span className="text-lg font-normal text-muted">({totalElements} sản phẩm)</span>
          </h1>

          {/* Horizontal Filter Bar */}
          <div className="bg-surface border border-border-strong rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between filter-dropdown relative z-20">
            
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <span className="text-muted font-medium text-sm mr-2 hidden sm:inline-block"><Filter className="w-4 h-4 inline-block mr-1" /> Bộ lọc:</span>
              
              {/* Category Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                  aria-expanded={activeDropdown === 'category'}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${categoryId ? 'border-primary text-primary bg-primary-soft' : 'border-border-strong text-text hover:border-primary hover:text-primary'}`}
                >
                  Danh mục <ChevronDown className="w-3 h-3 ml-1 inline" />
                </button>
                {activeDropdown === 'category' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border rounded-xl p-4 z-50">
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                      <li>
                        <button
                          onClick={() => handleCategoryChange(undefined)}
                          className={`text-sm ${!categoryId ? 'font-bold text-primary' : 'text-muted hover:text-primary'}`}
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
                                  ? 'font-bold text-primary'
                                  : isChildActive
                                    ? 'font-semibold text-primary'
                                    : 'text-muted hover:text-primary'
                                  }`}
                              >
                                {cat.name}
                              </button>
                              {hasChildren && (
                                <button
                                  type="button"
                                  onClick={(e) => handleChevronClick(cat.id, e)}
                                  aria-expanded={isExpanded}
                                  className="p-1 text-muted hover:text-muted transition-colors border-0 cursor-pointer"
                                >
                                  <ChevronRight className={`w-2.5 h-2.5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''
                                    }`} />
                                </button>
                              )}
                            </div>

                            {hasChildren && isExpanded && (
                              <ul className="pl-4 mt-1 space-y-1 border-l border-border-strong ml-1">
                                {cat.children!.map(child => {
                                  const isSubActive = categoryId === child.id;
                                  return (
                                    <li key={child.id}>
                                      <button
                                        onClick={() => handleCategoryChange(child.id)}
                                        className={`text-xs text-left w-full cursor-pointer ${isSubActive
                                          ? 'font-semibold text-primary'
                                          : 'text-muted hover:text-primary'
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
                  aria-expanded={activeDropdown === 'brand'}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${brandId ? 'border-primary text-primary bg-primary-soft' : 'border-border-strong text-text hover:border-primary hover:text-primary'}`}
                >
                  Thương hiệu <ChevronDown className="w-3 h-3 ml-1 inline" />
                </button>
                {activeDropdown === 'brand' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border rounded-xl p-4 z-50">
                    <ul className="space-y-3 max-h-60 overflow-y-auto">
                      <li>
                        <button
                          onClick={() => handleBrandChange(undefined)}
                          className={`text-sm ${!brandId ? 'font-bold text-primary' : 'text-muted hover:text-primary'}`}
                        >
                          Tất cả thương hiệu
                        </button>
                      </li>
                      {brands.map(b => (
                        <li key={b.id} className="flex items-center gap-3">
                          <button
                            onClick={() => handleBrandChange(brandId === b.id ? undefined : b.id)}
                            className={`w-5 h-5 rounded flex items-center justify-center border ${brandId === b.id ? 'bg-primary border-primary text-white' : 'border-border-strong bg-surface'}`}
                          >
                            {brandId === b.id && <Check className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => handleBrandChange(brandId === b.id ? undefined : b.id)}
                            className="text-sm text-text cursor-pointer hover:text-primary transition-colors bg-transparent border-0 p-0"
                          >{b.name}</button>
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
                  aria-expanded={activeDropdown === 'price'}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${(minPrice || maxPrice) ? 'border-primary text-primary bg-primary-soft' : 'border-border-strong text-text hover:border-primary hover:text-primary'}`}
                >
                  Khoảng giá <ChevronDown className="w-3 h-3 ml-1 inline" />
                </button>
                {activeDropdown === 'price' && (
                  <div className="absolute top-full left-0 lg:left-auto lg:right-0 mt-2 w-72 bg-surface border border-border rounded-xl p-4 z-50">
                    <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-text">KHOẢNG GIÁ</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <label htmlFor="price-min" className="sr-only">Giá từ</label>
                      <input
                        id="price-min"
                        type="number"
                        placeholder="Từ"
                        className="w-full px-3 py-2 border border-border-strong rounded outline-none text-sm focus:border-primary"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                      />
                      <span className="text-muted">-</span>
                      <label htmlFor="price-max" className="sr-only">Giá đến</label>
                      <input
                        id="price-max"
                        type="number"
                        placeholder="Đến"
                        className="w-full px-3 py-2 border border-border-strong rounded outline-none text-sm focus:border-primary"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleApplyPrice}
                      className="w-full bg-primary text-white font-medium py-2 rounded text-sm hover:bg-primary-hover transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>

              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="text-sm text-danger font-medium hover:underline ml-2">Xóa bộ lọc</button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0 w-full lg:w-auto flex justify-end mt-4 lg:mt-0">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                aria-expanded={activeDropdown === 'sort'}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-strong text-text text-sm font-medium hover:border-primary transition-colors"
              >
                <span className="text-muted font-normal">Sắp xếp:</span> 
                {currentSortKey === 'createdAt-desc' ? 'Hàng mới' : currentSortKey === 'price-asc' ? 'Giá thấp đến cao' : currentSortKey === 'price-desc' ? 'Giá cao đến thấp' : 'Phổ biến'}
                <ChevronDown className="w-3 h-3 ml-1 inline" />
              </button>
              {activeDropdown === 'sort' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl p-2 z-50">
                  <button onClick={() => { handleSortChange('createdAt', 'desc'); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-sm rounded hover:bg-surface ${currentSortKey === 'createdAt-desc' ? 'text-primary font-medium bg-primary-soft' : 'text-text'}`}>Hàng mới</button>
                  <button onClick={() => { handleSortChange('price', 'asc'); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-sm rounded hover:bg-surface ${currentSortKey === 'price-asc' ? 'text-primary font-medium bg-primary-soft' : 'text-text'}`}>Giá thấp đến cao</button>
                  <button onClick={() => { handleSortChange('price', 'desc'); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-sm rounded hover:bg-surface ${currentSortKey === 'price-desc' ? 'text-primary font-medium bg-primary-soft' : 'text-text'}`}>Giá cao đến thấp</button>
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
                <div key={i} className="animate-pulse bg-surface rounded-lg p-4 border border-border flex flex-col h-[300px]">
                  <div className="w-full aspect-square bg-border rounded-md mb-4"></div>
                  <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-border rounded w-1/2 mb-auto"></div>
                  <div className="h-6 bg-border rounded w-1/3 mt-4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ErrorState message={error} />
              <button onClick={refetch} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                Thử lại
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-2xl border border-border shadow-sm flex flex-col items-center">
              <EmptyState message="Không tìm thấy sản phẩm nào phù hợp với bộ lọc." />
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="mt-6 px-6 py-2 bg-primary-soft text-primary font-medium rounded-lg hover:bg-primary-soft transition-colors">
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
                  const validVariant = product.variants?.find(v => v.active && (!('deleted' in v) || !(v as Record<string, unknown>).deleted) && v.stockQuantity > 0);
                  const displayVariant = validVariant || product.variants?.find(v => v.active);
                  const currentPrice = displayVariant && displayVariant.salePrice > 0 && displayVariant.salePrice < displayVariant.price
                    ? displayVariant.salePrice
                    : displayVariant?.price || 0;
                  const originalPrice = displayVariant && displayVariant.price > currentPrice ? displayVariant.price : null;

                  return (
                    <ProductCard
                      key={product.id}
                      image={thumbnailImage}
                      name={product.name}
                      slug={product.slug}
                      price={displayVariant ? formatCurrency(currentPrice) : "Chưa có giá"}
                      originalPrice={originalPrice ? formatCurrency(originalPrice) : ""}
                      discountBadge={originalPrice ? calculateDiscountPercent(originalPrice, currentPrice) : ""}
                      isFlashSale={false}
                      onAddToCart={validVariant ? () => handleAddToCart(validVariant.id, 1, product.name) : undefined}
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
