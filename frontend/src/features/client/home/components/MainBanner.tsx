import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    title: 'Galaxy S24 Ultra',
    subtitle: 'Mở bán sớm - Giảm 5TR',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqxcUt27vcu-S55Wvma5tCYCHyPqZLoen1g9xg7ln-TYn7-Wp57K0H6N8oLjnT56DThqLHPtpvvtQ5fzA8fdDQ7Mb9FLbtuodJ9nVnuNNhdvJiz49PvEsnaRcLSiyIK9pSTFq5DOTn-OtA7W3KVKBSCskzyZZriHZGWVwmOQSLa2waYppLOHgTLMpUmxoEVCrpD0zcdNyRt2wjrYZyTV8H1Z9zfaj7Rvtc8JfNDTCtQ40dkJDROptPOyCXGOOtlRGYjzkErlvVCXXM',
    bg: 'bg-[#d1e4f4]',
  },
  {
    title: 'MacBook Pro M3',
    subtitle: 'Hiệu năng bứt phá',
    img: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830200',
    bg: 'bg-gray-200',
  },
  {
    title: 'Tai nghe Sony',
    subtitle: 'Chống ồn đỉnh cao',
    img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
    bg: 'bg-[#e2e8f0]',
  },
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
    <div className="h-auto md:h-[380px] flex flex-col md:grid md:grid-cols-[1fr_220px] lg:grid-cols-[1fr_260px] gap-[14px]">
      {/* Main carousel — Left Block */}
      <div className="relative overflow-hidden group cursor-pointer min-h-[200px] md:min-h-0 flex-1 rounded-[10px] border-[0.5px] border-[var(--border)] bg-white">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className={`w-full min-w-full h-full shrink-0 flex items-center p-6 md:p-10 relative ${banner.bg}`}>
              <div className="z-10 w-2/3 md:w-1/2">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 text-gray-900">{banner.title}</h2>
                <p className="text-base md:text-xl mb-6 text-gray-800">{banner.subtitle}</p>
                <button className="bg-[var(--color-primary)] text-white text-sm font-medium px-8 py-3 rounded-lg inline-block border-0 cursor-pointer hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm">Xem ngay</button>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 md:w-1/2 flex items-center justify-center p-4">
                <img
                  alt={`${banner.title} - ${banner.subtitle}`}
                  className="object-contain w-full h-full mix-blend-multiply"
                  src={banner.img}
                  loading={index === 0 ? undefined : 'lazy'}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setCurrentIndex(index);
              }}
              aria-label={`Chuyển đến banner ${index + 1}: ${banners[index].title}`}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 border-0 p-0 ${
                currentIndex === index ? 'w-6 bg-nexa-blue' : 'w-2 bg-gray-400 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); handlePrev(); }}
          aria-label="Banner trước"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 text-gray-800 flex items-center justify-center hover:bg-white hover:shadow-md transition-all opacity-0 group-hover:opacity-100 z-20 border-0 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); handleNext(); }}
          aria-label="Banner tiếp theo"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 text-gray-800 flex items-center justify-center hover:bg-white hover:shadow-md transition-all opacity-0 group-hover:opacity-100 z-20 border-0 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Promo side banners — Right Block */}
      <div className="flex flex-col gap-[14px] h-full hidden md:flex">
        <div className="flex-1 bg-[#b9d7ea] p-4 flex flex-col justify-between relative rounded-[10px] overflow-hidden cursor-pointer border-[0.5px] border-[var(--border)] hover:shadow-md transition-shadow">
          <div>
            <h4 className="font-bold text-lg text-gray-900 leading-tight">Tuần lễ Laptop</h4>
            <p className="text-sm text-gray-800 mt-1">Deal đến 50%</p>
          </div>
          <img alt="Tuần lễ Laptop" className="self-end w-28 lg:w-32 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSpUHjWhPK24A4ejppWJoEAW9LhB732slfyFtDarQGXNdyLwDHgVmPCEgbHWLxH7QRVm8j31Rxm8UbnBuLoqcgNV2xHYslgkKTDaDtbRz8t0hSNVq89nSEt6BKfZNfgMgf0mwmANKsWZK0gFhab2MWZq9cDyFk2HQ8YDkp0JHNMoB2NsWq9ufEFEIeF71iJVg7DO5dPclAc7x09JS4uvFdAUPs5TpWM7VzIm3XzwhmmFyrrH8BrRN2vq8cKyjoeCQeKy4jRa8oAUYxV" />
        </div>
        <div className="flex-1 bg-[#3a3a3a] p-4 flex flex-col justify-between relative rounded-[10px] overflow-hidden cursor-pointer border-[0.5px] border-[#3a3a3a] hover:shadow-md transition-shadow">
          <div className="z-10">
            <h4 className="font-bold text-lg text-white leading-tight">Tai nghe SONY</h4>
            <p className="text-sm text-gray-300 mt-1">Âm thanh đỉnh cao</p>
          </div>
          <img alt="Tai nghe SONY" className="absolute -bottom-2 -right-2 w-32 lg:w-40 object-contain mix-blend-screen opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOFKyneMEd_OWF96GOMTMStWQIIiGrGb-A3MPSnZ1TBT-EEOiIJAPiRdIvvGC5LDawD0lt4C1tUUOAyMUOjeN-RQC_wzqmHXv0isnlmyMn2zijgzMYDfkNJh8sIoXKjkJV6JSB65c9N4oMMujqwo5G2aGkw0vw5gqjd1HWu1Z6VdbUzg66stwP88iJtGuZXkCjXwuv2Iqo36wvFN3nEW1H8KaQAgUQyvODVi5Sm-AIMYO68QHMxVE9P8J7nfVB_E5YhrwbeAkxiMp3G" />
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
