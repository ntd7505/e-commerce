import React from 'react';
import CategorySidebar from './CategorySidebar';
import MainBanner from './MainBanner';

const HeroSection = () => {
  return (
    <main className="container-custom mt-4">
      <div className="grid grid-cols-12 gap-4 h-[380px]">
        <CategorySidebar />
        <MainBanner />
      </div>
    </main>
  );
};

export default HeroSection;
