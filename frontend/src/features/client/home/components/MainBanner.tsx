import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clientHomeBannerApi } from '../clientHomeBannerApi';
import { buttonVariants } from '../../../../components/common/buttonVariants';
import type { HomeBanner } from '../types';
import { BannerPosition } from '../types';

const isDarkBackground = (bgColor?: string | null) => {
  if (!bgColor) return false;
  let hex = bgColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq < 128;
};

const MainBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBanners = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await clientHomeBannerApi.getActiveBanners();
      setBanners(res.data.data);
    } catch (err) {
      console.error('Error fetching home banners:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners();
  }, [fetchBanners]);

  const heroBanners = banners.filter(b => b.position === BannerPosition.HOME_HERO).sort((a, b) => a.sortOrder - b.sortOrder);
  const activeHeroBanner = heroBanners.length > 0 ? heroBanners[0] : null;

  const sideTopBanner = banners.find(b => b.position === BannerPosition.HOME_SIDE_TOP);
  const sideBottomBanner = banners.find(b => b.position === BannerPosition.HOME_SIDE_BOTTOM);

  const getBannerImages = (banner: HomeBanner | null | undefined) => {
    if (!banner) return [];
    const urls = banner.product.imageUrls?.filter((url): url is string => Boolean(url?.trim())) ?? [];
    if (urls.length > 0) return urls;
    const fallback = banner.imageUrl || banner.product.thumbnailUrl;
    return fallback ? [fallback] : [];
  };

  const heroImageUrls = React.useMemo(() => getBannerImages(activeHeroBanner), [activeHeroBanner]);
  const topSideImageUrls = React.useMemo(() => getBannerImages(sideTopBanner), [sideTopBanner]);
  const bottomSideImageUrls = React.useMemo(() => getBannerImages(sideBottomBanner), [sideBottomBanner]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (heroImageUrls.length > 0 && currentImageIndex >= heroImageUrls.length) setCurrentImageIndex(0);
    if (topSideImageUrls.length > 0 && topIndex >= topSideImageUrls.length) setTopIndex(0);
    if (bottomSideImageUrls.length > 0 && bottomIndex >= bottomSideImageUrls.length) setBottomIndex(0);
  }, [heroImageUrls.length, topSideImageUrls.length, bottomSideImageUrls.length, currentImageIndex, topIndex, bottomIndex]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => heroImageUrls.length <= 1 ? prev : (prev === heroImageUrls.length - 1 ? 0 : prev + 1));
      setTopIndex((prev) => topSideImageUrls.length <= 1 ? prev : (prev === topSideImageUrls.length - 1 ? 0 : prev + 1));
      setBottomIndex((prev) => bottomSideImageUrls.length <= 1 ? prev : (prev === bottomSideImageUrls.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [heroImageUrls.length, topSideImageUrls.length, bottomSideImageUrls.length, isPaused]);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? heroImageUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === heroImageUrls.length - 1 ? 0 : prev + 1));
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

  if (error) {
    return (
      <div className="h-auto md:h-[380px] flex flex-col md:grid md:grid-cols-[1fr_220px] lg:grid-cols-[1fr_260px] gap-4 lg:gap-6">
        <div className="flex-1 rounded-2xl bg-surface border border-border h-[200px] md:h-full flex flex-col items-center justify-center text-text-muted gap-3">
          <p>Không thể tải banner lúc này.</p>
          <button
            type="button"
            onClick={fetchBanners}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors border-0 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
        <div className="flex flex-col gap-4 lg:gap-6 h-full hidden md:flex">
          <div className="flex-1 bg-surface-alt rounded-2xl border border-border border-dashed"></div>
          <div className="flex-1 bg-surface-alt rounded-2xl border border-border border-dashed"></div>
        </div>
      </div>
    );
  }

  // Fallback if no hero banners configured

  return (
    <div className="h-auto md:h-[380px] flex flex-col md:grid md:grid-cols-[1fr_220px] lg:grid-cols-[1fr_260px] gap-4 lg:gap-6">
      {/* Main carousel — Left Block */}
      {activeHeroBanner ? (
        <div 
          className="relative group min-h-[200px] md:min-h-0 flex-1 rounded-2xl border border-border bg-surface-alt shadow-sm hover:shadow-primary/10 hover:border-primary/20 transition-all flex items-center p-6 md:p-10"
          style={activeHeroBanner.backgroundColor ? { backgroundColor: activeHeroBanner.backgroundColor } : {}}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Static Content (Left Side) */}
          <div className="z-10 w-2/3 md:w-1/2">
            <h2 className={`text-2xl md:text-4xl font-bold mb-3 line-clamp-2 ${isDarkBackground(activeHeroBanner.backgroundColor) ? 'text-white' : 'text-text'}`}>
              {activeHeroBanner.title || activeHeroBanner.product.name}
            </h2>
            {activeHeroBanner.subtitle && (
              <p className={`text-base md:text-xl mb-6 line-clamp-2 ${isDarkBackground(activeHeroBanner.backgroundColor) ? 'text-white/80' : 'text-text'}`}>
                {activeHeroBanner.subtitle}
              </p>
            )}
            <Link
              to={`/products/${activeHeroBanner.product.slug}`}
              className={buttonVariants({ variant: 'primary', size: 'lg' })}
            >
              Xem ngay
            </Link>
          </div>

          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Đang hiển thị ảnh {currentImageIndex + 1} trên tổng số {heroImageUrls.length}
          </div>

          {/* Image Sliding Track (Right Side) */}
          {heroImageUrls.length > 0 && (
            <div className="absolute right-0 top-0 h-full w-1/3 md:w-1/2 flex items-center justify-center p-4 overflow-hidden">
              <div
                className="flex h-full w-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {heroImageUrls.map((imageUrl, index) => (
                  <div key={`${activeHeroBanner.id}-${imageUrl}-${index}`} className="w-full min-w-full h-full shrink-0 flex items-center justify-center">
                    <img
                      alt={activeHeroBanner.title || activeHeroBanner.product.name}
                      className="object-contain w-full h-full mix-blend-multiply"
                      src={imageUrl}
                      loading={index === 0 ? undefined : 'lazy'}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dots */}
          {heroImageUrls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroImageUrls.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`Chuyển đến ảnh ${index + 1}`}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 border-0 p-0 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1 ${
                    currentImageIndex === index ? 'w-6 bg-primary' : 'w-2 bg-border-strong hover:bg-surface'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Navigation buttons */}
          {heroImageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); handlePrev(); }}
                aria-label="Ảnh trước"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/50 text-text flex items-center justify-center hover:bg-surface hover:shadow-md transition-all opacity-100 md:opacity-0 group-hover:opacity-100 z-20 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); handleNext(); }}
                aria-label="Ảnh tiếp theo"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/50 text-text flex items-center justify-center hover:bg-surface hover:shadow-md transition-all opacity-100 md:opacity-0 group-hover:opacity-100 z-20 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <ChevronRight className="w-6 h-6" />
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
            {(topSideImageUrls.length > 0) && (
              <div className="self-end w-28 lg:w-32 h-24 lg:h-32 mt-2 relative overflow-hidden">
                <div 
                  className="flex h-full w-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${topIndex * 100}%)` }}
                >
                  {topSideImageUrls.map((url, i) => (
                    <div key={i} className="w-full h-full min-w-full shrink-0 flex items-center justify-end">
                      <img 
                        alt="Top Side Banner" 
                        className="w-full h-full object-contain mix-blend-multiply" 
                        src={url} 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
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
            {(bottomSideImageUrls.length > 0) && (
              <div className="absolute -bottom-2 -right-2 w-32 lg:w-40 h-32 lg:h-40 overflow-hidden pointer-events-none">
                <div 
                  className="flex h-full w-full transition-transform duration-500 ease-out pointer-events-none"
                  style={{ transform: `translateX(-${bottomIndex * 100}%)` }}
                >
                  {bottomSideImageUrls.map((url, i) => (
                    <div key={i} className="w-full h-full min-w-full shrink-0 flex items-center justify-end pointer-events-none">
                      <img 
                        alt="Bottom Side Banner" 
                        className={`w-full h-full object-contain ${sideBottomBanner.backgroundColor ? 'mix-blend-multiply' : 'mix-blend-screen'} opacity-90`} 
                        src={url} 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
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
