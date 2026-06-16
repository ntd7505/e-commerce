import React from 'react';
import HeroSection from '../../features/client/home/components/HeroSection';
import QuickServices from '../../features/client/home/components/QuickServices';
import FlashSaleSection from '../../features/client/home/components/FlashSaleSection';
import RecommendedSection from '../../features/client/home/components/RecommendedSection';
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
    <div>
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
  );
};

export default Home;
