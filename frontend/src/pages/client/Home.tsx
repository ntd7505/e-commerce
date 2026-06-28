import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import HeroSection from '../../features/client/home/components/HeroSection';
import QuickServices from '../../features/client/home/components/QuickServices';
import FlashSaleSection from '../../features/client/home/components/FlashSaleSection';
import RecommendedSection from '../../features/client/home/components/RecommendedSection';
import CategorySidebar from '../../features/client/home/components/CategorySidebar';
import { useFlashSaleProducts } from '../../features/client/home/hooks/useFlashSaleProducts';
import { useRecommendedProducts } from '../../features/client/home/hooks/useRecommendedProducts';

const Home = () => {
  const {
    products: flashSaleProducts,
    loading: flashSaleLoading,
    error: flashSaleError,
  } = useFlashSaleProducts(10);

  const {
    products: recommendedProducts,
    loading: recommendedLoading,
    error: recommendedError,
  } = useRecommendedProducts(0, 10);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close drawer when navigating away
    closeDrawer();
  }, [location.pathname, location.search, closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [drawerOpen, closeDrawer]);

  return (
    <div className="bg-[var(--surface-0)] py-4">
      <div className="container-custom">
        {/* Mobile category trigger */}
        <div className="lg:hidden mb-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface rounded-lg border border-border text-sm font-semibold text-text hover:bg-canvas active:scale-[0.98] transition-all"
            aria-label="Mở danh mục sản phẩm"
          >
            <Menu className="w-4 h-4" />
            Danh mục sản phẩm
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-[14px] items-start">
          {/* Desktop Sidebar */}
          <div className="w-full lg:w-[180px] shrink-0 lg:sticky lg:top-4 hidden lg:block h-fit max-h-[calc(100vh-32px)] custom-scrollbar overflow-y-auto">
            <CategorySidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-[14px] w-full min-w-0">
            <HeroSection />
            <QuickServices />
            <FlashSaleSection
              products={flashSaleProducts}
              loading={flashSaleLoading}
              error={flashSaleError}
            />
            <RecommendedSection
              products={recommendedProducts}
              loading={recommendedLoading}
              error={recommendedError}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 transition-opacity"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <div
            className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-surface shadow-lg transition-transform duration-300 ease-out"
            role="dialog"
            aria-modal="true"
            aria-label="Danh mục sản phẩm"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-bold text-text">Danh mục</span>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-text-muted hover:bg-surface-alt hover:text-text transition-colors"
                aria-label="Đóng danh mục"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-48px)] custom-scrollbar py-2">
              <CategorySidebar />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
