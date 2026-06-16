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

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?categoryId=${categoryId}`);
  };

  return (
    <aside className="col-span-3 bg-white rounded-lg p-2 shadow-sm hidden md:block h-full overflow-y-auto custom-scrollbar" data-purpose="category-sidebar">
      <ul className="text-sm">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)
        ) : error ? (
          <li className="p-3 text-center text-gray-500 text-xs">
            <i className="fa-solid fa-circle-exclamation text-gray-400 mb-1 block text-lg"></i>
            Không thể tải danh mục
          </li>
        ) : categories.length === 0 ? (
          <li className="p-3 text-center text-gray-500 text-xs">
            Chưa có danh mục nào
          </li>
        ) : (
          categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <li
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center justify-between p-3 rounded cursor-pointer group transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-nexa-blue font-semibold'
                    : 'hover:bg-gray-50 hover:text-nexa-blue'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className={`fa-solid fa-tag w-5 text-gray-500 group-hover:text-nexa-blue group-hover:scale-110 transition-all ${isActive ? 'text-nexa-blue' : ''}`}></i>
                  <span className="font-medium group-hover:font-semibold transition-all">
                    {cat.name}
                  </span>
                </div>
                <i className={`fa-solid fa-chevron-right text-[10px] transition-all group-hover:translate-x-1 ${
                  isActive
                    ? 'text-nexa-blue opacity-100'
                    : 'text-gray-300 group-hover:text-nexa-blue opacity-0 group-hover:opacity-100'
                }`}></i>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
};

export default CategorySidebar;
