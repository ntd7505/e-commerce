import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, Check, AlertCircle } from 'lucide-react';
import { clientProductApi, type CategorySummaryResponse } from '../clientProductApi';

/* ──────────── Skeleton items ──────────── */
const SkeletonItem = () => (
  <li className="flex items-center gap-3 p-3 animate-pulse">
    <div className="w-5 h-5 bg-border rounded" />
    <div className="h-4 bg-border rounded w-3/4" />
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
          // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <aside className="w-full bg-surface border border-border rounded-xl py-4 h-max shadow-sm shadow-primary/5" data-purpose="category-sidebar">
      <div className="text-xs text-muted uppercase tracking-[0.1em] font-medium px-4 mb-3">Danh mục</div>
      <ul className="flex flex-col px-2 gap-0.5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)
        ) : error ? (
          <li className="p-3 text-center text-[var(--text-muted)] text-xs">
            <AlertCircle className="w-4 h-4 text-[var(--text-muted)] mb-1 block mx-auto" />
            Lỗi tải danh mục
          </li>
        ) : parentCategories.length === 0 ? (
          <li className="p-3 text-center text-[var(--text-muted)] text-xs">
            Chưa có danh mục nào
          </li>
        ) : (
          parentCategories.map((cat) => {
            const hasChildren = !!(cat.children && cat.children.length > 0);
            const isExpanded = !!expandedCategories[cat.id];
            const isParentActive = activeCategoryId === cat.id;
            const isChildActive = cat.children?.some((child) => activeCategoryId === child.id) || false;

            return (
              <li key={cat.id}>
                <div
                  onClick={() => handleCategoryClick(cat.id, hasChildren)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors group ${
                    isParentActive || isChildActive
                      ? 'bg-primary-soft text-primary font-medium'
                      : 'hover:bg-primary-soft/50 text-text'
                  }`}
                >
                  <span className="text-sm leading-[1.3] pr-2 flex-1">{cat.name}</span>
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => handleChevronClick(cat.id, e)}
                      className="p-1 text-[var(--text-muted)] transition-colors border-0 flex items-center justify-center cursor-pointer bg-transparent rounded-[4px] hover:bg-black/5"
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-90' : ''
                      }`} />
                    </button>
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 transition-colors ${
                      isParentActive || isChildActive ? 'text-primary' : 'text-transparent group-hover:text-muted'
                    }`} />
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <ul className="pl-3 mt-1 mb-2 space-y-0.5 border-l-[1.5px] border-[var(--border)] ml-4">
                    {cat.children!.map((child) => {
                      const isSubActive = activeCategoryId === child.id;
                      return (
                        <li
                          key={child.id}
                          onClick={() => navigate(`/products?categoryId=${child.id}`)}
                          className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-xs rounded-r-md ${
                            isSubActive
                              ? 'text-primary font-medium bg-primary-soft'
                              : 'text-muted hover:text-primary hover:bg-primary-soft/50'
                          }`}
                        >
                          <span className="leading-[1.3] flex-1">{child.name}</span>
                          {isSubActive && (
                            <Check className="w-3 h-3 text-primary ml-2 shrink-0" />
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
