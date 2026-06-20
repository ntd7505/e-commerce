import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clientProductApi, type CategorySummaryResponse } from '../clientProductApi';

/* ──────────── Skeleton items ──────────── */
const SkeletonItem = () => (
  <li className="flex items-center gap-3 p-3 animate-pulse">
    <div className="w-5 h-5 bg-gray-200 rounded" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
  </li>
);

const CategorySidebar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategoryId = searchParams.get('categoryId')
    ? parseInt(searchParams.get('categoryId')!)
    : null;

  const [categories, setCategories] = useState<CategorySummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    clientProductApi
      .getCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
          setError(false);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh mục:', err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (activeCategoryId && categories.length > 0) {
      const activeCat = categories.find((c) => c.id === activeCategoryId);
      if (activeCat) {
        if (activeCat.parent) {
          setExpandedCategories((prev) => ({ ...prev, [activeCat.parent!.id]: true }));
        } else {
          setExpandedCategories((prev) => ({ ...prev, [activeCat.id]: true }));
        }
      }
    }
  }, [activeCategoryId, categories]);

  const handleCategoryClick = (categoryId: number, hasChildren: boolean) => {
    navigate(`/products?categoryId=${categoryId}`);
    if (hasChildren) {
      setExpandedCategories((prev) => ({
        ...prev,
        [categoryId]: !prev[categoryId],
      }));
    }
  };

  const handleChevronClick = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const parentCategories = categories.filter((c) => !c.parent);

  return (
    <aside className="w-full" data-purpose="category-sidebar">
      <h3 className="font-bold text-gray-900 mb-2 px-3 pt-3 flex items-center gap-2 uppercase tracking-wide text-sm">
        <i className="fa-solid fa-list text-nexa-blue"></i> Danh mục
      </h3>
      <ul className="text-sm p-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)
        ) : error ? (
          <li className="p-3 text-center text-gray-500 text-xs">
            <i className="fa-solid fa-circle-exclamation text-gray-400 mb-1 block text-lg"></i>
            Không thể tải danh mục
          </li>
        ) : parentCategories.length === 0 ? (
          <li className="p-3 text-center text-gray-500 text-xs">
            Chưa có danh mục nào
          </li>
        ) : (
          parentCategories.map((cat) => {
            const hasChildren = !!(cat.children && cat.children.length > 0);
            const isExpanded = !!expandedCategories[cat.id];
            const isParentActive = activeCategoryId === cat.id;
            const isChildActive = cat.children?.some((child) => activeCategoryId === child.id) || false;
            const isActive = isParentActive || isChildActive;

            return (
              <li key={cat.id} className="mb-1">
                <div
                  onClick={() => handleCategoryClick(cat.id, hasChildren)}
                  className={`flex items-center justify-between p-3 rounded cursor-pointer group transition-colors ${
                    isParentActive
                      ? 'bg-blue-50 text-nexa-blue font-semibold'
                      : isChildActive
                      ? 'text-nexa-blue font-medium bg-blue-50/50'
                      : 'hover:bg-gray-50 hover:text-nexa-blue'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`fa-solid fa-tag w-5 text-gray-500 group-hover:text-nexa-blue group-hover:scale-110 transition-all ${isActive ? 'text-nexa-blue' : ''}`}></i>
                    <span className="font-medium group-hover:font-semibold transition-all">
                      {cat.name}
                    </span>
                  </div>
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => handleChevronClick(cat.id, e)}
                      className="p-1 rounded hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors border-0 flex items-center justify-center cursor-pointer"
                    >
                      <i className={`fa-solid fa-chevron-right text-[10px] transition-transform duration-300 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}></i>
                    </button>
                  ) : (
                    <i className={`fa-solid fa-chevron-right text-[10px] transition-all group-hover:translate-x-1 ${
                      isParentActive
                        ? 'text-nexa-blue opacity-100'
                        : 'text-gray-300 group-hover:text-nexa-blue opacity-0 group-hover:opacity-100'
                    }`}></i>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <ul className="pl-6 mt-1 space-y-1 border-l-2 border-gray-100 ml-5">
                    {cat.children!.map((child) => {
                      const isSubActive = activeCategoryId === child.id;
                      return (
                        <li
                          key={child.id}
                          onClick={() => navigate(`/products?categoryId=${child.id}`)}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors text-xs ${
                            isSubActive
                              ? 'text-nexa-blue font-semibold bg-blue-50/30'
                              : 'text-gray-600 hover:text-nexa-blue hover:bg-gray-50/50'
                          }`}
                        >
                          <span className="font-medium">{child.name}</span>
                          {isSubActive && (
                            <i className="fa-solid fa-check text-[10px] text-nexa-blue"></i>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
};

export default CategorySidebar;
