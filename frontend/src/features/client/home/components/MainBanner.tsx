import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clientHomeBannerApi } from '../clientHomeBannerApi';
import type { HomeBanner } from '../types';
import { BannerPosition } from '../types';

const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await clientHomeBannerApi.getActiveBanners();
        setBanners(res.data.data);
      } catch (error) {
        console.error('Error fetching home banners:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const heroBanners = banners.filter(b => b.position === BannerPosition.HOME_HERO).sort((a, b) => a.sortOrder - b.sortOrder);
  const sideTopBanner = banners.find(b => b.position === BannerPosition.HOME_SIDE_TOP);
  const sideBottomBanner = banners.find(b => b.position === BannerPosition.HOME_SIDE_BOTTOM);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === heroBanners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === heroBanners.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="h-auto md:h-[380px] flex flex-col md:grid md:grid-cols-[1fr_220px] lg:grid-cols-[1fr_260px] gap-4 lg:gap-6 animate-pulse">
        <div className="flex-1 rounded-2xl bg-surface-alt h-[200px] md:h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-text-muted animate-spin" />
        </div>
        <div className="flex flex-col gap-4 lg:gap-6 h-full hidden md:flex">
          <div className="flex-1 rounded-2xl bg-surface-alt"></div>
          <div className="flex-1 rounded-2xl bg-surface-alt"></div>
        </div>
      </div>
    );
  }

  // Fallback if no hero banners configured
  const displayHeroBanners = heroBanners.length > 0 ? heroBanners : [];

  return (
    <div className="h-auto md:h-[380px] flex flex-col md:grid md:grid-cols-[1fr_220px] lg:grid-cols-[1fr_260px] gap-4 lg:gap-6">
      {/* Main carousel — Left Block */}
      {displayHeroBanners.length > 0 ? (
        <div className="relative overflow-hidden group min-h-[200px] md:min-h-0 flex-1 rounded-2xl border border-border bg-surface shadow-sm hover:shadow-primary/10 hover:border-primary/20 transition-all">
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {displayHeroBanners.map((banner, index) => {
              const bgStyle = banner.backgroundColor ? { backgroundColor: banner.backgroundColor } : {};
              const title = banner.title || banner.product.name;
              const subtitle = banner.subtitle || '';
              const imageUrl = banner.imageUrl || banner.product.thumbnailUrl;
              
              // Simple heuristic to decide text color based on background color could be done, 
              // but we'll stick to a default assumption or use standard text colors.
              
              return (
                <div key={banner.id} className="w-full min-w-full h-full shrink-0 flex items-center p-6 md:p-10 relative bg-surface-alt" style={bgStyle}>
                  <div className="z-10 w-2/3 md:w-1/2">
                    <h2 className="text-2xl md:text-4xl font-bold mb-3 text-text line-clamp-2">{title}</h2>
                    {subtitle && <p className="text-base md:text-xl mb-6 text-text line-clamp-2">{subtitle}</p>}
                    <Link
                      to={`/products/${banner.product.slug}`}
                      className="bg-primary text-white text-sm font-bold px-8 py-3 rounded-xl inline-block border-0 hover:bg-primary-hover hover:-translate-y-0.5 transition-all shadow-sm shadow-primary/20"
                    >
                      Xem ngay
                    </Link>
                  </div>
                  <div className="absolute right-0 top-0 h-full w-1/3 md:w-1/2 flex items-center justify-center p-4">
                    {imageUrl && (
                      <img
                        alt={title}
                        className="object-contain w-full h-full mix-blend-multiply"
                        src={imageUrl}
                        loading={index === 0 ? undefined : 'lazy'}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots */}
          {displayHeroBanners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {displayHeroBanners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  aria-label={`Chuyển đến banner ${index + 1}`}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 border-0 p-0 ${
                    currentIndex === index ? 'w-6 bg-primary' : 'w-2 bg-border-strong hover:bg-surface'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Navigation buttons */}
          {displayHeroBanners.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); handlePrev(); }}
                aria-label="Banner trước"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/50 text-text flex items-center justify-center hover:bg-surface hover:shadow-md transition-all opacity-0 group-hover:opacity-100 z-20 border-0 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); handleNext(); }}
                aria-label="Banner tiếp theo"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/50 text-text flex items-center justify-center hover:bg-surface hover:shadow-md transition-all opacity-0 group-hover:opacity-100 z-20 border-0 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center text-text-muted">
          <p>Không có banner quảng cáo</p>
        </div>
      )}

      {/* Promo side banners — Right Block */}
      <div className="flex flex-col gap-4 lg:gap-6 h-full hidden md:flex">
        {sideTopBanner ? (
          <Link
            to={`/products/${sideTopBanner.product.slug}`}
            className="flex-1 bg-primary-soft/60 p-5 flex flex-col justify-between relative rounded-2xl overflow-hidden cursor-pointer border border-primary/10 hover:shadow-primary/10 hover:shadow-md transition-shadow"
            style={sideTopBanner.backgroundColor ? { backgroundColor: sideTopBanner.backgroundColor } : {}}
          >
            <div>
              <h3 className="font-bold text-lg text-text leading-tight line-clamp-2">
                {sideTopBanner.title || sideTopBanner.product.name}
              </h3>
              {sideTopBanner.subtitle && (
                <p className="text-sm text-text mt-1 line-clamp-2">{sideTopBanner.subtitle}</p>
              )}
            </div>
            {(sideTopBanner.imageUrl || sideTopBanner.product.thumbnailUrl) && (
              <img 
                alt="Top Side Banner" 
                className="self-end w-28 lg:w-32 object-contain mix-blend-multiply mt-2" 
                src={sideTopBanner.imageUrl || sideTopBanner.product.thumbnailUrl} 
              />
            )}
          </Link>
        ) : (
          <div className="flex-1 bg-surface-alt rounded-2xl border border-border border-dashed"></div>
        )}

        {sideBottomBanner ? (
          <Link
            to={`/products/${sideBottomBanner.product.slug}`}
            className="flex-1 bg-text p-5 flex flex-col justify-between relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={sideBottomBanner.backgroundColor ? { backgroundColor: sideBottomBanner.backgroundColor } : {}}
          >
            <div className="z-10">
              <h3 className={`font-bold text-lg leading-tight line-clamp-2 ${sideBottomBanner.backgroundColor ? 'text-text' : 'text-white'}`}>
                {sideBottomBanner.title || sideBottomBanner.product.name}
              </h3>
              {sideBottomBanner.subtitle && (
                <p className={`text-sm mt-1 line-clamp-2 ${sideBottomBanner.backgroundColor ? 'text-text-muted' : 'text-subtle'}`}>
                  {sideBottomBanner.subtitle}
                </p>
              )}
            </div>
            {(sideBottomBanner.imageUrl || sideBottomBanner.product.thumbnailUrl) && (
              <img 
                alt="Bottom Side Banner" 
                className={`absolute -bottom-2 -right-2 w-32 lg:w-40 object-contain ${sideBottomBanner.backgroundColor ? 'mix-blend-multiply' : 'mix-blend-screen'} opacity-90`} 
                src={sideBottomBanner.imageUrl || sideBottomBanner.product.thumbnailUrl} 
              />
            )}
          </Link>
        ) : (
          <div className="flex-1 bg-surface-alt rounded-2xl border border-border border-dashed"></div>
        )}
      </div>
    </div>
  );
};

export default MainBanner;
