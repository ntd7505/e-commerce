import React from 'react';
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

  return (
    <div className="bg-[var(--surface-0)] py-4">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-[14px] items-start">
          {/* Left Sidebar */}
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
    </div>
  );
};

export default Home;
