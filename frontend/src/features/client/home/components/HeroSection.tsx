import React from 'react';
import MainBanner from './MainBanner';

const HeroSection = () => {
  return (
    <section className="w-full mt-4 lg:mt-0">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-[380px]">
        <MainBanner />
      </div>
    </section>
  );
};

export default HeroSection;
