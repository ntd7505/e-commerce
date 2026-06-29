import React, { useState } from 'react';
import type { ProductMediaResponse } from '../../../../features/client/home/clientProductApi';
import { ShieldCheck, RotateCcw, PenTool, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  media: ProductMediaResponse[];
  productName: string;
}

export default function ProductGallery({ media, productName }: ProductGalleryProps) {
  // Filter active, sort by sortOrder. Thumbnail is prioritized.
  const activeMedia = [...media]
    .filter(m => m.active !== false)
    .sort((a, b) => {
      if (a.thumbnail === b.thumbnail) return a.sortOrder - b.sortOrder;
      return a.thumbnail ? -1 : 1;
    });

  const defaultImage = activeMedia.length > 0 ? activeMedia[0].url : '';

  const [activeImage, setActiveImage] = useState<string>('');
  
  const currentIndex = activeImage 
    ? activeMedia.findIndex(m => m.url === activeImage)
    : (activeMedia.length > 0 ? 0 : -1);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeMedia.length <= 1) return;
    const nextIdx = (currentIndex - 1 + activeMedia.length) % activeMedia.length;
    setActiveImage(activeMedia[nextIdx].url);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeMedia.length <= 1) return;
    const nextIdx = (currentIndex + 1) % activeMedia.length;
    setActiveImage(activeMedia[nextIdx].url);
  };

  // Swipe logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div className="lg:w-[400px] xl:w-[450px] flex flex-col gap-3 shrink-0">
      <div 
        className="relative w-full aspect-square rounded-2xl bg-surface border border-border overflow-hidden group touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndEvent}
      >
        {activeMedia.length > 0 ? (
          <>
            <div 
              className="absolute inset-4 flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {activeMedia.map((item) => (
                <div key={item.id} className="w-full h-full flex-shrink-0 flex items-center justify-center p-2">
                  <img 
                    src={item.url} 
                    alt={item.altText || productName} 
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                </div>
              ))}
            </div>

            {activeMedia.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur border border-border shadow-sm text-text rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-105 hover:text-primary z-20"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5 ml-[-2px]" />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur border border-border shadow-sm text-text rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-105 hover:text-primary z-20"
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight className="w-5 h-5 mr-[-2px]" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-sm font-medium">Chưa có ảnh</div>
        )}
      </div>
      
      {activeMedia.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {activeMedia.slice(0, 5).map((item, index) => {
            const isLast = index === 4;
            const remaining = activeMedia.length - 5;
            
            if (isLast && remaining > 0) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveImage(item.url)}
                  className="relative aspect-square rounded-lg border border-border overflow-hidden bg-surface hover:border-primary transition-all group"
                >
                  <img 
                    src={item.url} 
                    alt={item.altText || productName} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs font-medium text-white">
                    +{remaining}
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveImage(item.url)}
                className={`aspect-square rounded-lg overflow-hidden bg-surface transition-all ${
                  index === currentIndex 
                    ? 'border-2 border-primary' 
                    : 'border border-border hover:border-primary'
                }`}
              >
                <img 
                  src={item.url} 
                  alt={item.altText || productName} 
                  className="w-full h-full object-cover" 
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-text font-medium">Chính hãng 100%</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-text font-medium">Đổi trả 30 ngày</span>
        </div>
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-text font-medium">Bảo hành chính hãng</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-text font-medium">Giao nhanh 2h</span>
        </div>
      </div>
    </div>
  );
}
