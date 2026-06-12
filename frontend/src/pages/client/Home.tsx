import React, { useEffect } from 'react';
import HeroSection from '../../features/client/home/components/HeroSection';
import QuickServices from '../../features/client/home/components/QuickServices';
import FlashSaleSection from '../../features/client/home/components/FlashSaleSection';
import RecommendedSection from '../../features/client/home/components/RecommendedSection';


import { clientProductApi } from '../../features/client/home/clientProductApi';


const Home = () => {

  useEffect(() => {
    console.log("Bắt đầu test gọi API...");

    // Gọi thử lấy 5 sản phẩm đầu tiên
    clientProductApi.getProductsPageable(0, 5)
      .then(data => {
        console.log("✅ Lấy dữ liệu THÀNH CÔNG! Kết quả là:", data);
      })
      .catch(error => {
        console.error("❌ Gọi API THẤT BẠI. Lỗi:", error);
      });
  }, []);

  return (
    <div>
      <HeroSection />
      <QuickServices />
      <FlashSaleSection />
      <RecommendedSection />
    </div>
  );
};

export default Home;
