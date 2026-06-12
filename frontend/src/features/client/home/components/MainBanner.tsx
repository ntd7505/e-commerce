import React, { useState, useEffect } from 'react';

const banners = [
  {
    title: "Galaxy S24 Ultra",
    subtitle: "Mở bán sớm - Giảm 5TR",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqxcUt27vcu-S55Wvma5tCYCHyPqZLoen1g9xg7ln-TYn7-Wp57K0H6N8oLjnT56DThqLHPtpvvtQ5fzA8fdDQ7Mb9FLbtuodJ9nVnuNNhdvJiz49PvEsnaRcLSiyIK9pSTFq5DOTn-OtA7W3KVKBSCskzyZZriHZGWVwmOQSLa2waYppLOHgTLMpUmxoEVCrpD0zcdNyRt2wjrYZyTV8H1Z9zfaj7Rvtc8JfNDTCtQ40dkJDROptPOyCXGOOtlRGYjzkErlvVCXXM",
    bg: "bg-[#d1e4f4]"
  },
  {
    title: "MacBook Pro M3",
    subtitle: "Hiệu năng bứt phá",
    img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830200",
    bg: "bg-gray-200"
  },
  {
    title: "Tai nghe Sony",
    subtitle: "Chống ồn đỉnh cao",
    img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    bg: "bg-[#e2e8f0]"
  }
];

const MainBanner = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };


  return (
    <>
      {/* Main Slider */}
      <section className="col-span-6 rounded-lg relative overflow-hidden group cursor-pointer" data-purpose="hero-slider">
        
        {/* Slider Track */}
        <div 
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className={`w-full h-full flex-shrink-0 flex items-center p-8 relative ${banner.bg}`}>
              <div className="z-10 w-1/2">
                <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
                <p className="text-xl mb-4">{banner.subtitle}</p>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center p-4">
                <img 
                  alt={banner.title} 
                  className="object-contain w-full h-full mix-blend-multiply" 
                  src={banner.img} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <span 
              key={index} 
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                currentIndex === index ? 'w-6 bg-nexa-blue' : 'w-2 bg-gray-400 hover:bg-gray-500'
              }`}
            ></span>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 text-gray-800 flex items-center justify-center hover:bg-white hover:shadow-md transition-all opacity-0 group-hover:opacity-100 z-20">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 text-gray-800 flex items-center justify-center hover:bg-white hover:shadow-md transition-all opacity-0 group-hover:opacity-100 z-20">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </section>

      {/* Promo Cards */}
      <section className="col-span-3 flex flex-col gap-4" data-purpose="promo-banners">
        <div className="flex-1 bg-[#b9d7ea] rounded-lg p-4 relative overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow">
          <div>
            <h4 className="font-bold text-lg">Tuần lễ Laptop</h4>
            <p className="text-sm">Deal đến 50%</p>
          </div>
          <img alt="Laptop Promo" className="self-end w-32" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSpUHjWhPK24A4ejppWJoEAWLhB732slfyFtDarQGXNdyLwDHgVmPCEgbHWLxH7QRVm8j31Rxm8UbnBuLoqcgNV2xHYslgkKTDaDtbRz8t0hSNVq89nSEt6BKfZNfgMgf0mwmANKsWZK0gFhab2MWZq9cDyFk2HQ8YDkp0JHNMoB2NsWq9ufEFEIeF71iJVg7DO5dPclAc7x09JS4uvFdAUPs5TpWM7VzIm3XzwhmmFyrrH8BrRN2vq8cKyjoeCQeKy4jRa8oAUYxV" />
        </div>
        <div className="flex-1 bg-[#3a3a3a] rounded-lg p-4 text-white relative overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow">
          <div>
            <h4 className="font-bold text-lg">Tai nghe SONY</h4>
            <p className="text-sm">Âm thanh đỉnh cao</p>
          </div>
          <img alt="Sony Promo" className="self-end w-32" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOFKyneMEd_OWF96GOMTMStWQIIiGrGb-A3MPSnZ1TBT-EEOiIJAPiRdIvvGC5LDawD0lt4C1tUUOAyMUOjeN-RQC_wzqmHXv0isnlmyMn2zijgzMYDfkNJh8sIoXKjkJV6JSB65c9N4oMMujqwo5G2aGkw0vw5gqjd1HWu1Z6VdbUzg66stwP88iJtGuZXkCjXwuv2Iqo36wvFN3nEW1H8KaQAgUQyvODVi5Sm-AIMYO68QHMxVE9P8J7nfVB_E5YhrwbeAkxiMpG" />
        </div>
      </section>
    </>
  );
};

export default MainBanner;
